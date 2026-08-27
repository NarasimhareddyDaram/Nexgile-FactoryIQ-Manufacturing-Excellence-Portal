-- ==============================================================================
-- Nexgile-FactoryIQ Manufacturing Excellence Portal
-- Database Schema for Supabase (PostgreSQL)
-- ==============================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('customer', 'internal')),
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role_id VARCHAR(50) REFERENCES roles(id) ON DELETE SET NULL,
  company_name VARCHAR(150) NOT NULL,
  role_category VARCHAR(20) NOT NULL CHECK (role_category IN ('customer', 'internal')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROGRAMS / PROJECTS TABLE
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  customer_id UUID REFERENCES users(id),
  customer_name VARCHAR(150) NOT NULL,
  product_category VARCHAR(100) NOT NULL,
  stage VARCHAR(50) NOT NULL CHECK (stage IN ('R&D Concept', 'EVT (Engineering Validation)', 'DVT (Design Validation)', 'PVT (Production Validation)', 'Mass Production (Ramp)', 'Sustaining / EOL')),
  health VARCHAR(20) NOT NULL CHECK (health IN ('green', 'yellow', 'red')),
  progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  target_launch_date DATE,
  target_volume INT DEFAULT 0,
  current_units_built INT DEFAULT 0,
  current_yield_percent NUMERIC(5,2) DEFAULT 0.00,
  internal_scrap_percent NUMERIC(5,2) DEFAULT 0.00,
  open_issues_count INT DEFAULT 0,
  pending_approvals_count INT DEFAULT 0,
  customer_summary TEXT,
  internal_notes TEXT,
  key_milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STATUS HISTORY TABLE (Generic & extensible)
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  changed_by_user_id UUID REFERENCES users(id),
  changed_by_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('health', 'stage', 'yield', 'schedule', 'risk', 'general')),
  old_status VARCHAR(100),
  new_status VARCHAR(100) NOT NULL,
  reason TEXT NOT NULL,
  is_internal_only BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ISSUES TABLE (Extensible support for quality & program tracking)
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(30) NOT NULL CHECK (status IN ('open', 'in_investigation', 'capa_pending', 'resolved')),
  assigned_to VARCHAR(150),
  customer_visible BOOLEAN DEFAULT TRUE,
  customer_summary TEXT,
  internal_root_cause TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPROVALS / GATES TABLE
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  approval_type VARCHAR(50) NOT NULL CHECK (approval_type IN ('ECO', 'Stage Gate', 'Ship Hold', 'Deviation', 'Quality Sign-Off')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by VARCHAR(150) NOT NULL,
  required_role VARCHAR(50),
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVITIES / AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  user_name VARCHAR(150) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  is_internal_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_programs_health ON programs(health);
CREATE INDEX IF NOT EXISTS idx_programs_stage ON programs(stage);
CREATE INDEX IF NOT EXISTS idx_status_history_program ON status_history(program_id);
CREATE INDEX IF NOT EXISTS idx_issues_program ON issues(program_id);
CREATE INDEX IF NOT EXISTS idx_approvals_program ON approvals(program_id);
CREATE INDEX IF NOT EXISTS idx_activities_program ON activities(program_id);

-- SEED INITIAL ROLES
INSERT INTO roles (id, name, category, description, permissions) VALUES
('customer_engineering', 'Engineering', 'customer', 'Customer R&D & Product Design team. Access to technical specs, test summaries, ECOs and design validations.', '["view_specs", "approve_eco", "view_test_summary", "raise_technical_issue"]'::jsonb),
('customer_supply_chain', 'Supply Chain / Procurement', 'customer', 'Customer procurement and material planning. Visibility into PO status, delivery schedules, and buffer inventory.', '["view_po_status", "view_shipments", "view_material_availability"]'::jsonb),
('customer_quality', 'Quality / Compliance', 'customer', 'Customer Quality Assurance. Reviews First Article Inspections (FAI), compliance certificates (RoHS/REACH/FDA/ISO), and customer CAPA summaries.', '["view_quality_reports", "approve_fai", "view_compliance_certs", "view_capa_summary"]'::jsonb),
('customer_pm', 'Program / Project Management', 'customer', 'Customer Lead Program Director. Comprehensive project milestone tracking, health KPIs, stage-gate sign-offs.', '["view_all_customer_data", "approve_stage_gates", "export_reports", "manage_stakeholders"]'::jsonb),
('customer_after_sales', 'After-Sales / Service', 'customer', 'Customer Warranty & Returns management. RMA tracking, field failure rates, spare parts tracking.', '["create_rma", "view_rma_status", "request_spares", "view_warranty_stats"]'::jsonb),
('internal_account', 'Customer Success / Account Team', 'internal', 'Account leadership and customer relationship management. Commercial alignment, customer health escalation, executive summaries.', '["manage_customer_accounts", "view_full_history", "create_executive_summary", "manage_alerts"]'::jsonb),
('internal_planning', 'Production Planning', 'internal', 'Master Production Schedule (MPS), capacity allocation, line sequencing, and bottleneck forecasting.', '["edit_schedule", "allocate_capacity", "manage_wip", "set_line_targets"]'::jsonb),
('internal_ops', 'Manufacturing Ops', 'internal', 'Line supervisors and shopfloor operations. Station-by-station throughput, OEE, downtime tracking, operator logs.', '["log_station_data", "update_line_status", "manage_downtime", "view_live_telemetry"]'::jsonb),
('internal_quality', 'Quality Engineering', 'internal', 'Internal QA/QC engineers. In-depth 8D root-cause investigations, line scrap analysis, SPC control charts, internal non-conformances (NCRs).', '["manage_ncrs", "run_8d_analysis", "manage_spc", "issue_ship_holds", "log_scrap_metrics"]'::jsonb),
('internal_logistics', 'Logistics / Supply Chain', 'internal', 'Warehouse, inbound component tracking, BOM shortages, supplier risk matrices, and customs clearance.', '["manage_bom_allocations", "track_customs", "manage_warehouse_stock", "update_carrier_status"]'::jsonb),
('internal_service', 'Service / Repair', 'internal', 'Depot repair technicians and warranty triage. Component-level repair teardowns, turnaround times (TAT), root cause rework.', '["perform_triage", "update_repair_bom", "complete_rma", "manage_service_inventory"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
