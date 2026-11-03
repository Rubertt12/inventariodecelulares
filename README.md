# Inventário de Celulares

## Aplicativo desktop para Windows

O app desktop usa Electron e mantém os dados na pasta escolhida dentro do sistema. O arquivo `.env` e os bancos locais não são incluídos no instalador.

Requisitos para desenvolvimento: Node.js 24.

```bash
npm ci
npm run desktop
```

Para gerar o instalador NSIS em uma máquina Windows:

```bash
npm run dist:win
```

O instalador será criado em `release/`. Para gerar no GitHub, envie o projeto ao repositório, abra **Actions > Build Windows Installer > Run workflow** e baixe o artefato `inventario-celulares-windows` ao final.

Para gerar apenas o app Windows sem instalador, inclusive a partir de Linux:

```bash
npm exec electron-builder -- --win --dir
```

O executável fica em `release/win-unpacked/Inventario de Celulares VOKE.exe`. Distribua a pasta `win-unpacked` completa, não apenas o `.exe`.

O app ainda carrega algumas bibliotecas por CDN; esses recursos precisam de conexão com a internet. A impressão Zebra também depende do QZ Tray instalado na máquina.

`npm start` continua iniciando a API Express existente.