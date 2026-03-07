# Mapa Digital

Projeto React + Vite + Material-UI (MUI)

## 🚀 Tecnologias

- **React 19** - Biblioteca para construção de interfaces
- **Vite 7** - Build tool rápida e moderna
- **Material-UI (MUI)** - Biblioteca de componentes React
- **ESLint** - Linter para JavaScript/React
- **Prettier** - Formatador de código
- **GitHub Actions** - CI/CD pipeline

## 📦 Instalação

```bash
npm install
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

## Estrutura do Projeto

```
mapa-digital/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── layouts/        # Layouts
│   ├── hooks/          # Custom hooks
│   ├── context/        # Context API
│   ├── services/       # Serviços e APIs
│   ├── utils/          # Funções utilitárias
│   ├── router/         # Configuração de rotas
│   ├── constants/      # Constantes
│   ├── styles/         # Estilos globais
│   ├── assets/         # Imagens e recursos
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Entry point
├── public/             # Arquivos estáticos
└── dist/              # Build de produção (gerado)
```

## Material-UI

O projeto está configurado com Material-UI. Exemplo de uso:

```jsx
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
