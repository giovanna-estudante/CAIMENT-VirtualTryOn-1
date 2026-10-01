const TRIPO_API_URL = 'https://openapi.tripo3d.ai/v3';

function getApiKey(): string {
  const apiKey = process.env.TRIPO_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      'TRIPO_API_KEY não encontrada no arquivo .env'
    );
  }

  return apiKey;
}

interface TripoUploadResponse {
  code: number;
  message?: string;
  data?: {
    file_token?: string;
  };
}

interface TripoTaskResponse {
  code: number;
  message?: string;
  data?: {
    task_id?: string;
  };
}

/**
 * Upload de uma imagem para o Tripo V3
 */
export async function uploadImage(
  file: Express.Multer.File
): Promise<string> {
  const apiKey = getApiKey();

  if (!file?.buffer) {
    throw new Error('Arquivo de imagem inválido.');
  }

  console.log('');
  console.log('====================================');
  console.log('⬆️ UPLOAD PARA O TRIPO V3');
  console.log('====================================');
  console.log(`Arquivo: ${file.originalname}`);
  console.log(`Tipo: ${file.mimetype}`);
  console.log(`Tamanho: ${file.size} bytes`);

  const formData = new FormData();

  const blob = new Blob([file.buffer], {
    type: file.mimetype,
  });

  formData.append(
    'file',
    blob,
    file.originalname
  );

  const response = await fetch(
    `${TRIPO_API_URL}/files`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  const text = await response.text();

  console.log(
    `📡 Tripo upload → HTTP ${response.status}`
  );

  console.log(
    `📨 Resposta: ${text}`
  );

  if (!response.ok) {
    throw new Error(
      `Tripo recusou o upload (${response.status}): ${text}`
    );
  }

  let data: TripoUploadResponse;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Resposta inválida do Tripo durante o upload: ${text}`
    );
  }

  if (data.code !== 0) {
    throw new Error(
      `Tripo retornou erro no upload. Código ${data.code}: ${
        data.message ?? text
      }`
    );
  }

  const fileToken = data.data?.file_token;

  if (!fileToken) {
    throw new Error(
      `Tripo não retornou file_token: ${text}`
    );
  }

  console.log(
    `✅ Upload concluído: ${fileToken}`
  );

  return fileToken;
}

/**
 * Cria uma tarefa Multiview → 3D
 */
export async function createMultiviewTask(
  imageTokens: {
    front: string;
    left: string;
    back: string;
    right: string;
  }
): Promise<string> {
  const apiKey = getApiKey();

  console.log('');
  console.log('====================================');
  console.log('🤖 CRIANDO AVATAR 3D');
  console.log('====================================');

  const body = {
    inputs: [
      {
        front: imageTokens.front,
      },
      {
        left: imageTokens.left,
      },
      {
        back: imageTokens.back,
      },
      {
        right: imageTokens.right,
      },
    ],

    model: 'v3.1-20260211',

    texture: true,
    pbr: true,

    texture_quality: 'standard',
    geometry_quality: 'standard',

    export_uv: true,
  };

  console.log(
    '📦 Payload enviado ao Tripo:'
  );

  console.log(
    JSON.stringify(body, null, 2)
  );

  const response = await fetch(
    `${TRIPO_API_URL}/generation/multiview-to-model`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(body),
    }
  );

  const text = await response.text();

  console.log('');
  console.log(
    `📡 Tripo geração → HTTP ${response.status}`
  );

  console.log(
    `📨 Resposta: ${text}`
  );

  if (!response.ok) {
    throw new Error(
      `Tripo recusou a criação do avatar (${response.status}): ${text}`
    );
  }

  let data: TripoTaskResponse;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Resposta inválida do Tripo ao criar avatar: ${text}`
    );
  }

  if (data.code !== 0) {
    throw new Error(
      `Tripo retornou erro ao criar avatar. Código ${data.code}: ${
        data.message ?? text
      }`
    );
  }

  const taskId = data.data?.task_id;

  if (!taskId) {
    throw new Error(
      `Tripo não retornou task_id: ${text}`
    );
  }

  console.log('');
  console.log(
    '🎯 TASK CRIADA COM SUCESSO!'
  );

  console.log(
    `Task ID: ${taskId}`
  );

  return taskId;
}

/**
 * Consulta o status de uma tarefa
 */
export async function getTask(
  taskId: string
) {
  const apiKey = getApiKey();

  if (!taskId) {
    throw new Error(
      'Task ID não informado.'
    );
  }

  console.log('');
  console.log(
    `🔎 Consultando task: ${taskId}`
  );

  const response = await fetch(
    `${TRIPO_API_URL}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const text = await response.text();

  console.log(
    `📡 Consulta → HTTP ${response.status}`
  );

  console.log(
    `📨 Resposta: ${text}`
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao consultar tarefa no Tripo (${response.status}): ${text}`
    );
  }

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Resposta inválida do Tripo: ${text}`
    );
  }

  if (data.code !== 0) {
    throw new Error(
      `Tripo retornou erro na consulta. Código ${data.code}: ${
        data.message ?? text
      }`
    );
  }

  return data.data;
}

/**
 * Baixa o modelo 3D do Tripo pelo BACKEND
 *
 * Isso evita o problema de CORS que acontece
 * quando o navegador tenta acessar diretamente
 * o domínio tripo-data.rg1.data.tripo3d.com
 */
export async function downloadModel(
  modelUrl: string
): Promise<Buffer> {
  if (!modelUrl) {
    throw new Error(
      'URL do modelo 3D não informada.'
    );
  }

  console.log('');
  console.log('====================================');
  console.log('📥 BAIXANDO MODELO 3D DO TRIPO');
  console.log('====================================');

  console.log(
    `URL recebida: ${modelUrl}`
  );

  try {
    const response = await fetch(modelUrl);

    console.log(
      `📡 Download do modelo → HTTP ${response.status}`
    );

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        `Tripo recusou o download do modelo (${response.status}): ${text}`
      );
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      throw new Error(
        'O Tripo retornou um modelo vazio.'
      );
    }

    console.log(
      `✅ Modelo baixado com sucesso!`
    );

    console.log(
      `📦 Tamanho: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`
    );

    return buffer;

  } catch (error) {
    console.error(
      '❌ Erro ao baixar modelo do Tripo:',
      error
    );

    throw error;
  }
}