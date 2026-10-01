const localApi = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isLovableCloudConfigured = Boolean(supabaseUrl && supabaseKey);

function lovableFunctionUrl() {
  return `${supabaseUrl}/functions/v1/tripo-avatar`;
}

export async function generateAvatar(formData: FormData) {
  if (isLovableCloudConfigured) {
    const response = await fetch(lovableFunctionUrl(), {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: formData,
    });
    return parseResponse(response);
  }

  const response = await fetch(`${localApi}/avatar/generate`, {
    method: 'POST',
    body: formData,
  });
  return parseResponse(response);
}

export async function getAvatarTask(taskId: string) {
  if (isLovableCloudConfigured) {
    const response = await fetch(`${lovableFunctionUrl()}?taskId=${encodeURIComponent(taskId)}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    return parseResponse(response);
  }

  const response = await fetch(`${localApi}/avatar/task/${encodeURIComponent(taskId)}`);
  return parseResponse(response);
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || 'Não foi possível concluir a operação.');
  }

  return data;
}
