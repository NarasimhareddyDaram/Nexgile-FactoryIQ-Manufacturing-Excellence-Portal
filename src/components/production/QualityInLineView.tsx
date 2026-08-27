import React, { useState } from 'react';
import {
  Scan,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Filter,
  Eye,
  Microscope,
  Radiation,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  InspectionResult,
  DefectParetoItem,
  DefectStationHighlight,
  FactorySiteId,
  Role,
  User
} from '../../types';

interface QualityInLineViewProps {
  inspectionResults: InspectionResult[];
  defectPareto: DefectParetoItem[];
  defectStations: DefectStationHighlight[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: User;
}

export const QualityInLineView: React.FC<QualityInLineViewProps> = ({
  inspectionResults,
  defectPareto,
  defectStations,
  selectedSite,
  currentRole,
  currentUser,
}) => {
  const [selectedInspectionType, setSelectedInspectionType] = useState<string>('all');
  const [expandedStationId, setExpandedStationId] = useState<string | null>(null);
  const [selectedParetoItem, setSelectedParetoItem] = useState<DefectParetoItem | null>(null);

  // Filter inspection results
  const filteredInspections = inspectionResults.filter(insp => {
    if (selectedInspectionType !== 'all' && insp.inspectionType !== selectedInspectionType) return false;
    return true;
  });

  // Calculate totals
  const totalInspected = inspectionResults.reduce((acc, i) => acc + i.totalInspected, 0);
  const totalFailed = inspectionResults.reduce((acc, i) => acc + i.failedCount, 0);
  const totalFalseCalls = inspectionResults.reduce((acc, i) => acc + i.falseCallCount, 0);
  const avgPPM = Math.round((totalFailed / Math.max(1, totalInspected)) * 1000000);

  // Prepare data for Defect Pareto chart
  const paretoChartData = defectPareto.map(item => ({
    name: item.defectName.split('(')[0].trim(),
    count: item.count,
    percentage: item.percentage,
    cumulative: item.cumulativePercentage,
    rawItem: item,
  }));

  return (
    <div className="space-y-6">
      {/* Top Level Quality Telemetry KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inline Inspection Volume</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Scan className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalInspected.toLocaleString()}</span>
            <span className="text-xs font-medium text-slate-500">PCBA units today</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Across 100% 3D-AOI & 3D-AXI X-Ray stages
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Defect Rate (PPM)</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{avgPPM}</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              PPM
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Automotive Target: &lt;100 PPM (Class 3)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Defects Today</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{totalFailed}</span>
            <span className="text-xs font-medium text-slate-500">units flagged</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            100% routed to inline rework or analytical triage
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AOI False Call Ratio</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalFalseCalls}</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              0.26% Rate
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            AI-assisted optical filter auto-cleared 94%
          </p>
        </div>
      </div>

      {/* Defect Pareto Chart & Root Cause Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pareto Chart (Bar + Cumulative % Line) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Defect Pareto Distribution (80/20 Rule)</h3>
              <p className="text-xs text-slate-500">
                Frequency ranking of defect classes with cumulative % impact curve
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              Total Defect Events: 93
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoChartData} margin={{ top: 10, right: 20, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  formatter={(val: any, name: string) => [
                    name === 'Cumulative %' ? `${val}%` : `${val} occurrences`,
                    name
                  ]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  name="Defect Occurrences"
                  onClick={(data) => setSelectedParetoItem(data.rawItem)}
                  className="cursor-pointer hover:opacity-80"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F59E0B' }}
                  name="Cumulative %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Tip: Click any defect bar to review its root-cause engineering CAPA.</span>
            <span className="font-semibold text-amber-700">Top 2 defect types represent 60.3% of total loss</span>
          </div>
        </div>

        {/* Selected Pareto Item Root Cause Detail */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <FileCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Engineering CAPA Focus</h3>
            </div>

            {selectedParetoItem || defectPareto[0] ? (
              (() => {
                const item = selectedParetoItem || defectPareto[0];
                return (
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.defectName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {item.category} Category
                        </span>
                        <span className="text-slate-500 font-medium">{item.count} defects ({item.percentage}%)</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                      <div>
                        <span className="font-bold text-slate-700 block">Primary Station:</span>
                        <span className="text-slate-600">{item.primaryStation}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block">Root Cause Analysis:</span>
                        <span className="text-slate-600 leading-relaxed">{item.rootCause}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-800 block">Corrective Action Plan (CAPA):</span>
                        <span className="text-emerald-900 font-medium leading-relaxed">{item.correctiveAction}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                      <span className="text-slate-500">Trend Status:</span>
                      <span className="font-bold text-emerald-600 capitalize bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ {item.trend}
                      </span>
                    </div>
                  </div>
                );
              })()
            ) : null}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            Validated by Quality Engineering Lead (ASQ CQE Certified)
          </div>
        </div>
      </div>

      {/* Top Defect Stations Highlighted */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Defect Stations & Immediate Containment</h3>
            <p className="text-xs text-slate-500">Real-time shopfloor scrap cost and rework yield per station</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            4 critical stations monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {defectStations.map((station) => (
            <div
              key={station.stationId}
              className={`rounded-xl border p-4 transition ${
                station.status === 'critical_attention'
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{station.stationName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{station.lineName}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    station.status === 'critical_attention'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {station.status === 'critical_attention' ? 'ACTION' : 'STABLE'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Defects Today:</span>
                  <span className="font-bold text-slate-900">{station.defectCountToday} units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Primary Flaw:</span>
                  <span className="font-medium text-rose-700 text-right truncate max-w-[130px]" title={station.primaryDefectType}>
                    {station.primaryDefectType}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Scrap Cost Impact:</span>
                  <span className="font-semibold text-slate-900">${station.scrapCostUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Rework Success:</span>
                  <span className="font-bold text-emerald-700">{station.reworkSuccessRate}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500">
                Lead: <span className="font-medium text-slate-800">{station.assignedEngineer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Inspection Stations Feed (AOI, X-Ray, SPI, Visual) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Inspection Systems Telemetry</h3>
            <p className="text-xs text-slate-500">
              Automated 3D-AOI optical profilers, 3D-CT X-Ray chambers, and solder paste inspection logs
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
            {(['all', '3D-AOI', '3D-AXI (X-Ray)', 'SPI (Solder Paste)', 'Visual Microscope'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedInspectionType(type)}
                className={`rounded-lg px-2.5 py-1 transition ${
                  selectedInspectionType === type
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'All Systems' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredInspections.map((insp) => (
            <div
              key={insp.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:bg-slate-50 shadow-2xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    {insp.inspectionType === '3D-AXI (X-Ray)' ? (
                      <Radiation className="h-5 w-5" />
                    ) : insp.inspectionType === 'Visual Microscope' ? (
                      <Microscope className="h-5 w-5" />
                    ) : (
                      <Scan className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{insp.stationName}</span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {insp.inspectionType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {insp.lineName} • Program: <strong className="text-slate-800">{insp.programCode}</strong> • Operator: {insp.operator}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <div className="text-slate-400 font-medium">Throughput</div>
                    <div className="font-bold text-slate-900 mt-0.5">{insp.totalInspected} tested</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Pass / Flag</div>
                    <div className="font-bold text-emerald-600 mt-0.5">
                      {insp.passedCount} <span className="text-slate-400 font-normal">/ {insp.failedCount}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Defect Rate</div>
                    <div className="font-bold text-slate-900 mt-0.5">{insp.defectRatePPM} PPM</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Scan Cycle</div>
                    <div className="font-bold text-slate-700 mt-0.5">{insp.avgScanTimeSec}s</div>
                  </div>
                </div>
              </div>

              {/* Recent Flagged Defects Feed */}
              {insp.recentDefects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/70">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    Recent Live Telemetry Anomaly Detections:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {insp.recentDefects.map((def, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-white p-2.5 border border-slate-200 text-xs flex items-center justify-between shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                              {def.code}
                            </span>
                            <span>{def.componentRef}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{def.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{def.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
