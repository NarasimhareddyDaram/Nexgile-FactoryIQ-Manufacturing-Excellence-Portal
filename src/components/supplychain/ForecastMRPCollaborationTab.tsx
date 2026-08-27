import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Search,
  Filter,
  Check,
  X,
  Building2,
  DollarSign,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  ForecastScenario,
  MRPSummaryItem,
  CapacityCommitment,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';

interface ForecastMRPCollaborationTabProps {
  scenarios: ForecastScenario[];
  mrpItems: MRPSummaryItem[];
  capacityCommitments: CapacityCommitment[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const ForecastMRPCollaborationTab: React.FC<ForecastMRPCollaborationTabProps> = ({
  scenarios,
  mrpItems,
  capacityCommitments,
  selectedSite,
  currentRole,
  currentUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'forecast_accuracy' | 'mrp_output' | 'capacity'>('forecast_accuracy');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || '');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Selected Scenario
  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Capacity filtered by site
  const filteredCapacity = capacityCommitments.filter((cap) => {
    if (selectedSite !== 'all' && cap.facility !== selectedSite) {
      return false;
    }
    return true;
  });

  const getCapacityStatusBadge = (status: CapacityCommitment['status']) => {
    switch (status) {
      case 'Optimal':
        return <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">Optimal ({'<' + '85%'})</span>;
      case 'Near Capacity':
        return <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">Near Capacity (85-95%)</span>;
      case 'Constrained':
      default:
        return <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 animate-pulse">Constrained ({'>' + '95%'})</span>;
    }
  };

  const handleSimulateCSVUpload = () => {
    setUploadSuccessMsg('Successfully parsed and validated "SkyReach_Forecast_Q3_2026_Rev5.csv" (12 Months, 14,200 Total Demand Units). Scenario Committed to MRP Engine.');
    setTimeout(() => {
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Demand Forecast Collaboration & MRP Engine
            </h2>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
              MRP Explosion Level 1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customer rolling demand uploads, forecast accuracy variance (MAPE), material requirement planning, and line capacity commitments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUploadSuccessMsg(null);
              setShowUploadModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Customer Forecast (CSV)</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 w-fit">
        <button
          onClick={() => setActiveSubTab('forecast_accuracy')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeSubTab === 'forecast_accuracy'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Forecast vs Actual Accuracy</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mrp_output')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeSubTab === 'mrp_output'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>MRP Output & Shortages ({mrpItems.filter(m => m.isShortage).length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('capacity')}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeSubTab === 'capacity'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Line Capacity Commitments</span>
        </button>
      </div>

      {/* SUBTAB 1: FORECAST ACCURACY & VARIANCE CHART */}
      {activeSubTab === 'forecast_accuracy' && (
        <div className="space-y-6">
          {/* Scenario Selector Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Selected Program Forecast Model</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <select
                    value={selectedScenarioId}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {scenarios.map(s => (
                      <option key={s.id} value={s.id}>{s.programCode} — {s.programName} ({s.customerName})</option>
                    ))}
                  </select>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    {activeScenario.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Active Revision</span>
                  <span className="font-semibold text-slate-800">{activeScenario.revision}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Committed Annual Volume</span>
                  <span className="font-bold text-slate-900 font-mono">{activeScenario.totalAnnualVolume.toLocaleString()} Units</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Contract Value</span>
                  <span className="font-bold text-blue-600 font-mono">${(activeScenario.totalCommittedValueUSD / 1000000).toFixed(2)}M USD</span>
                </div>
              </div>
            </div>

            {/* Forecast vs Actual Chart */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Demand Forecast vs Actual Build Volume (Units) & Accuracy Rate
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                  Avg Program MAPE: 1.1% (98.9% Accuracy)
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeScenario.forecastMonths} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
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
                    <Bar dataKey="demandUnits" name="Customer Forecasted Demand" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="committedUnits" name="Factory Committed Build" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actualBuildUnits" name="Actual Shipped Output" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Month by month data grid */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="p-3">Month</th>
                    <th className="p-3 text-right">Customer Demand</th>
                    <th className="p-3 text-right">Committed Build</th>
                    <th className="p-3 text-right">Actual Output</th>
                    <th className="p-3 text-right">Variance Units</th>
                    <th className="p-3 text-right">Forecast Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {activeScenario.forecastMonths.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-sans font-bold text-slate-900">{m.month}</td>
                      <td className="p-3 text-right text-slate-700">{m.demandUnits.toLocaleString()}</td>
                      <td className="p-3 text-right text-blue-600 font-semibold">{m.committedUnits.toLocaleString()}</td>
                      <td className="p-3 text-right text-slate-900 font-bold">
                        {m.actualBuildUnits ? m.actualBuildUnits.toLocaleString() : '—'}
                      </td>
                      <td className="p-3 text-right">
                        {m.deltaVarianceUnits !== undefined ? (
                          <span className={m.deltaVarianceUnits >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {m.deltaVarianceUnits > 0 ? `+${m.deltaVarianceUnits}` : m.deltaVarianceUnits}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans italic">Pending</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {m.forecastAccuracyPercent !== undefined ? (
                          <span className="text-emerald-700 font-bold">{m.forecastAccuracyPercent.toFixed(1)}%</span>
                        ) : (
                          <span className="text-slate-400 font-sans italic">—</span>
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

      {/* SUBTAB 2: MRP OUTPUT & PLANNED ORDER RELEASES */}
      {activeSubTab === 'mrp_output' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Material Requirements Planning (MRP) Summary Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Calculated gross demand vs available inventory, scheduled receipts, net requirements, and PO release schedule
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
              {mrpItems.filter(m => m.isShortage).length} Actionable Shortages
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Component / MPN</th>
                    <th className="px-4 py-3.5 text-right">Gross Demand</th>
                    <th className="px-4 py-3.5 text-right">On-Hand Avail</th>
                    <th className="px-4 py-3.5 text-right">Sched Receipts</th>
                    <th className="px-4 py-3.5 text-right">Net Req</th>
                    <th className="px-4 py-3.5 text-right">Planned PO Release</th>
                    <th className="px-4 py-3.5">Release Timing</th>
                    <th className="px-4 py-3.5">Key Supplier</th>
                    <th className="px-4 py-3.5 text-center">Shortage Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {mrpItems.map((mrp) => (
                    <tr key={mrp.id} className={`hover:bg-slate-50 transition ${mrp.isShortage ? 'bg-rose-50/30' : ''}`}>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-0.5 max-w-xs font-sans">
                          <span className="font-mono font-bold text-slate-900 block">{mrp.mpn}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{mrp.description}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{mrp.partNumber}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top text-right font-bold text-slate-900">
                        {mrp.grossDemandQty.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top text-right text-slate-700">
                        {mrp.onHandAvailableQty.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top text-right text-blue-600">
                        +{mrp.scheduledReceiptsQty.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top text-right font-bold text-rose-600">
                        {mrp.netRequirementQty > 0 ? mrp.netRequirementQty.toLocaleString() : '0'}
                      </td>

                      <td className="px-4 py-4 align-top text-right font-bold text-slate-900">
                        {mrp.plannedOrderReleaseQty.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top whitespace-nowrap font-sans font-semibold text-slate-800">
                        {mrp.plannedReleaseWeek}
                      </td>

                      <td className="px-4 py-4 align-top font-sans text-slate-700 whitespace-nowrap">
                        <span className="font-semibold block">{mrp.supplier}</span>
                        <span className="text-[10px] text-slate-400">LT: {mrp.leadTimeWeeks} Wks</span>
                      </td>

                      <td className="px-4 py-4 align-top text-center whitespace-nowrap font-sans">
                        {mrp.isShortage ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 border border-rose-300 animate-pulse">
                            <AlertTriangle className="h-3 w-3" /> Critical Shortage
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Fully Covered
                          </span>
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

      {/* SUBTAB 3: CAPACITY COMMITMENTS */}
      {activeSubTab === 'capacity' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCapacity.map((cap) => (
              <div key={cap.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {cap.facilityName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{cap.lineName}</h3>
                    <span className="text-xs text-slate-500">{cap.lineType}</span>
                  </div>
                  {getCapacityStatusBadge(cap.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Capacity Utilization</span>
                    <span className="font-bold text-slate-900 font-mono">{cap.utilizationPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cap.utilizationPercent >= 95
                          ? 'bg-rose-500'
                          : cap.utilizationPercent >= 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${cap.utilizationPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Monthly Maximum Capacity</span>
                    <span className="font-mono font-bold text-slate-800">{cap.monthlyCapacityUnits.toLocaleString()} units</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Customer Committed Load</span>
                    <span className="font-mono font-bold text-blue-600">{cap.customerCommittedUnits.toLocaleString()} units</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                  <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Bottleneck Constraint: <strong className="text-slate-800">{cap.bottleneckRisk}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Customer Demand Forecast</h3>
                  <p className="text-xs text-slate-500">Supports standard CSV / Excel templates</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {uploadSuccessMsg ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                  onClick={handleSimulateCSVUpload}
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/30 hover:bg-blue-50/60 transition cursor-pointer text-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-blue-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Click to upload or drag & drop CSV file</span>
                    <span className="text-[11px] text-slate-500">Required headers: Month, ProgramCode, DemandUnits, Revision</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                  <span className="text-slate-500 font-semibold block">Sample Template Format:</span>
                  <div className="font-mono text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                    Month,ProgramCode,DemandUnits,CommittedUnits<br />
                    Sep-26,PRG-AVIONIC-09,800,800<br />
                    Oct-26,PRG-AVIONIC-09,950,950<br />
                    Nov-26,PRG-AVIONIC-09,1100,1100
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateCSVUpload}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
              >
                Validate & Import Forecast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
