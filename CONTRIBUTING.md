# Contribuindo com o frontend

## Pré-requisitos

- Node.js `24.14.0` (LTS) (ver `.nvmrc`)
- npm

## Padrão de Nome de Branch

As branches devem ter uma breve descrição da tarefa em inglês, em kebab-case:

```
short-task-description
```

Exemplos:

```
user-authentication
login-redirect-fix
update-eslint-config
api-service-layer
update-readme-docker
```

## Padrões de Nomenclatura

### Pastas

- Letras minúsculas, separadas por hífen se necessário
- Organizadas por domínio/funcionalidade (ex: `admin`, `auth`, `student`)

### Arquivos

| Tipo                 | Padrão                        | Exemplo           |
| -------------------- | ----------------------------- | ----------------- |
| Componentes `.tsx`   | PascalCase                    | `LoginForm.tsx`   |
| Páginas `.tsx`       | PascalCase + sufixo `Page`    | `LoginPage.tsx`   |
| Layouts `.tsx`       | PascalCase + sufixo `Layout`  | `AuthLayout.tsx`  |
| Hooks `.ts`          | camelCase prefixado com `use` | `useAuth.ts`      |
| Serviços `.ts`       | camelCase + sufixo `.service` | `auth.service.ts` |
| Contextos `.ts/.tsx` | camelCase + sufixo `Context`  | `AuthContext.tsx` |
| Tipos `.ts`          | camelCase descritivo          | `user.ts`         |
| Utilitários `.ts`    | camelCase, plural             | `formatters.ts`   |
| Constantes `.ts`     | camelCase descritivo          | `routes.ts`       |
| Estilos `.css/.ts`   | camelCase                     | `theme.ts`        |

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
