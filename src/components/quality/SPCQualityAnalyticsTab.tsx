import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import {
  ProcessCapabilityItem,
  YieldTrendPoint,
  EscapedDefectRecord,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';

interface SPCQualityAnalyticsTabProps {
  spcSeries: ProcessCapabilityItem[];
  yieldTrends: YieldTrendPoint[];
  escapedDefects: EscapedDefectRecord[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const SPCQualityAnalyticsTab: React.FC<SPCQualityAnalyticsTabProps> = ({
  spcSeries,
  yieldTrends,
  escapedDefects,
  selectedSite,
  currentRole,
  currentUser,
}) => {
  // Filter by site if selected
  const filteredSpcSeries = useMemo(() => {
    return spcSeries.filter((s) => {
      if (selectedSite === 'all') return true;
      if (selectedSite === 'austin' && s.facility.includes('Austin')) return true;
      if (selectedSite === 'fremont' && s.facility.includes('Fremont')) return true;
      if (selectedSite === 'guadalajara' && s.facility.includes('Guadalajara')) return true;
      if (selectedSite === 'penang' && s.facility.includes('Penang')) return true;
      return true;
    });
  }, [spcSeries, selectedSite]);

  const [selectedParameterId, setSelectedParameterId] = useState<string>(
    filteredSpcSeries[0]?.id || spcSeries[0]?.id || 'spc-solder-height'
  );
  const [activeSubTab, setActiveSubTab] = useState<'spc' | 'yield' | 'escaped'>('spc');

  const activeSeries = useMemo(() => {
    return (
      filteredSpcSeries.find(s => s.id === selectedParameterId) ||
      filteredSpcSeries[0] ||
      spcSeries[0]
    );
  }, [filteredSpcSeries, spcSeries, selectedParameterId]);

  // Capability status color
  const getCpkBadge = (cpk: number) => {
    if (cpk >= 1.67) {
      return {
        label: 'World-Class Six Sigma (Cpk ≥ 1.67)',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-500'
      };
    }
    if (cpk >= 1.33) {
      return {
        label: 'Automotive Capable (Cpk ≥ 1.33)',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-blue-500'
      };
    }
    return {
      label: 'Marginal / Improvement Required (Cpk < 1.33)',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'bg-amber-500'
    };
  };

  const cpkInfo = getCpkBadge(activeSeries?.cpk || 1.68);
  const outOfControlViolations = activeSeries?.measurements.filter(m => m.isViolation) || [];

  // Latest Yield stats
  const latestYield = yieldTrends[yieldTrends.length - 1];

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Statistical Process Control (SPC) & Quality Metrology Analytics
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Cp/Cpk Engine Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Shewhart control charts, Nelson rule violation monitors, multi-stage yield trends, and escaped defect PPM
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setActiveSubTab('spc')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'spc'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>SPC & Cp/Cpk</span>
          </button>

          <button
            onClick={() => setActiveSubTab('yield')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'yield'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Yield Trends (RTY)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('escaped')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubTab === 'escaped'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>Escaped Defects (PPM)</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STATISTICAL PROCESS CONTROL (SPC) & CP/CPK */}
      {activeSubTab === 'spc' && activeSeries && (
        <div className="space-y-6">
          {/* Parameter Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpcSeries.map((param) => {
              const isSelected = param.id === selectedParameterId;
              const oocCount = param.measurements.filter(m => m.isViolation).length;
              return (
                <div
                  key={param.id}
                  onClick={() => setSelectedParameterId(param.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition text-left shadow-2xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {param.facility.split(' ')[0]}
                    </span>
                    {oocCount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" />
                        {oocCount} Out of Control
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        In-Control
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                    {param.characteristicName}
                  </h4>
                  <p className="text-[11px] text-slate-500">{param.stationName} • {param.programCode}</p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Cpk Index</span>
                      <span className="font-bold text-slate-900">{param.cpk.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Cp Index</span>
                      <span className="font-bold text-slate-700">{param.cp.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Nominal</span>
                      <span className="font-semibold text-blue-600">{param.nominal} {param.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Parameter Analysis Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
            {/* Header with Cpk Gauges */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {activeSeries.facility}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Station: {activeSeries.stationName} ({activeSeries.lineName})
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeSeries.characteristicName} — Shewhart X-Bar Control Chart
                </h3>
                <p className="text-xs text-slate-500">
                  Engineering Spec: <strong className="text-slate-700">[{activeSeries.lsl} to {activeSeries.usl} {activeSeries.unit}]</strong> | Process Limits (±3σ): <strong className="text-slate-700">[{activeSeries.lcl.toFixed(2)} to {activeSeries.ucl.toFixed(2)} {activeSeries.unit}]</strong>
                </p>
              </div>

              {/* Cpk & Cp Capability Metric Pill */}
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center min-w-[90px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cp Index</span>
                  <span className="text-lg font-bold text-slate-900">{activeSeries.cp.toFixed(2)}</span>
                </div>

                <div className={`rounded-xl border p-3 text-center min-w-[110px] ${cpkInfo.bg}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Cpk Index</span>
                  <span className="text-lg font-bold">{activeSeries.cpk.toFixed(2)}</span>
                </div>

                <div className="hidden sm:block text-right">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${cpkInfo.bg}`}>
                    {cpkInfo.label}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Samples: n={activeSeries.sampleCount} Subgroups</p>
                </div>
              </div>
            </div>

            {/* Out-Of-Control Rule Alerts (if any) */}
            {outOfControlViolations.length > 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span>Out-of-Control Point Alerts Detected ({outOfControlViolations.length} Nelson Rule Violations)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-700">
                  {outOfControlViolations.map((v, i) => (
                    <p key={i}>
                      • <strong>Subgroup #{v.sampleId} ({v.timestamp}):</strong> {v.violationRule}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive X-Bar Control Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Subgroup Mean Values (X̄) vs Specification & Control Limits</span>
                <span className="text-[11px] text-slate-400">Unit: {activeSeries.unit}</span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activeSeries.measurements}
                    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="sampleId"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => `#${val}`}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      domain={[
                        Math.min(activeSeries.lsl, activeSeries.lcl) - 5,
                        Math.max(activeSeries.usl, activeSeries.ucl) + 5
                      ]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '0.75rem',
                        border: 'none',
                        color: '#f8fafc',
                        fontSize: '11px'
                      }}
                      formatter={(val: number) => [`${val} ${activeSeries.unit}`, 'Mean X̄']}
                      labelFormatter={(label) => `Sample #${label}`}
                    />
                    <Legend />

                    {/* Spec Limits (Red dashed) */}
                    <ReferenceLine y={activeSeries.usl} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `USL: ${activeSeries.usl}`, fill: '#ef4444', fontSize: 10, position: 'top' }} />
                    <ReferenceLine y={activeSeries.lsl} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `LSL: ${activeSeries.lsl}`, fill: '#ef4444', fontSize: 10, position: 'bottom' }} />

                    {/* Control Limits (Amber dashed) */}
                    <ReferenceLine y={activeSeries.ucl} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: `UCL: ${activeSeries.ucl.toFixed(1)}`, fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
                    <ReferenceLine y={activeSeries.lcl} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: `LCL: ${activeSeries.lcl.toFixed(1)}`, fill: '#f59e0b', fontSize: 10, position: 'insideBottomRight' }} />

                    {/* Target / Nominal (Green dashed) */}
                    <ReferenceLine y={activeSeries.nominal} stroke="#10b981" strokeDasharray="2 2" label={{ value: `Nominal: ${activeSeries.nominal}`, fill: '#10b981', fontSize: 10, position: 'insideLeft' }} />

                    <Line
                      type="monotone"
                      dataKey="xBar"
                      name="Subgroup Mean (X̄)"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        const isOOC = payload.isViolation;
                        return (
                          <circle
                            key={payload.sampleId}
                            cx={cx}
                            cy={cy}
                            r={isOOC ? 6 : 4}
                            fill={isOOC ? '#ef4444' : '#2563eb'}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Range (R) Chart & Histogram Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Subgroup Range (R) Stability</h4>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeSeries.measurements} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="sampleId" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rangeR" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Range (R)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2 text-xs">
                <h4 className="text-xs font-bold text-slate-900">Statistical Parameters Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block">Total Samples:</span>
                    <span className="font-semibold text-slate-800">{activeSeries.sampleCount} subgroups (n=5 each)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Process Mean (μ):</span>
                    <span className="font-semibold text-slate-800">{activeSeries.mean} {activeSeries.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Standard Dev (σ):</span>
                    <span className="font-semibold text-slate-800">{activeSeries.stdDev} {activeSeries.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tolerance Width:</span>
                    <span className="font-semibold text-slate-800">{(activeSeries.usl - activeSeries.lsl).toFixed(1)} {activeSeries.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MULTI-STAGE YIELD TRENDS (SMT, ICT, FCT, RTY) */}
      {activeSubTab === 'yield' && (
        <div className="space-y-6">
          {/* Top Yield Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">SMT First-Pass Yield</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{latestYield.smtFirstPassYield}%</span>
                <span className="text-xs font-bold text-emerald-600">↑ 0.3%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Target: &gt; 98.0%</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">In-Circuit Test (ICT) Yield</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{latestYield.ictYield}%</span>
                <span className="text-xs font-bold text-emerald-600">↑ 0.2%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Target: &gt; 99.0%</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Functional Test (FCT) Yield</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{latestYield.fctYield}%</span>
                <span className="text-xs font-bold text-emerald-600">↑ 0.1%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Target: &gt; 99.0%</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs bg-linear-to-br from-emerald-50/40 to-white">
              <span className="text-xs font-bold text-emerald-800">Rolled Throughput Yield (RTY)</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">{latestYield.finalRolledYield}%</span>
                <span className="text-xs font-bold text-emerald-600">98.5% YTD</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">Cumulative multi-stage yield</p>
            </div>
          </div>

          {/* 14-Day Yield Trend Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  14-Day Multi-Stage Manufacturing Yield & Rolled Throughput
                </h3>
                <p className="text-xs text-slate-500">
                  Surface Mount Technology (SMT) → In-Circuit Testing (ICT) → End-Of-Line Functional Testing (FCT)
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                Target SLA: 98.0% RTY
              </span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldTrends} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[95, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                    formatter={(val: number) => [`${val}%`, 'Yield']}
                  />
                  <Legend />
                  <ReferenceLine y={98.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target RTY 98.0%', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="smtFirstPassYield" name="SMT First-Pass" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ictYield" name="ICT In-Circuit" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="fctYield" name="FCT Functional" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="finalRolledYield" name="Rolled Throughput (RTY)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ESCAPED DEFECTS TRACKING (PPM) */}
      {activeSubTab === 'escaped' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Latest Escaped Defect Rate</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-700">2 PPM</span>
                <span className="text-xs font-bold text-emerald-600">↓ 85% vs March</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Automotive Customer Target: &lt; 20 PPM</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Escaped Events (Last 6 Mos)</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">4 Events</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">100% closed with verified 8D</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Average Containment Window</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-700">&lt; 4 Hours</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Automated serial traceability lockout</p>
            </div>
          </div>

          {/* 6-Month Escaped PPM Trend Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Customer Escaped Defect Rate (PPM) vs Target Ceiling
                </h3>
                <p className="text-xs text-slate-500">
                  Parts-Per-Million (PPM) defect rate detected at OEM customer incoming inspection & module assembly
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                Within Target Threshold
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={escapedDefects} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 30]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                  />
                  <Legend />
                  <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target: 20 PPM', fill: '#ef4444', fontSize: 10 }} />
                  <Bar dataKey="customerEscapesPPM" name="Customer Escapes (PPM)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={36} />
                  <Line type="monotone" dataKey="targetPPM" name="SLA Ceiling" stroke="#ef4444" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
