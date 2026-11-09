# Inventário de Celulares

Sistema composto por interface web/PWA, API Express, aplicativo desktop Electron e ferramentas auxiliares.

## Estrutura

- `public/`: páginas HTML, CSS, JavaScript do navegador, PWA, imagens e ferramentas web.
- `api/index.js`: ponto de entrada serverless da Vercel.
- `server.js`: aplicação Express e rotas da API.
- `queries.js`: acesso ao PostgreSQL.
- `desktop/`: aplicativo Electron para Windows.
- `desktop/zebra/`: aplicativo Electron auxiliar da Zebra.
- `scripts/migrations/`: scripts de migração de dados.
- `archive/`: versões antigas preservadas, fora da publicação web.

## Executar localmente

Requisitos: Node.js 20 ou superior e variáveis de ambiente do PostgreSQL configuradas em `.env`.

```bash
npm ci
npm start
```

A interface abre em `http://localhost:3000`; o health check fica em `/api/health`.

## Vercel

O arquivo `vercel.json` direciona as requisições para `api/index.js`. A configuração `includeFiles` inclui `public/**` no pacote serverless, e o Express entrega esses arquivos por meio de `express.static`. Assim, HTML, CSS, JavaScript, imagens, manifest e service worker são publicados juntos.

Configure as variáveis `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` e `DB_PORT` no projeto Vercel para habilitar as rotas que usam PostgreSQL.

## Aplicativo Windows

```bash
npm run desktop
npm run dist:win
```

O instalador NSIS é gerado em `release/`. O app inclui a pasta `public/` e carrega a interface de `public/celular.rubertt.html`.

## Migrações

O script principal legado pode ser executado a partir da raiz com:

```bash
node scripts/migrations/migration_script.js
```

A versão alternativa está em `scripts/migrations/celular/`.
