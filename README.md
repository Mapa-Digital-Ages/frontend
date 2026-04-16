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

## 📦 Dependências e Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v24
- [npm](https://www.npmjs.com/) v9 ou superior (já incluído com o Node.js)

Verifique se já possui as versões corretas instaladas:

```bash
node -v
npm -v
```

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Mapa-Digital-Ages/frontend.git
cd frontend
```

2. Instale as dependências:

```bash
npm i
```

3. Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

### Rodando em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🐳 Rodando com Docker

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/Mapa-Digital-Ages/frontend.git
cd frontend
```

2. Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

3. Suba a aplicação:

```bash
docker compose up -d
```

A aplicação estará disponível em `http://localhost:5173`

### Outros comandos úteis

```bash
docker compose logs -f           # Acompanhar logs em tempo real
docker compose down              # Parar e remover os containers
docker compose down -v           # Parar e remover containers e volumes
```

## 🛠️ Scripts Disponíveis

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

### Testes

```bash
npm test
npm run coverage
```

Executa os testes automatizados com Jest. O script `npm test` roda todos os arquivos `src/tests/**/*.test.tsx`.

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
npm run validate      # Executa lint, format:check e typecheck
```

## 🧭 Objetivo da arquitetura

A pasta `src` separa três camadas com responsabilidades fixas:

| Camada         | Objetivo                                                                                                                   | Expectativa                                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`app/`**     | Casca da aplicação (roteamento, layouts, navegação, tema, autenticação em React, controle de acesso).                      | Código que **não pertence a um perfil de usuário** (aluno, responsável, admin, etc.), mas orquestra todos eles. Mudanças aqui costumam afetar **toda** a UI.                                                     |
| **`modules/`** | Funcionalidades por **domínio de produto / persona** (o que cada tipo de usuário “faz” no sistema).                        | Cada módulo expõe rotas via `route.tsx` e agrupa **features** (subpastas) com página, serviços e UI específicos. Evite importar um módulo “irmão” diretamente; prefira `shared/` ou contratos mínimos em `app/`. |
| **`shared/`**  | Biblioteca interna reutilizável (UI genérica, HTTP, storage, tipos e utilitários sem regra de negócio de um único módulo). | Se algo serve a **dois ou mais** módulos ou é infraestrutura (cliente HTTP, formatação), vai para `shared/`. Não coloque regras de fluxo de um domínio único aqui.                                               |

Alias de importação: `@/*` aponta para `src/*` (ver `tsconfig`).

---

## 🗂️ `src/app/` — casca e infraestrutura de UI

| Pasta / arquivo         | O que deve existir aqui                                                                                                                                                         | O que **não** deve                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **`router/`**           | `index.tsx` monta o `createBrowserRouter` importando `route.tsx` de cada módulo. `paths.ts` concentra strings de rota e helpers (`APP_ROUTES`, rotas padrão por papel).         | Páginas de negócio ou formulários; isso fica em `modules/`.  |
| **`router/guards.tsx`** | Reexporta ou adapta guards de `access/` para o router.                                                                                                                          | Lógica de API ou DTOs.                                       |
| **`layout/`**           | Layouts que envolvem várias rotas (`AuthLayout`, `DashboardLayout`, `PublicLayout`).                                                                                            | Componentes de uma única feature.                            |
| **`navigation/`**       | Itens de menu / composição da sidebar por papel (`items/*.tsx`, `index.tsx`).                                                                                                   | Chamadas HTTP; apenas links, labels e estrutura.             |
| **`auth/`**             | `context.tsx`: `AuthProvider` e `AuthContext`. `hook.ts`: consumo do contexto. `core/`: tipos e serviço de auth **sem** JSX.                                                    | Telas de login; elas ficam em `modules/auth/`.               |
| **`theme/`**            | `mode/context.tsx` (ou provider de tema): modo claro/escuro e `ThemeProvider` MUI. `core/`: `createAppTheme`, paleta, tipografia. `styles/global.css`: reset e estilos globais. | Componentes de página de negócio.                            |
| **`access/`**           | `guard.tsx`: `ProtectedRoute`, `RoleRoute`. `hook.ts` e `core/`: papéis, permissões, serviço de verificação de acesso.                                                          | Telas; apenas proteção de rotas e regras de quem entra onde. |

**Expectativa:** `app/` permanece **fino**: composição, constantes de rota, providers globais e guards. Tudo que é “tela de fluxo de negócio” escapa para `modules/`.

---

## 📦 `src/modules/` — domínios e features

Cada módulo de primeiro nível representa um **contexto de uso** (ex.: `student`, `parent`, `admin`, `school`, `company`, `auth`) ou transversal (`common`: 404, unauthorized, redirect).

### Arquivo raiz do módulo

- **`route.tsx`**: define `RouteObject[]` (ou fragmento) para esse domínio. Importa páginas de `*/page/Page.tsx` (ou equivalentes) e aplica layouts vindos de `@/app/layout/...` quando necessário.

### Feature (subpasta dentro do módulo)

Uma **feature** é um fluxo coeso (ex.: `admin/approvals`, `student/performance`). Estrutura **esperada** quando a feature crescer:

| Subpasta          | Expectativa                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **`page/`**       | Componentes de rota (ex.: `Page.tsx`). Orquestram layout, dados e filhos; preferir lógica pesada em hooks ou services. |
| **`components/`** | UI **somente** dessa feature. Se outro módulo precisar, extrair para `shared/ui` ou para um módulo que faça sentido.   |
| **`hooks/`**      | Hooks que combinam estado local, queries e efeitos **dessa** feature.                                                  |
| **`services/`**   | Acesso a API, mapeamento DTO → UI, repositórios. Sem JSX.                                                              |
| **`types/`**      | Tipos e interfaces da feature (`types.ts` ou `types/types.ts`).                                                        |

**Pastas vazias (`components/`, `hooks/`, etc.):** não é obrigatório manter todas as pastas em toda feature. O padrão é **criar a pasta no momento em que o primeiro arquivo real existir** (evita árvore cheia de diretórios vazios). Se ainda existirem pastas vazias no repositório, podem ser removidas com segurança até que alguém adicione código — o Git não rastreia diretório vazio.

### `shared` dentro de um módulo (ex.: `admin/shared/`)

Usado para **código compartilhado entre features do mesmo módulo** (tipos de admin, helpers). Não deve virar um segundo `src/shared`; se algo passa a servir a outro módulo, avaliar subir para `src/shared/`.

---

## 🔧 `src/shared/` — biblioteca interna

| Pasta              | Expectativa                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **`ui/`**          | Componentes visuais genéricos (botões, cards, modais, sidebar, barras de busca) **sem** regra de negócio de um único domínio. |
| **`lib/http/`**    | Cliente HTTP, interceptors.                                                                                                   |
| **`lib/storage/`** | Cookies, `localStorage`, etc.                                                                                                 |
| **`hooks/`**       | Hooks realmente transversais (ex.: breakpoint).                                                                               |
| **`utils/`**       | Funções puras reutilizáveis.                                                                                                  |
| **`types/`**       | Tipos usados em vários módulos (`user`, `api`, …).                                                                            |
| **`constants/`**   | Constantes globais.                                                                                                           |
| **`assets/`**      | SVGs e imagens compartilhadas.                                                                                                |

---

## 🧪 Testes

- Arquivos em **`src/tests/`** com sufixo **`.test.tsx`**.
- Execução via **Jest** com `npm test`.
- Use os helpers em **`src/tests/helpers/`** para leitura de arquivos e asserções comuns.

---

## 📁 Estrutura resumida (árvore atual)

```
frontend/
├── public/
├── src/
│   ├── app/               # Router, layouts, navigation, auth/theme/access
│   ├── modules/           # Domínios: auth, student, parent, admin, school, company, common
│   ├── shared/            # UI, lib, utils, types, constants
│   └── tests/             # Testes (Jest)
│   ├── App.tsx
│   └── main.tsx
├── dist/                  # Build (gerado)
├── package.json
└── vite.config.ts
```

## 🎨 Material-UI

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

## 📝 Padrões de Nomenclatura

### Pastas

- Letras minúsculas, separadas por hífen se necessário
- Organizadas por domínio/funcionalidade (ex: `admin`, `auth`, `student`)

### Arquivos

| Tipo                 | Padrão                                    | Exemplo                            |
| -------------------- | ----------------------------------------- | ---------------------------------- |
| Componentes `.tsx`   | PascalCase                                | `LoginForm.tsx`                    |
| Páginas `.tsx`       | PascalCase; em `page/Page.tsx` da feature | `modules/auth/login/page/Page.tsx` |
| Layouts `.tsx`       | PascalCase + sufixo `Layout`              | `AuthLayout.tsx`                   |
| Hooks `.ts`          | camelCase prefixado com `use`             | `useAuth.ts`                       |
| Serviços `.ts`       | camelCase + sufixo `.service`             | `auth.service.ts`                  |
| Contextos `.ts/.tsx` | camelCase + sufixo `Context`              | `AuthContext.tsx`                  |
| Tipos `.ts`          | camelCase descritivo                      | `user.ts`                          |
| Utilitários `.ts`    | camelCase, plural                         | `formatters.ts`                    |
| Constantes `.ts`     | camelCase descritivo                      | `routes.ts`                        |
| Estilos `.css/.ts`   | camelCase                                 | `theme.ts`                         |

## 🌿 Padrão de Nome de Branch

As branches devem ter as iniciais do nome do responsavel pela branch seguida por uma breve descrição da tarefa em inglês, em kebab-case:

```
gv/short-task-description
```

Exemplos:

```
gg/user-authentication
nd/login-redirect-fix
js/update-eslint-config
am/api-service-layer
ps/update-readme-docker
```

## ⚙️ Configuração do Editor

Recomenda-se usar as seguintes extensões no VS Code:

- ESLint
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets

## 🤝 Contribuindo

1. Certifique-se de que o código está formatado: `npm run format`
2. Verifique se não há erros de lint: `npm run lint`
3. Execute a validação completa: `npm run validate`
4. Teste a build: `npm run build`
5. GitHub é o repositório principal
