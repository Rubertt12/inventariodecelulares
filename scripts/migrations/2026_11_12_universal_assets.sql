-- Gestão universal de ativos
-- Migração aditiva: não altera nem remove as tabelas legadas de smartphones/entregas/termos.
-- O tenant 1 é apenas o ambiente demonstrativo usado pelo login admin/admin atual.
-- Em produção, o company_id deverá vir da associação autenticada do usuário, nunca do payload do cliente.

BEGIN;

CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO companies (id, slug, name)
VALUES (1, 'demo', 'Empresa de demonstração')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS asset_categories (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_key VARCHAR(80) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  icon VARCHAR(60) NOT NULL DEFAULT 'package',
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, category_key),
  UNIQUE (id, company_id)
);

CREATE TABLE IF NOT EXISTS asset_field_definitions (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL,
  field_key VARCHAR(80) NOT NULL,
  label VARCHAR(120) NOT NULL,
  data_type VARCHAR(20) NOT NULL DEFAULT 'text'
    CHECK (data_type IN ('text', 'textarea', 'number', 'date', 'boolean', 'select', 'multiselect', 'url')),
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  show_in_list BOOLEAN NOT NULL DEFAULT FALSE,
  is_filterable BOOLEAN NOT NULL DEFAULT FALSE,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (category_id, company_id)
    REFERENCES asset_categories(id, company_id) ON DELETE CASCADE,
  UNIQUE (category_id, field_key),
  UNIQUE (id, company_id)
);

