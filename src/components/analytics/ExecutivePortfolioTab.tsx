import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Cpu,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  PieChart as PieIcon,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Filter,
  Download,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  ReferenceLine
} from 'recharts';
import { Role, User } from '../../types';
import {
  INITIAL_PORTFOLIO_HEALTH,
  INITIAL_DELIVERY_TRENDS,
  INITIAL_QUALITY_TRENDS,
  INITIAL_CAPACITY_METRICS,
  INITIAL_SERVICE_KPIS
} from '../../data/analyticsData';

interface ExecutivePortfolioTabProps {
  currentRole: Role;
  currentUser: User;
}

export const ExecutivePortfolioTab: React.FC<ExecutivePortfolioTabProps> = ({
  currentRole,
  currentUser
}) => {
  const [dateFilter, setDateFilter] = useState<'6m' | '3m' | 'ytd'>('6m');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');

  const healthData = [
    { name: 'Green (Optimal)', value: INITIAL_PORTFOLIO_HEALTH.greenCount, color: '#10B981', percentage: '62.5%' },
    { name: 'Yellow (Watchlist)', value: INITIAL_PORTFOLIO_HEALTH.yellowCount, color: '#F59E0B', percentage: '25.0%' },
    { name: 'Red (Critical Action)', value: INITIAL_PORTFOLIO_HEALTH.redCount, color: '#EF4444', percentage: '12.5%' }
  ];

  const filteredCapacity = selectedFacility === 'all'
    ? INITIAL_CAPACITY_METRICS
    : INITIAL_CAPACITY_METRICS.filter(f => f.siteCode === selectedFacility);

  const isInternal = currentRole.category === 'internal';

  return (
    <div id="executive-portfolio-dashboard" className="space-y-6 text-left">
      {/* Top Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Portfolio Performance & Operations Cockpit</h3>
            <p className="text-xs text-slate-500">
              Aggregated cross-program telemetry, manufacturing yield indices, and capacity loading.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Facility filter */}
          <div className="flex items-center gap-2 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Manufacturing Plants (Global)</option>
              <option value="SITE-ATX-01">Austin High-Tech Campus (Plant 1)</option>
              <option value="SITE-GDL-02">Guadalajara Electronics (Plant 2)</option>
              <option value="SITE-PNG-03">Penang SMT & Silicon (Plant 3)</option>
            </select>
          </div>

          {/* Time range toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setDateFilter('3m')}
              className={`px-3 py-1 rounded-md transition-colors ${dateFilter === '3m' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Last 3M
            </button>
            <button
              onClick={() => setDateFilter('6m')}
              className={`px-3 py-1 rounded-md transition-colors ${dateFilter === '6m' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Last 6M
            </button>
            <button
              onClick={() => setDateFilter('ytd')}
              className={`px-3 py-1 rounded-md transition-colors ${dateFilter === 'ytd' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'}`}
            >
              YTD 2026
            </button>
          </div>
        </div>
      </div>

      {/* 6 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Portfolio Health */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Portfolio Health</span>
            <PieIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">8</span>
            <span className="text-xs text-slate-500">Programs</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-600">5 Green</span> &bull;
            <span className="text-amber-600">2 Yel</span> &bull;
            <span className="text-rose-600">1 Red</span>
          </div>
        </div>

        {/* Card 2: OTD Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">On-Time Delivery</span>
            <Truck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">97.4%</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +2.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Target: &gt;95.0% SLA</p>
        </div>

        {/* Card 3: First Pass Yield */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">First-Pass Yield</span>
            <ShieldCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">98.35%</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +0.75%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">DPMO: 162 (Six Sigma)</p>
        </div>

        {/* Card 4: Capacity Utilization */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Capacity Loading</span>
            <Cpu className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">86.2%</span>
            <span className="text-xs text-slate-500">Overall</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">SMT: 88.6% (Balanced)</p>
        </div>

        {/* Card 5: Service CSAT */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Customer CSAT</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">4.88</span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">99.1% Retention</p>
        </div>

        {/* Card 6: RMA Turnaround */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">RMA Depot TAT</span>
            <Clock className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">4.1</span>
            <span className="text-xs text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">-0.9d vs Target</p>
        </div>
      </div>

      {/* Row 1: Portfolio Health Donut + On-Time Delivery Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Health Breakdown Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Active Portfolio Status Distribution</h4>
              <p className="text-xs text-slate-500">Breakdown of tier programs by operational stage & health</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              8 Active
            </span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Programs (${val === 5 ? '62.5%' : val === 2 ? '25%' : '12.5%'})`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            {healthData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">{item.value}</span>
                  <span className="text-slate-400 text-[11px]">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* On-Time Delivery Trend (Composed Bar + Line Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">On-Time Delivery (OTD) & Shipped Volume Trend</h4>
              <p className="text-xs text-slate-500">Shipped finished goods lots vs percentage on-time vs 95% target threshold</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 bg-indigo-200 rounded" /> Shipped Units
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-3 h-0.5 bg-emerald-600" /> OTD %
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-3 h-0.5 bg-rose-400 border-dashed" /> 95% Target
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={INITIAL_DELIVERY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 70000]} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} domain={[90, 100]} unit="%" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  formatter={(value: any, name: any) => {
                    if (name === 'OTD Rate') return [`${value}%`, 'OTD Rate'];
                    if (name === 'Target SLA') return [`${value}%`, 'Target SLA'];
                    return [`${value.toLocaleString()} units`, 'Shipped Volume'];
                  }}
                />
                <Bar yAxisId="left" dataKey="shippedUnits" fill="#c7d2fe" radius={[4, 4, 0, 0]} name="Shipped Volume" />
                <ReferenceLine yAxisId="right" y={95} stroke="#f87171" strokeDasharray="3 3" name="Target SLA" />
                <Line yAxisId="right" type="monotone" dataKey="onTimeRate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} name="OTD Rate" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              <strong>August 2026 Peak:</strong> 59,700 high-reliability units shipped with 97.4% delivery SLA adherence across global destinations.
            </span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              Zero Critical Misses
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Quality & Yield Multi-Trend + Multi-Plant Capacity Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Multi-Trend Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Quality Indices & DPMO Defect Trajectory</h4>
              <p className="text-xs text-slate-500">First-Pass Yield (FPY %) vs Defect Parts Per Million (DPMO)</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              -43% DPMO in 6M
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INITIAL_QUALITY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis yAxisId="yield" domain={[96, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="dpmo" orientation="right" domain={[0, 350]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  formatter={(val: any, name: any) => {
                    if (name === 'FPY %') return [`${val}%`, 'First-Pass Yield'];
                    if (name === 'DPMO') return [`${val} ppm`, 'Defects per Million'];
                    return [`${val}%`, 'Scrap Rate'];
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line yAxisId="yield" type="monotone" dataKey="firstPassYield" stroke="#0ea5e9" strokeWidth={2.5} name="FPY %" dot={{ r: 3 }} />
                <Line yAxisId="dpmo" type="monotone" dataKey="dpmo" stroke="#f59e0b" strokeWidth={2} name="DPMO" dot={{ r: 3 }} />
                <Line yAxisId="yield" type="monotone" dataKey="scrapRate" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" name="Scrap %" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Current FPY</span>
              <span className="font-bold text-slate-900 font-mono">98.35%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Defects / Million</span>
              <span className="font-bold text-amber-700 font-mono">162 DPMO</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block">Scrap Rate</span>
              <span className="font-bold text-rose-700 font-mono">1.4%</span>
            </div>
          </div>
        </div>

        {/* Multi-Plant Capacity Utilization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Facility Station Capacity Loading</h4>
              <p className="text-xs text-slate-500">Utilization across SMT lines, Box Build, Test/ICT, and Cleanrooms</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              3 Sites Active
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredCapacity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="siteCode" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="smtUtilization" fill="#4f46e5" name="SMT Lines" radius={[3, 3, 0, 0]} />
                <Bar dataKey="boxBuildUtilization" fill="#06b6d4" name="Box Build" radius={[3, 3, 0, 0]} />
                <Bar dataKey="testInspectionUtilization" fill="#10b981" name="Test / ICT" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cleanroomUtilization" fill="#f59e0b" name="Cleanroom" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Plant bottleneck summary */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {filteredCapacity.map((plant, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{plant.facilityName}</span>
                <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium truncate">
                  Bottleneck: {plant.bottleneckStation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Comprehensive Service & Operational KPIs Grid */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Service Level & Operational Excellence Scorecard</h4>
            <p className="text-xs text-slate-500">Track contract SLA commitments, ECO velocity, and reverse logistics turnaround times</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            All SLA Commitments In Compliance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {INITIAL_SERVICE_KPIS.map((kpi, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{kpi.category}</span>
                <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  {kpi.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <h5 className="text-xs font-bold text-slate-900">{kpi.metricName}</h5>
                <span className="text-lg font-black font-mono text-slate-900">
                  {kpi.currentValue} <span className="text-xs font-normal text-slate-500">{kpi.unit}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 text-slate-600">
                <span>Target: <strong>{kpi.targetValue} {kpi.unit}</strong></span>
                <span className="font-medium text-emerald-600">{kpi.changeVsLastMonth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
