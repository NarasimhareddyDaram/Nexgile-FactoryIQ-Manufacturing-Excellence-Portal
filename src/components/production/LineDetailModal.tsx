import React from 'react';
import {
  X,
  Cpu,
  Activity,
  Zap,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ProductionLine, Role } from '../../types';

interface LineDetailModalProps {
  line: ProductionLine;
  currentRole: Role;
  onClose: () => void;
}

export const LineDetailModal: React.FC<LineDetailModalProps> = ({
  line,
  currentRole,
  onClose,
}) => {
  const isInternal = currentRole.category === 'internal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{line.name}</h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    line.status === 'running'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : line.status === 'changeover'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {line.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {line.siteName} • {line.lineType} • Work Order #{line.workOrderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">Output vs Target</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">{line.actualOutputToday}</span>
                <span className="text-xs text-slate-500 font-medium">/ {line.plannedOutputToday}</span>
              </div>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (line.actualOutputToday / line.plannedOutputToday) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">First Pass Yield (FPY)</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-600">{line.firstPassYield}%</span>
                <span className="text-xs text-slate-400 font-normal">(Final: {line.finalYield}%)</span>
              </div>
              <div className="mt-2 flex items-center text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Class 3 Spec Met
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">Work In Progress (WIP)</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">{line.wipUnits}</span>
                <span className="text-xs text-slate-500 font-medium">/ {line.wipCapacity} max</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                Buffer Level: {Math.round((line.wipUnits / line.wipCapacity) * 100)}%
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs font-medium text-slate-500">Overall OEE</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-indigo-600">{line.oee.overall}%</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                A: {line.oee.availability}% | P: {line.oee.performance}% | Q: {line.oee.quality}%
              </div>
            </div>
          </div>

          {/* Hourly Output Bar Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Hourly Output vs Plan Target</h3>
                <p className="text-xs text-slate-500">Hourly throughput recorded across shift stations</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="h-2.5 w-2.5 rounded bg-blue-600 inline-block" /> Actual Units
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="h-2.5 w-2.5 rounded bg-slate-300 inline-block" /> Planned Target
                </span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={line.hourlyOutput} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
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

          {/* Active Program and Line Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Build Parameters</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Current Program:</span>
                  <span className="font-semibold text-slate-900">{line.currentProgramCode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Product Name:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px] text-right">{line.currentProgramName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Target Takt Time:</span>
                  <span className="font-semibold text-slate-900">{line.taktTimeSec}s / unit</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Actual Measured Cycle:</span>
                  <span className={`font-semibold ${line.actualCycleSec <= line.taktTimeSec ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {line.actualCycleSec}s / unit
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Scrapped Units Today:</span>
                  <span className="font-semibold text-rose-600">{line.scrapCount} units</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Staffing & Scheduled Events</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Lead Supervisor:</span>
                  <span className="font-semibold text-slate-900">{line.leadSupervisor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Active Shift:</span>
                  <span className="font-medium text-slate-800">{line.currentShift}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Line Operators On-Station:</span>
                  <span className="font-semibold text-slate-900">{line.operatorCount} Technicians</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Bottleneck Station:</span>
                  <span className="font-semibold text-amber-700">
                    {line.bottleneckStation || 'None (Flow Balanced)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Next Changeover:</span>
                  <span className="font-medium text-blue-700">
                    {line.nextScheduledChangeover || 'No changeover scheduled today'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Telemetry streamed via FactoryIQ Edge MQTT Broker (Latency: 42ms)
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            Close Drill-Down
          </button>
        </div>
      </div>
    </div>
  );
};