CREATE TABLE IF NOT EXISTS assets (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL,
  asset_tag VARCHAR(100),
  serial_number VARCHAR(160),
  manufacturer VARCHAR(120),
  model VARCHAR(160),
  status VARCHAR(30) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'in_use', 'maintenance', 'reserved', 'retired', 'lost')),
  location VARCHAR(160),
  assigned_to_name VARCHAR(160),
  assigned_to_identifier VARCHAR(100),
  purchase_date DATE,
  warranty_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (category_id, company_id)
    REFERENCES asset_categories(id, company_id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS assets_company_asset_tag_uq
  ON assets(company_id, asset_tag)
  WHERE asset_tag IS NOT NULL AND asset_tag <> '';

CREATE INDEX IF NOT EXISTS assets_company_category_idx
  ON assets(company_id, category_id, status);

CREATE INDEX IF NOT EXISTS assets_company_serial_idx
  ON assets(company_id, serial_number)
  WHERE serial_number IS NOT NULL AND serial_number <> '';

CREATE TABLE IF NOT EXISTS asset_custom_values (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  asset_id BIGINT NOT NULL,
  field_definition_id BIGINT NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (asset_id, company_id)
    REFERENCES assets(id, company_id) ON DELETE CASCADE,
  FOREIGN KEY (field_definition_id, company_id)
    REFERENCES asset_field_definitions(id, company_id) ON DELETE CASCADE,
  UNIQUE (asset_id, field_definition_id)
);

CREATE TABLE IF NOT EXISTS asset_movements (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  asset_id BIGINT NOT NULL,
  movement_type VARCHAR(30) NOT NULL
    CHECK (movement_type IN ('created', 'assigned', 'returned', 'transferred', 'status_changed', 'maintenance', 'retired', 'updated')),
  from_status VARCHAR(30),
  to_status VARCHAR(30),
  from_location VARCHAR(160),
  to_location VARCHAR(160),
  from_responsible VARCHAR(160),
  to_responsible VARCHAR(160),
  reference VARCHAR(120),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (asset_id, company_id)
    REFERENCES assets(id, company_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS asset_movements_company_asset_date_idx
  ON asset_movements(company_id, asset_id, created_at DESC);

CREATE TABLE IF NOT EXISTS company_terms (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  internal_key VARCHAR(100) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, internal_key)
);

INSERT INTO asset_categories (company_id, category_key, name, description, icon, is_system, sort_order)
VALUES
  (1, 'smartphones', 'Celulares', 'Smartphones e telefones corporativos', 'smartphone', TRUE, 10),
  (1, 'computers', 'Computadores', 'Notebooks, desktops e workstations', 'laptop', TRUE, 20),
  (1, 'monitors', 'Monitores', 'Monitores e telas corporativas', 'monitor', TRUE, 30),
  (1, 'printers', 'Impressoras', 'Impressoras e scanners', 'printer', TRUE, 40),
  (1, 'network', 'Equipamentos de rede', 'Switches, roteadores e access points', 'network', TRUE, 50),
  (1, 'peripherals', 'Periféricos', 'Teclados, mouses, docks e acessórios', 'keyboard', TRUE, 60),
  (1, 'other', 'Outros ativos', 'Outros equipamentos cadastrados pela empresa', 'package', TRUE, 70)
ON CONFLICT (company_id, category_key) DO NOTHING;

-- Campos específicos iniciais: as empresas poderão adicionar outros pelo configurador.
INSERT INTO asset_field_definitions
  (company_id, category_id, field_key, label, data_type, is_required, show_in_list, is_filterable, is_system, sort_order)
SELECT 1, c.id, f.field_key, f.label, f.data_type, f.is_required, f.show_in_list, f.is_filterable, TRUE, f.sort_order
FROM asset_categories c
JOIN (VALUES
  ('smartphones','imei1','IMEI 1','text',FALSE,TRUE,TRUE,10),
  ('smartphones','imei2','IMEI 2','text',FALSE,FALSE,FALSE,20),
  ('smartphones','line_number','Número da linha','text',FALSE,TRUE,TRUE,30),
  ('smartphones','carrier','Operadora','text',FALSE,FALSE,TRUE,40),
  ('smartphones','storage','Armazenamento','text',FALSE,TRUE,TRUE,50),
  ('smartphones','operating_system','Sistema operacional','text',FALSE,FALSE,TRUE,60),
  ('computers','processor','Processador','text',FALSE,TRUE,TRUE,10),
  ('computers','ram','Memória RAM','text',FALSE,TRUE,TRUE,20),
  ('computers','storage','Armazenamento','text',FALSE,TRUE,TRUE,30),
  ('computers','operating_system','Sistema operacional','text',FALSE,TRUE,TRUE,40),
  ('computers','hostname','Hostname','text',FALSE,FALSE,TRUE,50),
  ('computers','mac_address','Endereço MAC','text',FALSE,FALSE,TRUE,60),
  ('monitors','screen_size','Tamanho da tela','text',FALSE,TRUE,TRUE,10),
  ('monitors','resolution','Resolução','text',FALSE,TRUE,TRUE,20),
  ('monitors','panel_type','Tipo de painel','text',FALSE,FALSE,FALSE,30),
  ('printers','technology','Tecnologia de impressão','select',FALSE,TRUE,TRUE,10),
  ('printers','ip_address','Endereço IP','text',FALSE,FALSE,TRUE,20),
  ('printers','color_capable','Impressão colorida','boolean',FALSE,FALSE,TRUE,30),
  ('network','ip_address','Endereço IP','text',FALSE,TRUE,TRUE,10),
  ('network','mac_address','Endereço MAC','text',FALSE,FALSE,TRUE,20),
  ('network','ports','Quantidade de portas','number',FALSE,TRUE,TRUE,30),
  ('network','firmware','Firmware','text',FALSE,FALSE,FALSE,40),
  ('peripherals','connection','Tipo de conexão','select',FALSE,TRUE,TRUE,10),
  ('peripherals','compatibility','Compatibilidade','text',FALSE,FALSE,FALSE,20)
) AS f(category_key, field_key, label, data_type, is_required, show_in_list, is_filterable, sort_order)
  ON c.category_key = f.category_key
WHERE c.company_id = 1
ON CONFLICT (category_id, field_key) DO NOTHING;

INSERT INTO company_terms (company_id, internal_key, display_name)
VALUES
  (1, 'assets', 'Ativos'),
  (1, 'asset_tag', 'Patrimônio'),
  (1, 'assigned_to', 'Responsável'),
  (1, 'location', 'Localização'),
  (1, 'stock', 'Estoque')
ON CONFLICT (company_id, internal_key) DO NOTHING;

COMMIT;
