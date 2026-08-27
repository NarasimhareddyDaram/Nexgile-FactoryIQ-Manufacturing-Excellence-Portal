import React, { useState } from 'react';
import { WorkOrder, WorkOrderStation, Program, Role, User } from '../../types';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Factory,
  Gauge,
  Layers,
  Play,
  RotateCw,
  Settings,
  ShieldCheck,
  Timer,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface WorkOrderDrilldownProps {
  workOrders: WorkOrder[];
  programs: Program[];
  currentRole: Role | null;
  currentUser: User | null;
}

export function WorkOrderDrilldown({
  workOrders,
  programs,
  currentRole,
  currentUser
}: WorkOrderDrilldownProps) {
  const [selectedWoId, setSelectedWoId] = useState<string>(workOrders[0]?.id || '');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  const activeWorkOrder = workOrders.find(wo => wo.id === selectedWoId) || workOrders[0];
  const activeProgram = programs.find(p => p.id === activeWorkOrder?.programId);

  const activeStation =
    activeWorkOrder?.stations.find(s => s.id === selectedStationId) ||
    activeWorkOrder?.stations[2] || // Default to ICT bottleneck station for rich immediate view
    activeWorkOrder?.stations[0];

  const totalStations = activeWorkOrder?.stations.length || 0;
  const bottleneckStations = activeWorkOrder?.stations.filter(s => s.status === 'bottleneck' || s.status === 'warning') || [];

  return (
    <div className="space-y-6">
      {/* Top Work Order Selector & Summary Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                {activeWorkOrder?.workOrderNumber}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Shopfloor Batch
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              {activeWorkOrder?.programName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned to {activeWorkOrder?.assignedFacility} • Line: {activeWorkOrder?.assignedLine}
            </p>
          </div>

          {/* Work Order Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Select Work Order:</span>
            <select
              value={selectedWoId}
              onChange={(e) => {
                setSelectedWoId(e.target.value);
                setSelectedStationId(null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
            >
              {workOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.workOrderNumber} - {wo.programCode} ({wo.assignedLine})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Telemetry Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium">Batch Target</p>
            <p className="text-sm font-bold text-slate-900">{activeWorkOrder?.batchSize.toLocaleString()} units</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium">Completed & Passed</p>
            <p className="text-sm font-bold text-emerald-600">{activeWorkOrder?.completedUnits.toLocaleString()} units</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium">Scrap / Rework Units</p>
            <p className="text-sm font-bold text-rose-600">{activeWorkOrder?.scrappedUnits} units ({((activeWorkOrder?.scrappedUnits! / activeWorkOrder?.batchSize!) * 100).toFixed(1)}%)</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium">Overall WIP %</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-indigo-600">{activeWorkOrder?.overallWipPercent}%</span>
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: `${activeWorkOrder?.overallWipPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium">Assigned Shift</p>
            <p className="text-xs font-bold text-slate-800 truncate">{activeWorkOrder?.currentShift}</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-medium">Line Supervisor</p>
            <p className="text-xs font-bold text-slate-800 truncate">{activeWorkOrder?.leadSupervisor.split('(')[0].trim()}</p>
          </div>
        </div>
      </div>

      {/* Bottleneck Warning Banner */}
      {bottleneckStations.length > 0 && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/80 p-4 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-600 animate-pulse" />
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
              Active Line Bottleneck Warning: {bottleneckStations[0].name}
            </h3>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed">
            {bottleneckStations[0].bottleneckReason}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-rose-900">Recommended Action:</span>
            <span className="text-[11px] text-slate-700 bg-white border border-rose-200 px-2 py-0.5 rounded-md">
              Enable Parallel Fixture Agilent 3070 #4 • Rebalance test vector dwell • Divert non-critical boundary scan to EOL bay.
            </span>
          </div>
        </div>
      )}

      {/* Build Stages Process Flow Map */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Manufacturing Stage Sequence & Station Telemetry
            </h3>
            <p className="text-xs text-slate-500">
              Select any station to inspect live takt time, buffer inventory, and operator assignments.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {totalStations} Linked Process Stations
          </span>
        </div>

        {/* Interactive Station Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeWorkOrder?.stations.map((station) => {
            const isSelected = activeStation?.id === station.id;
            const isBottleneck = station.status === 'bottleneck';
            const isWarning = station.status === 'warning';
            const wipUsagePct = ((station.wipUnits / station.wipCapacity) * 100).toFixed(0);

            return (
              <div
                key={station.id}
                onClick={() => setSelectedStationId(station.id)}
                className={`group relative rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600'
                    : isBottleneck
                    ? 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/60'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/60'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Bar: Sequence Number & Status Pill */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                        {station.sequence}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {station.stageCode}
                      </span>
                    </div>

                    {isBottleneck ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-800 animate-pulse">
                        <AlertTriangle className="h-3 w-3" /> Bottleneck
                      </span>
                    ) : isWarning ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <AlertTriangle className="h-3 w-3" /> Warning
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Optimal
                      </span>
                    )}
                  </div>

                  {/* Station Name */}
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-1">
                    {station.name}
                  </h4>

                  {/* Machine & Line */}
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {station.assignedLine}
                  </p>

                  {/* WIP Gauge */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Buffer WIP:</span>
                      <span className="font-bold text-slate-800">
                        {station.wipUnits} / {station.wipCapacity} units ({wipUsagePct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          Number(wipUsagePct) > 90
                            ? 'bg-rose-500'
                            : Number(wipUsagePct) > 70
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(100, Number(wipUsagePct))}%` }}
                      />
                    </div>
                  </div>

                  {/* Live Metrics: Throughput & Cycle Time */}
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2 text-center text-[11px] border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Throughput</p>
                      <p className={`font-bold ${station.actualThroughputPerHour < station.targetThroughputPerHour ? 'text-rose-600' : 'text-slate-800'}`}>
                        {station.actualThroughputPerHour} uph <span className="text-[9px] text-slate-400 font-normal">/ {station.targetThroughputPerHour}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Cycle vs Takt</p>
                      <p className={`font-bold ${station.actualCycleSeconds > station.targetTaktSeconds ? 'text-rose-600' : 'text-slate-800'}`}>
                        {station.actualCycleSeconds}s <span className="text-[9px] text-slate-400 font-normal">/ {station.targetTaktSeconds}s</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-slate-400" />
                    {station.operatorCount} Operators
                  </span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Inspect Station <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Station Deep-Dive Telemetry Panel */}
      {activeStation && (
        <div className="rounded-xl border border-indigo-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Station #{activeStation.sequence} ({activeStation.stageCode})
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Assigned: {activeStation.assignedLine}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeStation.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Active Shift: <strong className="text-slate-800">{activeStation.assignedShift}</strong>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-bold text-indigo-700">
                <Users className="h-3.5 w-3.5" /> {activeStation.operatorCount} Operators Stationed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Metric 1: Cycle vs Takt Time */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold flex items-center gap-1">
                  <Timer className="h-4 w-4 text-indigo-600" /> Takt Time Adherence
                </span>
                <span className="text-[10px] font-bold">Target: {activeStation.targetTaktSeconds}s</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${activeStation.actualCycleSeconds > activeStation.targetTaktSeconds ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeStation.actualCycleSeconds}s
                </span>
                <span className="text-[11px] text-slate-500">actual cycle</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {activeStation.actualCycleSeconds <= activeStation.targetTaktSeconds
                  ? 'Station is performing comfortably within line takt requirements.'
                  : `Exceeding takt by ${(activeStation.actualCycleSeconds - activeStation.targetTaktSeconds).toFixed(1)}s, creating upstream backpressure.`}
              </p>
            </div>

            {/* Metric 2: Live Hourly Output */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold flex items-center gap-1">
                  <Zap className="h-4 w-4 text-indigo-600" /> Hourly Throughput
                </span>
                <span className="text-[10px] font-bold">Target: {activeStation.targetThroughputPerHour} UPH</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${activeStation.actualThroughputPerHour < activeStation.targetThroughputPerHour ? 'text-rose-600' : 'text-slate-900'}`}>
                  {activeStation.actualThroughputPerHour}
                </span>
                <span className="text-[11px] text-slate-500">units per hour</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Output pace is at {((activeStation.actualThroughputPerHour / activeStation.targetThroughputPerHour) * 100).toFixed(0)}% of theoretical machine rating.
              </p>
            </div>

            {/* Metric 3: Station Buffer WIP */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold flex items-center gap-1">
                  <Boxes className="h-4 w-4 text-indigo-600" /> Buffer Queue WIP
                </span>
                <span className="text-[10px] font-bold">Max: {activeStation.wipCapacity}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {activeStation.wipUnits}
                </span>
                <span className="text-[11px] text-slate-500">units in tray</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (activeStation.wipUnits / activeStation.wipCapacity) > 0.9
                      ? 'bg-rose-500'
                      : (activeStation.wipUnits / activeStation.wipCapacity) > 0.7
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(100, (activeStation.wipUnits / activeStation.wipCapacity) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Quality & Verification Status */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Process Quality
                </span>
                <span className="text-[10px] font-bold text-emerald-600">SPC Stable</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">99.4%</span>
                <span className="text-[11px] text-slate-500">station yield</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Zero false-reject alarms recorded in the current shift run.
              </p>
            </div>
          </div>

          {/* Root-Cause Bottleneck Detail Note if active */}
          {activeStation.bottleneckReason && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-950">
                <AlertOctagon className="h-4 w-4 text-rose-600" />
                Root-Cause Diagnostic & Remediation Note:
              </p>
              <p className="text-slate-700 leading-relaxed">
                {activeStation.bottleneckReason}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
