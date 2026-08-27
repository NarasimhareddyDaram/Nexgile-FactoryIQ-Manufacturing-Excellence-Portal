import React, { useState } from 'react';
import { X, Database, Copy, Check, Table, ShieldCheck, Server } from 'lucide-react';

interface DatabaseSchemaModalProps {
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<'all' | 'users' | 'roles' | 'programs' | 'status_history'>('all');

  const sqlCode = `-- ==============================================================================
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
  stage VARCHAR(50) NOT NULL,
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

-- 5. ISSUES TABLE
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPROVALS / GATES TABLE
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  approval_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by VARCHAR(150) NOT NULL,
  required_role VARCHAR(50),
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-2xs">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Supabase PostgreSQL Schema & REST Data Layer
              </h2>
              <p className="text-xs text-slate-500">
                Tables: <code className="text-indigo-600 font-mono">users</code>, <code className="text-indigo-600 font-mono">roles</code>, <code className="text-indigo-600 font-mono">programs</code>, and <code className="text-indigo-600 font-mono">status_history</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Schema Content */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 font-bold text-[10px]">
                <ShieldCheck className="h-3.5 w-3.5" /> Supabase Compatible
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 font-bold text-[10px]">
                <Server className="h-3.5 w-3.5" /> Full Express REST API Active
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
              {copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96 leading-relaxed shadow-inner">
            <pre>{sqlCode}</pre>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs space-y-1">
            <p className="font-bold text-slate-800">Extensibility Architecture:</p>
            <p>
              The <code className="font-bold text-indigo-600">status_history</code> table is configured with generic category tags, old/new states, author tracking, and JSONB metadata, allowing effortless expansion across the upcoming 6 module pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
