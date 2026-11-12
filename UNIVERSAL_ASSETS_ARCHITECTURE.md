# Arquitetura de Gestão Universal de Ativos

## Objetivo

Evoluir o inventário de celulares para uma plataforma capaz de controlar diferentes classes de ativos corporativos sem criar uma implementação independente para cada tipo de equipamento.

A evolução é aditiva: as tabelas legadas `smartphones`, `entregas` e `termos` permanecem preservadas durante a transição.

## Princípios

1. **Identidade interna estável:** regras de negócio usam chaves técnicas (`category_key`, `field_key`, `status`), nunca os rótulos apresentados na interface.
2. **Categorias configuráveis:** cada empresa pode ativar categorias padrão e criar novas categorias.
3. **Campos por categoria:** cada tipo de ativo possui definições próprias, com tipo, obrigatoriedade, opções, visibilidade em listagem e possibilidade de filtro.
4. **Núcleo comum:** patrimônio, número de série, fabricante, modelo, estado, localização, responsável, garantia e observações ficam em colunas comuns.
5. **Extensibilidade:** atributos específicos são armazenados em `asset_custom_values` como JSONB, relacionados a uma definição de campo.
6. **Rastreabilidade:** alterações de posse, localização e estado geram eventos em `asset_movements`.
7. **Separação por empresa:** todas as tabelas de domínio carregam `company_id`; relações compostas impedem associar ativos, categorias e campos de empresas diferentes.

## Modelo inicial

- `companies`: organizações/tenants.
- `asset_categories`: categorias como celulares, computadores, monitores, impressoras, rede, periféricos e outras.
- `asset_field_definitions`: esquema configurável de cada categoria.
- `assets`: cadastro comum dos ativos.
- `asset_custom_values`: valores dos campos específicos.
- `asset_movements`: histórico de movimentações.
- `company_terms`: nomenclaturas visíveis configuráveis por empresa.

## Migração

Arquivo: `scripts/migrations/2026_11_12_universal_assets.sql`

A migração é transacional e aditiva. Ela cria as tabelas novas, índices e categorias/campos iniciais do tenant demonstrativo de ID 1. Não executa TRUNCATE, UPDATE ou DELETE nas tabelas legadas.

Executar somente depois de validar backup do PostgreSQL:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/migrations/2026_11_12_universal_assets.sql
```

Se o ambiente usa as variáveis separadas `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` e `DB_PORT`, conectar com o cliente PostgreSQL correspondente e executar o mesmo arquivo.

## Próximas etapas de implementação

### Etapa 1 — Fundação de dados
- Aplicar e validar a migração em banco de desenvolvimento.
- Criar camada de repositório e validação para categorias, campos e ativos.
- Derivar o tenant da sessão autenticada no servidor.
- Não aceitar `company_id` enviado livremente pelo navegador.
- Criar testes para impedir leitura/escrita cruzada entre empresas.

### Etapa 2 — Interface universal
- Nova área "Ativos" com filtro por categoria.
- Cadastro de ativo que monta os campos a partir de `asset_field_definitions`.
- Editor de categorias e campos nas configurações.
- Estoque, status, localização e responsável comuns a todas as categorias.
- Manter os módulos antigos acessíveis enquanto os dados são migrados e validados.

### Etapa 3 — Operação e documentos
- Entrega, devolução, transferência e manutenção com histórico.
- Modelos de termo por categoria e variáveis dinâmicas.
- Snapshot imutável dos dados/modelo usados em documentos emitidos.

### Etapa 4 — Multiempresa real
- Identidade de usuário e associação usuário/empresa.
- Seleção de tenant autorizada no servidor.
- Política de autorização por empresa e testes de isolamento.
- Só então habilitar criação e gestão de empresas fora do tenant de demonstração.

## Limite conhecido do estado atual

A autenticação existente é demonstrativa (`admin/admin`) e não identifica usuários nem empresas. Portanto, a presença de `company_id` no novo modelo é uma base de arquitetura, não uma alegação de que o produto já possui isolamento multi-tenant pronto para produção. As APIs universais não devem ser expostas até que o tenant seja resolvido e validado no servidor.
