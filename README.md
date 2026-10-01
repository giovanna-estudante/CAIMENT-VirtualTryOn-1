# CAIMENT — Frontend

Frontend completo do CAIMENT, plataforma de provador virtual inteligente.
Este é apenas o frontend: sem backend, sem banco de dados e sem integração
real com o Tripo AI. Tudo o que precisa desses recursos usa dados mockados
ou simulações locais.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

## Stack

React · Vite · TypeScript · Tailwind CSS v4 · React Router · Lucide React ·
Three.js · React Three Fiber · @react-three/drei

## Estrutura

```
src/
├── components/   # componentes reutilizáveis (layout, ui, avatar, clothing, upload, dashboard, caia)
├── pages/        # uma pasta por tela
├── data/mock/    # todos os dados mockados, isolados dos componentes
├── types/        # tipos de domínio, incluindo os pontos de integração com o Tripo AI
├── services/     # simulações de geração de avatar e recomendação de tamanho
├── hooks/
└── utils/
```

## Fluxo de navegação

```
/  (Landing)
├── /login
├── /cadastro → /verificacao → /avatar-criacao
└── /dashboard
    ├── /avatar-criacao → /avatar-criacao/processando → /avatar
    ├── /avatar
    ├── /medidas
    ├── /provador
    ├── /guarda-roupa
    ├── /favoritos
    ├── /historico
    └── /configuracoes
```




