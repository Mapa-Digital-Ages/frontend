# Contribuindo com o frontend

## Pré-requisitos

- Node.js `24.14.0` (LTS) (ver `.nvmrc`)
- npm

## Fluxo recomendado

1. Trabalhe na raiz do repositório.
2. Instale dependências com `npm install`.
3. Crie sua branch a partir da branch principal.
4. Faça mudanças pequenas, coerentes e tipadas.

## Antes de abrir PR

Execute:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## Convenções

- Use TypeScript para toda nova implementação.
- Não faça requisições HTTP diretamente em páginas.
- Componentes reutilizáveis ficam em `src/components`.
- Componentes específicos de página ficam em `src/pages/<dominio>/components`.
- Tema e identidade visual passam por `src/styles`.
- Rotas devem ser declaradas em `src/pages/<dominio>/route.tsx`.

## Repositórios

- GitHub é o repositório principal.
- GitLab CI e mirror estão `skipped` e pendentes para setup futuro.
