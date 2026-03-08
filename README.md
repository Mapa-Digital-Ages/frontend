# Mapa Digital

Projeto React + Vite + TypeScript + Material-UI (MUI)

## 🚀 Tecnologias

- **React 19** - Biblioteca para construção de interfaces
- **Vite 7** - Build tool rápida e moderna
- **TypeScript** - Tipagem estática para maior previsibilidade e escalabilidade
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router** - Roteamento da aplicação
- **ESLint** - Linter para JavaScript/React
- **Prettier** - Formatador de código
- **GitHub Actions** - CI/CD pipeline

## 📦 Instalação

```bash
npm install
```

Opcional:

```bash
cp .env.example .env
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento com hot-reload em `http://localhost:5173`

### Build de Produção

```bash
npm run build
```

Cria a versão otimizada para produção na pasta `dist/`

### Typecheck

```bash
npm run typecheck
```

Executa a validação de tipos com TypeScript

### Preview da Build

```bash
npm run preview
```

Visualiza a build de produção localmente

### Lint

```bash
npm run lint          # Verifica problemas no código
npm run lint:fix      # Corrige problemas automaticamente
```

### Formatação

```bash
npm run format        # Formata o código com Prettier
npm run format:check  # Verifica se o código está formatado
```

### Validação Completa

```bash
npm run validate      # Executa lint e verificação de formatação
```

Executa `lint`, `format:check` e `typecheck`

## Arquitetura de Rotas

- As rotas são agregadas em `src/router/index.tsx`
- Cada domínio possui seu próprio arquivo `route.tsx` em `src/pages/<dominio>/`
- Os paths da aplicação ficam centralizados em `src/constants/routes.ts`
- Guards de acesso ficam em `src/components/common`
- Componentes globais ficam em `src/components/ui` e `src/components/common`
- Componentes específicos de domínio ficam em `src/pages/<dominio>/components`

## Estrutura do Projeto

```
.
├── .github/           # GitHub Actions
├── public/            # Arquivos estáticos
├── src/
│   ├── assets/         # Imagens, ícones e logos
│   ├── components/     # Componentes globais e reutilizáveis
│   ├── constants/      # Constantes da aplicação
│   ├── context/        # Contextos globais
│   ├── hooks/          # Hooks customizados
│   ├── layouts/        # Layouts base
│   ├── pages/          # Páginas por domínio e componentes locais
│   ├── router/         # Agregador central do router
│   ├── services/       # Serviços e camada HTTP
│   ├── styles/         # Tema MUI e estilos globais
│   ├── types/          # Tipagens compartilhadas
│   ├── utils/          # Funções utilitárias
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
├── dist/               # Build de produção (gerado)
├── package.json
└── vite.config.ts
```

## Material-UI

O projeto está configurado com Material-UI. Exemplo de uso:

```tsx
import { Button, Typography } from '@mui/material'

function MyComponent() {
  return (
    <>
      <Typography variant="h1">Olá Mundo</Typography>
      <Button variant="contained">Clique aqui</Button>
    </>
  )
}
```

## Configuração do Editor

Recomenda-se usar as seguintes extensões no VS Code:

- ESLint
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets

## Contribuindo

1. Certifique-se de que o código está formatado: `npm run format`
2. Verifique se não há erros de lint: `npm run lint`
3. Execute a validação completa: `npm run validate`
4. Teste a build: `npm run build`
5. GitHub é o repositório principal; qualquer item de GitLab/mirror está `skipped` por enquanto
