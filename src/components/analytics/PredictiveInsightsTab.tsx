import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Cpu,
  Truck,
  Boxes,
  Clock,
  DollarSign,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Zap,
  Info,
  Calendar,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { Role, User, PredictiveRiskFlag, RiskCategory } from '../../types';
import { INITIAL_PREDICTIVE_RISKS } from '../../data/analyticsData';

interface PredictiveInsightsTabProps {
  currentRole: Role;
  currentUser: User;
}

export const PredictiveInsightsTab: React.FC<PredictiveInsightsTabProps> = ({
  currentRole,
  currentUser
}) => {
  const [risks, setRisks] = useState<PredictiveRiskFlag[]>(INITIAL_PREDICTIVE_RISKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>('risk-001');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Filtered risks
  const filteredRisks = risks.filter(r => {
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchSev = selectedSeverity === 'all' || r.severity === selectedSeverity;
    return matchCat && matchSev;
  });

  // KPI calculations
  const criticalCount = risks.filter(r => r.severity === 'critical' && r.mitigationStatus !== 'mitigated').length;
  const highCount = risks.filter(r => r.severity === 'high' && r.mitigationStatus !== 'mitigated').length;
  const totalFinancialExposure = risks
    .filter(r => r.mitigationStatus !== 'mitigated')
    .reduce((sum, r) => sum + r.financialExposureUsd, 0);
  const maxLeadTimeImpact = Math.max(...risks.filter(r => r.mitigationStatus !== 'mitigated').map(r => r.leadTimeImpactDays), 0);

  // Mitigation trigger handler
  const handleExecuteMitigation = (riskId: string) => {
    setRisks(prev =>
      prev.map(r => {
        if (r.id === riskId) {
          const nextStatus = r.mitigationStatus === 'active' ? 'in_progress' : 'mitigated';
          return {
            ...r,
            mitigationStatus: nextStatus,
            mitigatedByName: `${currentUser.name} (${currentUser.department})`,
            mitigatedDate: new Date().toISOString()
          };
        }
        return r;
      })
    );

    const target = risks.find(r => r.id === riskId);
    setActionSuccessMsg(`Mitigation action initiated for "${target?.title}". Audit log updated.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div id="predictive-risk-insights" className="space-y-6 text-left">
      {/* Top Header & Early Warning Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-indigo-900 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Predictive Risk Radar & Early-Warning Engine</h3>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  AI Trend Logic Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Continuous telemetry monitoring delivery buffers, thermal drift sigma, and global supply chain allocations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-300 font-mono">Last Evaluated: Just now</span>
          </div>
        </div>

        {/* 4 Key Early Warning Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Critical Risk Flags</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-400 font-mono">{criticalCount}</span>
              <span className="text-xs text-slate-400">Immediate Action</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">High Watchlist</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 font-mono">{highCount}</span>
              <span className="text-xs text-slate-400">Elevated Priority</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Max Schedule Impact</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-indigo-300 font-mono">+{maxLeadTimeImpact}</span>
              <span className="text-xs text-slate-400">Days At Risk</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Financial Exposure</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 font-mono">${(totalFinancialExposure / 1000).toFixed(0)}k</span>
              <span className="text-xs text-slate-400">Potential Cost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Matrix 2D Visualizer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Predictive Impact Matrix</h4>
            <span className="text-[10px] text-slate-500 font-mono">Likelihood vs Impact</span>
          </div>

          {/* Matrix Grid */}
          <div className="space-y-2 text-[10px] font-semibold">
            {/* Row High */}
            <div className="grid grid-cols-3 gap-1.5 h-16">
              <div className="bg-amber-100/70 border border-amber-200 rounded-lg p-1.5 flex flex-col justify-between">
                <span className="text-amber-800">High / Low</span>
                <span className="text-right font-mono font-bold text-amber-900">1 Item</span>
              </div>
              <div className="bg-rose-100/80 border border-rose-200 rounded-lg p-1.5 flex flex-col justify-between">
                <span className="text-rose-800">High / Med</span>
                <span className="text-right font-mono font-bold text-rose-900">2 Items</span>
              </div>
              <div className="bg-rose-200 border border-rose-300 rounded-lg p-1.5 flex flex-col justify-between">
                <span className="text-rose-900 font-bold">High / High</span>
                <span className="text-right font-mono font-bold text-rose-950">2 Critical</span>
              </div>
            </div>

            {/* Row Med */}
            <div className="grid grid-cols-3 gap-1.5 h-16">
              <div className="bg-emerald-100/60 border border-emerald-200 rounded-lg p-1.5 flex flex-col justify-between">
                <span className="text-emerald-800">Med / Low</span>
                <span className="text-right font-mono font-bold text-emerald-900">1 Item</span>
              </div>
              <div className="bg-amber-100/60 border border-amber-200 rounded-lg p-1.5 flex flex-col justify-between">
                <span className="text-amber-800">Med / Med</span>
                <span className="text-right font-mono font-bold text-amber-900">0 Items</span>
              </div>
              <div className="bg-amber-100/80 border border-amber-200 rounded-lg p-1.5 flex flex-col justify-between">
                <span className="text-amber-800">Med / High</span>
                <span className="text-right font-mono font-bold text-amber-900">0 Items</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            High/High Quadrant triggers automatic Slack and SMS escalation to Lead Program Directors.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Filter Risk Trajectories</h4>
            <p className="text-xs text-slate-500">Isolate risks by domain classification and severity score.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Risk Category</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Domains' },
                  { id: 'delivery', label: 'Delivery Risk' },
                  { id: 'quality', label: 'Quality Variance' },
                  { id: 'supply', label: 'Supply Disruption' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Severity Score</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'critical', label: 'Critical' },
                  { id: 'high', label: 'High' },
                  { id: 'medium', label: 'Medium' }
                ].map(sev => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSelectedSeverity(sev.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selectedSeverity === sev.id
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Showing <strong>{filteredRisks.length}</strong> of <strong>{risks.length}</strong> evaluated risk signals</span>
            <span className="text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => { setSelectedCategory('all'); setSelectedSeverity('all'); }}>
              Reset Filters
            </span>
          </div>
        </div>
      </div>

      {/* List of Detailed Risk Flag Cards */}
      <div className="space-y-4">
        {filteredRisks.map(risk => {
          const isExpanded = expandedRiskId === risk.id;

          return (
            <div
              key={risk.id}
              className={`bg-white rounded-xl border transition-all ${
                risk.severity === 'critical' ? 'border-rose-200 hover:border-rose-300' :
                risk.severity === 'high' ? 'border-amber-200 hover:border-amber-300' :
                'border-slate-200 hover:border-slate-300'
              } shadow-xs`}
            >
              {/* Card Summary Header */}
              <div
                onClick={() => setExpandedRiskId(isExpanded ? null : risk.id)}
                className="p-4 cursor-pointer flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    risk.category === 'delivery' ? 'bg-indigo-50 text-indigo-600' :
                    risk.category === 'quality' ? 'bg-teal-50 text-teal-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {risk.category === 'delivery' && <Truck className="w-5 h-5" />}
                    {risk.category === 'quality' && <ShieldAlert className="w-5 h-5" />}
                    {risk.category === 'supply' && <Boxes className="w-5 h-5" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {risk.programCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        risk.severity === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        risk.severity === 'high' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {risk.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {risk.customerName}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {risk.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-sans">Confidence</span>
                    <span className="font-bold text-indigo-600">{risk.confidenceScore}%</span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-sans">Lead Time Impact</span>
                    <span className="font-bold text-rose-600">+{risk.leadTimeImpactDays} Days</span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-sans">Exposure</span>
                    <span className="font-bold text-slate-900">${(risk.financialExposureUsd / 1000).toFixed(0)}k</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans ${
                    risk.mitigationStatus === 'mitigated' ? 'bg-emerald-100 text-emerald-800' :
                    risk.mitigationStatus === 'in_progress' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {risk.mitigationStatus === 'mitigated' ? 'Mitigated' : risk.mitigationStatus === 'in_progress' ? 'In Progress' : 'Action Required'}
                  </span>

                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details & Deep-Dive Area */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs animate-in fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Logic Trigger & Root Cause Analysis */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Trend Trigger Logic
                        </span>
                        <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 font-medium">
                          {risk.trendLogicTrigger}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Root Cause Analysis
                        </span>
                        <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
                          {risk.rootCauseAnalysis}
                        </p>
                      </div>

                      {risk.mitigatedByName && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800">
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Mitigation handled by <strong>{risk.mitigatedByName}</strong> on {risk.mitigatedDate?.slice(0, 10)}.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Trend Chart (Measured vs Limit) */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Telemetry Variance vs Control Limit</span>
                        <span className="text-[10px] text-slate-400 font-mono">4-Period Sample</span>
                      </div>

                      <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={risk.trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                            <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: '11px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px' }} />
                            <ReferenceLine y={risk.trendData[0]?.thresholdLimit} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Limit', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                            <Line type="monotone" dataKey="measuredValue" stroke="#6366f1" strokeWidth={2} name="Measured Delta" dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Mitigation Action Bar */}
                  <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                        Recommended Mitigation Action
                      </span>
                      <p className="text-slate-800 font-medium">
                        {risk.suggestedMitigation}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteMitigation(risk.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-all shrink-0 ${
                        risk.mitigationStatus === 'mitigated'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : risk.mitigationStatus === 'in_progress'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {risk.mitigationStatus === 'mitigated' ? 'Mark As Re-Evaluated' : risk.mitigationStatus === 'in_progress' ? 'Complete Mitigation' : 'Execute 1-Click Mitigation'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
