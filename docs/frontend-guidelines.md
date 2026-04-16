# Frontend Guidelines

## Fonte

- Fonte oficial: `Space Grotesk`
- Arquivo versionado no repositório: `public/fonts/space-grotesk/SpaceGrotesk-VariableFont_wght.ttf`
- Pontos de uso:
  - `src/styles/global.css`
  - `src/styles/typography.ts`

## Paleta

- Fonte de verdade da paleta: `src/styles/AppColors.ts`
- Mapeamento para o tema MUI: `src/styles/palette.ts`
- Uso esperado:
  - preferir `theme.palette.*` em componentes MUI
  - preferir variáveis `--app-*` em estilos globais e utilitários
  - evitar hex e `rgba(...)` hardcoded em componentes de tela, salvo casos derivados do `subjectThemes`

## Radius

- Controle e inputs: `12px`
- Cards: `20px`
- Containers de página: `24px`
- Pills e chips: `9999px`
- Tokens globais:
  - `--app-radius-control`
  - `--app-radius-card`
  - `--app-radius-page`
  - `--app-radius-pill`

## Botões

- Base visual em `src/components/ui/AppButton.tsx` e `src/styles/theme.ts`
- Regras:
  - usar `textTransform: none`
  - manter radius de controle
  - usar tokens de cor do tema para fundo, texto e hover
  - preferir variantes por intenção em vez de valores arbitrários

## Cards

- Cards reutilizáveis partem de `AppCard` ou seguem os mesmos tokens
- Cards específicos, como os de disciplina, devem respeitar:
  - fundo `background.paper`
  - borda `background.border`
  - radius de card
  - sombra do sistema

## Páginas

- Cada domínio continua responsável por suas telas em `src/pages/<dominio>`
- Componentes reutilizáveis ficam em `src/components/ui`
- Tipagens compartilhadas ficam em `src/types`
- Páginas devem usar `AppPageContainer` como base de espaçamento

## Organização

- `src/services`: serviços e camada HTTP
- `src/types`: contratos e tipagens compartilhadas
- `src/pages`: composição de tela e arquivos locais de domínio
- evitar arquivos em `pages` com nome de API ou serviço quando eles só contiverem tipos
