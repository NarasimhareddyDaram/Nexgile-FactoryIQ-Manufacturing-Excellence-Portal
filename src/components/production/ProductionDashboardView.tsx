import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Wrench,
  Users,
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  ProductionFacility,
  ProductionLine,
  ShiftPerformance,
  FactorySiteId,
  Role,
  User
} from '../../types';
import { mockYieldHistory } from '../../data/productionVisibilityData';

interface ProductionDashboardViewProps {
  facilities: ProductionFacility[];
  productionLines: ProductionLine[];
  shifts: ShiftPerformance[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: User;
  onSelectLine: (line: ProductionLine) => void;
}

export const ProductionDashboardView: React.FC<ProductionDashboardViewProps> = ({
  facilities,
  productionLines,
  shifts,
  selectedSite,
  currentRole,
  currentUser,
  onSelectLine,
}) => {
  const [lineFilter, setLineFilter] = useState<'all' | 'running' | 'changeover' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShiftTab, setSelectedShiftTab] = useState<string>('shift-1');

  // Filter lines based on site, status filter, and search
  const filteredLines = productionLines.filter(line => {
    if (selectedSite !== 'all' && line.siteId !== selectedSite) return false;
    if (lineFilter !== 'all' && line.status !== lineFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        line.name.toLowerCase().includes(q) ||
        line.currentProgramCode.toLowerCase().includes(q) ||
        line.currentProgramName.toLowerCase().includes(q) ||
        line.workOrderNumber.toLowerCase().includes(q) ||
        line.lineType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate live summary stats
  const totalPlannedToday = filteredLines.reduce((acc, l) => acc + l.plannedOutputToday, 0);
  const totalActualToday = filteredLines.reduce((acc, l) => acc + l.actualOutputToday, 0);
  const totalWipUnits = filteredLines.reduce((acc, l) => acc + l.wipUnits, 0);
  const avgOee = filteredLines.length > 0
    ? (filteredLines.reduce((acc, l) => acc + l.oee.overall, 0) / filteredLines.length).toFixed(1)
    : '90.2';
  const avgFpy = filteredLines.length > 0
    ? (filteredLines.reduce((acc, l) => acc + l.firstPassYield, 0) / filteredLines.length).toFixed(1)
    : '99.3';

  // Overall hourly aggregation for chart
  const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
  const aggregateHourly = hours.map(hour => {
    let plan = 0;
    let actual = 0;
    filteredLines.forEach(l => {
      const match = l.hourlyOutput.find(h => h.hour.startsWith(hour.slice(0, 2)));
      if (match) {
        plan += match.plan;
        actual += match.actual;
      }
    });
    return { hour, plan, actual };
  });

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Output vs Plan</span>
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalActualToday.toLocaleString()}</span>
            <span className="text-xs font-semibold text-slate-400">/ {totalPlannedToday.toLocaleString()}</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (totalActualToday / Math.max(1, totalPlannedToday)) * 100)}%`,
              }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-slate-500">
            <span>Fulfillment: {Math.round((totalActualToday / Math.max(1, totalPlannedToday)) * 100)}%</span>
            <span className="text-emerald-600 font-semibold">On Pace</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">First Pass Yield (FPY)</span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{avgFpy}%</span>
            <span className="text-xs text-slate-500 font-medium">avg</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Spec: ≥99.0% (Class 3)
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Across {filteredLines.length} active lines</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live WIP Level</span>
            <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalWipUnits}</span>
            <span className="text-xs font-semibold text-slate-400">units in line</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Buffer Fill: <strong>52%</strong></span>
            <span className="text-indigo-600 font-semibold">Balanced</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Optimal takt buffering</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overall Plant OEE</span>
            <div className="rounded-lg bg-purple-50 p-1.5 text-purple-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-600">{avgOee}%</span>
            <span className="text-xs text-slate-500 font-medium">avg</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between font-medium">
            <span>World Class Bench: 85%</span>
            <span className="text-purple-700 font-bold">+5.2%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">A: 93.4% | P: 97.2% | Q: 99.4%</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Lines</span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">
              {filteredLines.filter(l => l.status === 'running').length}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {filteredLines.length} running</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {filteredLines.filter(l => l.status === 'running').length} Run
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {filteredLines.filter(l => l.status === 'changeover').length} Chg
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Zero safety incidents</p>
        </div>
      </div>

      {/* Real-Time Hourly Output vs Target Chart & 7-Day Yield Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Output vs Target Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Hourly Output vs Plan Target</h3>
              <p className="text-xs text-slate-500">Real-time throughput aggregated across selected facilities</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded bg-blue-600 inline-block" /> Actual Units
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <span className="h-2.5 w-2.5 rounded bg-slate-300 inline-block" /> Planned Target
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregateHourly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="plan" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Planned Target" />
                <Bar dataKey="actual" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual Output" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Yield & Volume Trend Line Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">7-Day Yield Performance & Quality Trend</h3>
              <p className="text-xs text-slate-500">First Pass Yield (FPY) vs Final Rolled Yield</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500 inline-block" /> FPY (%)
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <span className="h-2.5 w-2.5 rounded bg-indigo-500 inline-block" /> Final (%)
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockYieldHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[98, 100.2]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
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
                <Line
                  type="monotone"
                  dataKey="fpy"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981' }}
                  name="First Pass Yield"
                />
                <Line
                  type="monotone"
                  dataKey="finalYield"
                  stroke="#6366F1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#6366F1' }}
                  name="Final Tested Yield"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Production Line Assignments Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Line Assignment & Telemetry</h3>
            <p className="text-xs text-slate-500">Live equipment monitoring, WIP buffers, and cycle takt</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search line or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none w-48 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
              {(['all', 'running', 'changeover'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setLineFilter(filterKey)}
                  className={`rounded-md px-2.5 py-1 capitalize transition ${
                    lineFilter === filterKey
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Line & Facility</th>
                <th className="py-3 px-3">Active Program & WO</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Output / Plan</th>
                <th className="py-3 px-3">FPY Yield</th>
                <th className="py-3 px-3">WIP Buffer</th>
                <th className="py-3 px-3">OEE</th>
                <th className="py-3 px-3">Takt vs Cycle</th>
                <th className="py-3 px-3 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLines.map((line) => {
                const percent = Math.min(100, Math.round((line.actualOutputToday / line.plannedOutputToday) * 100));
                return (
                  <tr
                    key={line.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => onSelectLine(line)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{line.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{line.siteName}</span> • <span className="text-slate-400">{line.lineType}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded inline-block">
                        {line.currentProgramCode}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-mono">{line.workOrderNumber}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          line.status === 'running'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : line.status === 'changeover'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          line.status === 'running' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        {line.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">
                        {line.actualOutputToday} <span className="text-slate-400 font-normal">/ {line.plannedOutputToday}</span>
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-emerald-700">{line.firstPassYield}%</span>
                      <div className="text-[10px] text-slate-400">Final: {line.finalYield}%</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800">{line.wipUnits}</span>
                      <span className="text-slate-400 text-[11px]"> / {line.wipCapacity}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-purple-700">{line.oee.overall}%</span>
                      <div className="text-[10px] text-slate-400">A:{line.oee.availability}% P:{line.oee.performance}%</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">
                        {line.actualCycleSec}s <span className="text-slate-400">/ {line.taktTimeSec}s</span>
                      </div>
                      {line.bottleneckStation && (
                        <div className="text-[10px] text-amber-700 font-medium truncate max-w-[130px]" title={line.bottleneckStation}>
                          ⚠️ {line.bottleneckStation}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLine(line);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition shadow-2xs"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shift Performance Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Shift Performance & Crew Handover</h3>
            <p className="text-xs text-slate-500">24-hour manufacturing shift output, yield consistency, and downtime breakdown</p>
          </div>

          {/* Shift Selection Pills */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            {shifts.map((shift) => (
              <button
                key={shift.shiftId}
                onClick={() => setSelectedShiftTab(shift.shiftId)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  selectedShiftTab === shift.shiftId
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {shift.shiftName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Shift Detail Card & Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {shifts.map((shift) => {
            const isSelected = shift.shiftId === selectedShiftTab;
            return (
              <div
                key={shift.shiftId}
                onClick={() => setSelectedShiftTab(shift.shiftId)}
                className={`rounded-xl border p-4 cursor-pointer transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/20 shadow-sm ring-1 ring-blue-400'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {shift.shiftId.replace('shift-', 'S')}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{shift.shiftName}</h4>
                      <p className="text-[11px] text-slate-500">{shift.timeRange}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      shift.status === 'exceeded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : shift.status === 'met'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {shift.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-center">
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Output</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{shift.actualUnits}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Yield</div>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">{shift.yieldPercent}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium">Downtime</div>
                    <div className="text-xs font-bold text-slate-700 mt-0.5">{shift.downtimeMinutes}m</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supervisor:</span>
                    <span className="font-semibold text-slate-800">{shift.supervisor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Headcount:</span>
                    <span className="font-medium text-slate-700">{shift.headcount} Operators</span>
                  </div>
                  <p className="pt-1 text-[10.5px] text-slate-500 border-t border-slate-100 italic">
                    "{shift.notes}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
