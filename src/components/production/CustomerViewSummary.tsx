import React, { useState } from 'react';
import {
  CheckCircle2,
  TrendingUp,
  Package,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  Download,
  Building2,
  Clock,
  Sparkles,
  Award,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ProductionFacility,
  ProductionLine,
  FactorySiteId,
  Role,
  User
} from '../../types';
import { mockYieldHistory } from '../../data/productionVisibilityData';

interface CustomerViewSummaryProps {
  facilities: ProductionFacility[];
  productionLines: ProductionLine[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: User;
  onSelectLine: (line: ProductionLine) => void;
}

export const CustomerViewSummary: React.FC<CustomerViewSummaryProps> = ({
  facilities,
  productionLines,
  selectedSite,
  currentRole,
  currentUser,
  onSelectLine,
}) => {
  const [reportExported, setReportExported] = useState(false);

  // Filter lines by selected site
  const filteredLines = selectedSite === 'all'
    ? productionLines
    : productionLines.filter(l => l.siteId === selectedSite);

  // Aggregations
  const totalPlanned = filteredLines.reduce((acc, l) => acc + l.plannedOutputToday, 0);
  const totalActual = filteredLines.reduce((acc, l) => acc + l.actualOutputToday, 0);
  const avgFpy = filteredLines.length > 0
    ? (filteredLines.reduce((acc, l) => acc + l.firstPassYield, 0) / filteredLines.length).toFixed(1)
    : '99.2';
  const totalWip = filteredLines.reduce((acc, l) => acc + l.wipUnits, 0);

  const handleExportSummary = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Notice */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Customer Executive View • Verified ISO/IATF Production Feed
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Manufacturing Operations & Fulfillment Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Live status for contracted programs across Nexgile-FactoryIQ global manufacturing centers.
              All data has been certified through automated in-line inspection and SPC verification.
            </p>
          </div>

          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            {reportExported ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Executive Report Downloaded</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-slate-600" />
                <span>Export Executive Production Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall First Pass Yield</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgFpy}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Target: 99.0%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Across {filteredLines.length} dedicated SMT and Box-Build lines
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Batch Fulfillment</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalActual.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-medium">/ {totalPlanned.toLocaleString()} units</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, (totalActual / Math.max(1, totalPlanned)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active WIP Flow</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalWip}</span>
            <span className="text-xs font-semibold text-slate-500">units in line buffers</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Buffer health status: <strong>Optimal takt flow</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivery SLA Integrity</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">99.4%</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              On Schedule
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Zero critical ship-holds or line stops
          </p>
        </div>
      </div>

      {/* Yield Trend Over Time Chart & Contracted Programs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day First Pass Yield Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">7-Day Quality & Yield Trend</h3>
              <p className="text-xs text-slate-500">Customer certified First Pass Yield (FPY) vs SLA benchmark</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500 inline-block" /> First Pass Yield (%)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <span className="h-2.5 w-2.5 rounded bg-blue-500 inline-block" /> Final Tested Yield (%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockYieldHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fpyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="finalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[97, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(val: number) => [`${val}%`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="fpy"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#fpyGradient)"
                  name="First Pass Yield"
                />
                <Area
                  type="monotone"
                  dataKey="finalYield"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#finalGradient)"
                  name="Final Tested Yield"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Minimum Customer SLA Threshold: <strong>99.00% FPY</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Exceeding specification by +0.3%
            </span>
          </div>
        </div>

        {/* Manufacturing Sites & Certifications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Certified Production Hubs</h3>
            <p className="text-xs text-slate-500 mb-4">Dedicated customer manufacturing centers</p>

            <div className="space-y-3">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900">{fac.name}</div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      {fac.avgYieldPercent}% Yield
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{fac.city}, {fac.country}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {fac.certifications.map((cert, i) => (
                      <span key={i} className="text-[9px] font-medium bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Customer SLA Compliance:</span>
            <span className="font-bold text-emerald-700">100% Compliant</span>
          </div>
        </div>
      </div>

      {/* Contracted Active Programs Status Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Program Build Status</h3>
            <p className="text-xs text-slate-500">Click any production line to view detailed build stage parameters</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredLines.length} dedicated build lines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLines.map((line) => {
            const completionPercent = Math.min(100, Math.round((line.actualOutputToday / line.plannedOutputToday) * 100));
            return (
              <div
                key={line.id}
                onClick={() => onSelectLine(line)}
                className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-blue-400 hover:bg-blue-50/30 transition shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                      {line.currentProgramCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                      {line.name}
                    </h4>
                  </div>
                  <div className="rounded-lg p-1 text-slate-400 group-hover:text-blue-600 transition">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                  {line.currentProgramName}
                </p>

                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Today's Progress:</span>
                    <span className="text-slate-800 font-bold">{line.actualOutputToday} / {line.plannedOutputToday} units ({completionPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs">
                  <span className="text-slate-500">First Pass Yield:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {line.firstPassYield}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
