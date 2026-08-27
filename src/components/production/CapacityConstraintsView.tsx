import React, { useState } from 'react';
import {
  Gauge,
  Calendar,
  Shuffle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  Building2,
  Wrench,
  Sparkles,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  ProductionFacility,
  LineCapacity,
  ScheduledChangeover,
  FacilityTransfer,
  FactorySiteId,
  Role,
  User
} from '../../types';

interface CapacityConstraintsViewProps {
  facilities: ProductionFacility[];
  lineCapacities: LineCapacity[];
  changeovers: ScheduledChangeover[];
  transfers: FacilityTransfer[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: User;
}

export const CapacityConstraintsView: React.FC<CapacityConstraintsViewProps> = ({
  facilities,
  lineCapacities,
  changeovers,
  transfers,
  selectedSite,
  currentRole,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'utilization' | 'changeovers' | 'transfers'>('utilization');

  // Filter capacities by site
  const filteredCapacities = selectedSite === 'all'
    ? lineCapacities
    : lineCapacities.filter(c => c.siteId === selectedSite);

  // Overall statistics
  const avgUtilization = filteredCapacities.length > 0
    ? Math.round(filteredCapacities.reduce((acc, c) => acc + c.utilizationPercent, 0) / filteredCapacities.length)
    : 87;

  return (
    <div className="space-y-6">
      {/* Top Level Capacity KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Capacity Utilization</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Gauge className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgUtilization}%</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              High Load
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Optimum operational band: 80% - 90%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled SMED Changeovers</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Shuffle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{changeovers.length}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              1 in progress
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Average swap downtime: 42 minutes
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identified Constraints</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">2</span>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              Stations
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Box-Build Flashing & Bio-Cleanroom Curing
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inter-Site Facility Transfers</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">{transfers.length}</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              Active Scaling
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Both transfers on schedule for Q2 handover
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('utilization')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'utilization'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Gauge className="h-4 w-4" />
          <span>Line & Site Capacity Utilization</span>
        </button>

        <button
          onClick={() => setActiveTab('changeovers')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'changeovers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shuffle className="h-4 w-4" />
          <span>Scheduled SMED Changeovers ({changeovers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
            activeTab === 'transfers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Facility Production Transfers ({transfers.length})</span>
        </button>
      </div>

      {/* TAB 1: Capacity & Utilization */}
      {activeTab === 'utilization' && (
        <div className="space-y-6">
          {/* Site High-Level Capacity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map((fac) => (
              <div key={fac.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{fac.name}</h4>
                    <p className="text-xs text-slate-500">{fac.city}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      fac.status === 'optimal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : fac.status === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {fac.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Utilization:</span>
                    <span className="text-slate-900">{fac.currentUtilizationPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        fac.currentUtilizationPercent > 90
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${fac.currentUtilizationPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Monthly Max:</span>
                    <span className="font-bold text-slate-800">{(fac.totalCapacityUnitsPerMonth / 1000).toFixed(0)}k units</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Active Lines:</span>
                    <span className="font-bold text-slate-800">{fac.activeLinesCount} lines</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Line Capacity Detail Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Line Capacity & Throughput Rating (UPH)</h3>
                <p className="text-xs text-slate-500">Maximum rated throughput vs actual measured run rate</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Line Name & Location</th>
                    <th className="py-3 px-3">Max Rated UPH</th>
                    <th className="py-3 px-3">Actual Measured UPH</th>
                    <th className="py-3 px-3">Utilization %</th>
                    <th className="py-3 px-3">Weekly Hours</th>
                    <th className="py-3 px-3">Capacity Health</th>
                    <th className="py-3 px-3">Identified Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCapacities.map((cap) => (
                    <tr key={cap.lineId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{cap.lineName}</div>
                        <div className="text-[11px] text-slate-500">{cap.siteName}</div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {cap.maxRatedUPH} units/hr
                      </td>

                      <td className="py-3 px-3 font-bold text-blue-700">
                        {cap.actualAvgUPH} units/hr
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{cap.utilizationPercent}%</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${cap.utilizationPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {cap.activeHoursPerWeek} hrs / wk
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cap.status === 'optimal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cap.status === 'high_load'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {cap.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {cap.bottleneckReason ? (
                          <div className="text-[11px] text-amber-800 font-medium">
                            ⚠️ {cap.bottleneckReason}
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-700 font-medium">
                            ✓ Flow Balanced (No active bottleneck)
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Scheduled Changeovers */}
      {activeTab === 'changeovers' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">SMED Rapid Tooling & Feeder Changeover Schedule</h3>
              <p className="text-xs text-slate-500">
                Single-Minute Exchange of Die (SMED) preparation checklist and line conversion milestones
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {changeovers.map((chg) => (
              <div
                key={chg.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 transition hover:bg-slate-50 shadow-2xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{chg.lineName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chg.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : chg.status === 'in_prep'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chg.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {chg.siteName} • Scheduled Window: <strong className="text-slate-800">{chg.scheduledTime}</strong> (Est. Duration: {chg.estimatedDurationMin} mins)
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    SMED Technician: <strong className="text-slate-900">{chg.smedTechnician}</strong>
                  </div>
                </div>

                {/* Conversion Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Transitioning From:</span>
                    <div className="font-bold text-slate-900">{chg.fromProgram}</div>
                    <div className="text-slate-600">{chg.fromProduct}</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-blue-200 bg-blue-50/20 space-y-1">
                    <span className="text-blue-600 font-bold uppercase text-[10px]">Transitioning To:</span>
                    <div className="font-bold text-blue-900">{chg.toProgram}</div>
                    <div className="text-blue-800">{chg.toProduct}</div>
                  </div>
                </div>

                {/* Readiness Verification Checkpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    chg.toolingReady ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {chg.toolingReady ? <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                    <span className="font-semibold">Tooling & Nozzle Kit Staged</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    chg.feedersStaged ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {chg.feedersStaged ? <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                    <span className="font-semibold">SMT Feeder Trolley Pre-Loaded</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    chg.stencilVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {chg.stencilVerified ? <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                    <span className="font-semibold">Laser Stencil Cleaned & Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Inter-Facility Production Transfers */}
      {activeTab === 'transfers' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inter-Facility Product Transfer & Scaling Tracker</h3>
              <p className="text-xs text-slate-500">
                Tracking tooling duplication, Golden sample validation, and PPAP transfer sign-offs across global facilities
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {transfers.map((tr) => (
              <div
                key={tr.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        {tr.transferCode}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{tr.programCode} - {tr.programName}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <span className="font-medium text-slate-800">{tr.fromSite}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-bold text-blue-700">{tr.toSite}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {tr.transferStage} ({tr.progressPercent}%)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Target Handover: <strong>{tr.targetCompletionDate}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">Transfer Business Rationale: </span>
                  {tr.transferReason}
                </div>

                {/* Milestones Stepper */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    Transfer Qualification Milestones
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {tr.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-2.5 border text-xs flex flex-col justify-between ${
                          m.completed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          {m.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500 shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                          )}
                          <span className="font-semibold text-[11px] leading-tight">{m.name}</span>
                        </div>
                        {m.date && (
                          <span className="text-[10px] text-slate-400 mt-2 font-mono">{m.date}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {tr.riskNotes && (
                  <div className="text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-200/60 flex items-center justify-between">
                    <span className="font-medium">Audit note: {tr.riskNotes}</span>
                    <span className="text-blue-700 font-bold text-[11px]">Customer Approved: YES</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
