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

O instalador será criado em `release/`. No GitHub, abra **Actions > Build Windows Installer > Run workflow**, informe a versão (a primeira pode ser `v1.0.0`) e execute. A workflow cria uma GitHub Release com o instalador `.exe` disponível na aba **Releases**; o artefato da execução também continua disponível em Actions.

Para gerar apenas o app Windows sem instalador, inclusive a partir de Linux:

```bash
npm exec electron-builder -- --win --dir
```

O executável fica em `release/win-unpacked/Inventario de Celulares VOKE.exe`. Distribua a pasta `win-unpacked` completa, não apenas o `.exe`.

O app ainda carrega algumas bibliotecas por CDN; esses recursos precisam de conexão com a internet. A impressão Zebra também depende do QZ Tray instalado na máquina.

`npm start` continua iniciando a API Express existente.