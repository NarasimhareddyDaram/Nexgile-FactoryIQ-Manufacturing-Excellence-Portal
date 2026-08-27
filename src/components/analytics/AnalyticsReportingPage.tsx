import React, { useState } from 'react';
import {
  BarChart3,
  Layout,
  Zap,
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Truck,
  Building,
  Sparkles,
  ArrowUpRight,
  Filter,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Role, User } from '../../types';
import { ExecutivePortfolioTab } from './ExecutivePortfolioTab';
import { CustomerDashboardTab } from './CustomerDashboardTab';
import { PredictiveInsightsTab } from './PredictiveInsightsTab';
import { SelfServeReportingTab } from './SelfServeReportingTab';

interface AnalyticsReportingPageProps {
  currentRole: Role;
  currentUser: User;
}

export const AnalyticsReportingPage: React.FC<AnalyticsReportingPageProps> = ({
  currentRole,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'executive' | 'customer' | 'predictive' | 'reports'>('executive');

  const isInternal = currentRole.category === 'internal';

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              EMS INTELLIGENCE & TELEMETRY
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analytics & Executive Reporting
          </h1>

          <p className="text-xs text-slate-500 max-w-2xl">
            Unified manufacturing intelligence, multi-tier program performance, predictive risk radar, and customized customer telemetry portals.
          </p>
        </div>

        {/* Role perspective indicator */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Active Role</span>
            <span className="text-xs font-bold text-slate-800">{currentRole.name}</span>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${isInternal ? 'bg-indigo-600' : 'bg-emerald-600'}`} />
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('executive')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 ${
            activeTab === 'executive'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Executive & Program Dashboards
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customer')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 ${
            activeTab === 'customer'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-4 h-4" />
          Customer Configurable Dashboard
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('predictive')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 ${
            activeTab === 'predictive'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          Predictive Insights & Risk Radar
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold">
            2 Alerts
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 ${
            activeTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Self-Serve Report Builder & Exports
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'executive' && (
        <ExecutivePortfolioTab
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'customer' && (
        <CustomerDashboardTab
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'predictive' && (
        <PredictiveInsightsTab
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'reports' && (
        <SelfServeReportingTab
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
