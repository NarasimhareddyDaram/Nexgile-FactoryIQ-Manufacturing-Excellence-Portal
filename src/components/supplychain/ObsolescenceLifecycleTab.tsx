import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shuffle,
  ShieldAlert,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  FileText,
  Search,
  Filter,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import {
  ObsolescenceItem,
  AlternatePartSuggestion,
  Role,
  User as UserType
} from '../../types';

interface ObsolescenceLifecycleTabProps {
  obsolescenceItems: ObsolescenceItem[];
  currentRole: Role;
  currentUser: UserType;
}

export const ObsolescenceLifecycleTab: React.FC<ObsolescenceLifecycleTabProps> = ({
  obsolescenceItems,
  currentRole,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItemForAlternates, setSelectedItemForAlternates] = useState<ObsolescenceItem | null>(null);
  const [selectedItemForLTB, setSelectedItemForLTB] = useState<ObsolescenceItem | null>(null);

  // Local simulated state for LTB buffer order creation
  const [committedLTBs, setCommittedLTBs] = useState<Record<string, number>>({});

  const filteredItems = obsolescenceItems.filter((item) => {
    if (statusFilter !== 'all' && item.lifecycleStatus !== statusFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchPart = item.partNumber.toLowerCase().includes(term);
      const matchMpn = item.mpn.toLowerCase().includes(term);
      const matchMfr = item.manufacturer.toLowerCase().includes(term);
      const matchPrg = item.affectedPrograms.some(p => p.toLowerCase().includes(term));
      if (!matchPart && !matchMpn && !matchMfr && !matchPrg) {
        return false;
      }
    }
    return true;
  });

  const getLifecycleTag = (status: ObsolescenceItem['lifecycleStatus']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
        );
      case 'NRND':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3" /> NRND (Not Rec.)
          </span>
        );
      case 'EOL':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 animate-pulse">
            <ShieldAlert className="h-3 w-3" /> EOL (End of Life)
          </span>
        );
      case 'Discontinued':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white border border-slate-700">
            Discontinued
          </span>
        );
    }
  };

  const getEquivalenceBadge = (type: AlternatePartSuggestion['equivalenceType']) => {
    switch (type) {
      case 'Form-Fit-Function (FFF) Drop-in':
        return (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            FFF 100% Drop-In
          </span>
        );
      case 'Pin-Compatible (Firmware Update)':
        return (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            Pin-Compatible (FW Mod)
          </span>
        );
      case 'Major Redesign Required':
      default:
        return (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
            PCB Redesign Needed
          </span>
        );
    }
  };

  const getQualBadge = (qual: AlternatePartSuggestion['qualificationStatus']) => {
    switch (qual) {
      case 'Fully Qualified & Approved':
        return <span className="text-emerald-700 font-bold">✓ Approved</span>;
      case 'Testing In-Progress (DVT)':
        return <span className="text-blue-600 font-semibold">Testing (DVT)</span>;
      case 'Requires Validation':
      default:
        return <span className="text-amber-600 font-medium">Pending Qual</span>;
    }
  };

  // Metrics summary
  const totalLTBShortfallCost = obsolescenceItems.reduce((sum, item) => sum + item.estimatedLTBCostUSD, 0);
  const criticalItemsCount = obsolescenceItems.filter(item => item.lifecycleStatus === 'EOL' || item.lifecycleStatus === 'Discontinued').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Components Under Lifecycle Alert</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{obsolescenceItems.length} SKUs</span>
            <span className="text-xs text-rose-600 font-medium">{criticalItemsCount} EOL / Discontinued</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Estimated Last-Time-Buy Capital Requirement</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">${(totalLTBShortfallCost / 1000).toFixed(1)}k USD</span>
            <span className="text-xs text-slate-400 font-medium">12-Mo Buffer Demand</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Drop-in FFF Alternates Identified</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">100% Coverage</span>
            <span className="text-xs text-slate-400 font-medium">Dual-Sourcing Enabled</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search MPN, description, program..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Lifecycle Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Lifecycle States</option>
            <option value="Active">Active</option>
            <option value="NRND">NRND (Not Recommended)</option>
            <option value="EOL">EOL (End of Life)</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Lifecycle Obsolescence Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Component / MPN</th>
                <th className="px-4 py-3.5">Lifecycle State</th>
                <th className="px-4 py-3.5">Affected Programs</th>
                <th className="px-4 py-3.5">Key Deadlines (LTB / LTS)</th>
                <th className="px-4 py-3.5 text-right">12-Mo Demand vs Stock</th>
                <th className="px-4 py-3.5 text-right">LTB Buffer Shortfall</th>
                <th className="px-4 py-3.5">Redesign ECO</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isCommitted = committedLTBs[item.id] !== undefined;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-0.5 max-w-xs">
                        <span className="font-mono font-bold text-slate-900 block">{item.mpn}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{item.description}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{item.partNumber} • Mfr: {item.manufacturer}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      {getLifecycleTag(item.lifecycleStatus)}
                      {item.pcnNumber && (
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          PCN: {item.pcnNumber}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.affectedPrograms.map((prg) => (
                          <span key={prg} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                            {prg}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap text-[11px]">
                      {item.lastTimeBuyDeadline ? (
                        <div className="space-y-0.5">
                          <span className="text-slate-500">LTB: <strong className="text-rose-600">{item.lastTimeBuyDeadline}</strong></span>
                          <span className="text-slate-400 block">LTS: {item.lastTimeShipDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No EOL notice</span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top text-right whitespace-nowrap font-mono text-[11px]">
                      <div className="space-y-0.5">
                        <span className="text-slate-900 font-bold">{item.projectedDemand12Mo.toLocaleString()} req</span>
                        <span className="text-slate-400 block">{item.currentStockTotal.toLocaleString()} on-hand</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top text-right whitespace-nowrap font-mono">
                      {item.bufferShortfallUnits > 0 ? (
                        <div className="space-y-0.5">
                          <span className="text-rose-600 font-bold block">
                            -{item.bufferShortfallUnits.toLocaleString()} units
                          </span>
                          <span className="text-slate-500 text-[10px] block">
                            ${item.estimatedLTBCostUSD.toLocaleString()} USD
                          </span>
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">Sufficient Stock</span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap text-[11px]">
                      {item.redesignECN ? (
                        <div className="space-y-1 max-w-xs">
                          <span className="font-mono font-bold text-blue-600 block">{item.redesignECN.ecnNumber}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.redesignECN.progressPercent}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700">{item.redesignECN.progressPercent}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None required</span>
                      )}
                    </td>

                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.alternateParts.length > 0 && (
                          <button
                            onClick={() => setSelectedItemForAlternates(item)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                          >
                            Alternates ({item.alternateParts.length})
                          </button>
                        )}
                        {item.bufferShortfallUnits > 0 && (
                          <button
                            onClick={() => setSelectedItemForLTB(item)}
                            className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
                          >
                            {isCommitted ? 'LTB Planned ✓' : 'Plan LTB'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALTERNATE PART SUGGESTIONS DRAWER / MODAL */}
      {selectedItemForAlternates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                    <Shuffle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Alternate & Drop-In Replacement Engine
                    </h3>
                    <p className="text-xs text-slate-500">
                      Original MPN: <strong className="font-mono text-slate-800">{selectedItemForAlternates.mpn}</strong> ({selectedItemForAlternates.manufacturer})
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemForAlternates(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedItemForAlternates.alternateParts.map((alt, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{alt.altMpn}</span>
                        <span className="text-xs text-slate-500 font-semibold">({alt.altManufacturer})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Availability: {alt.stockAvailability}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getEquivalenceBadge(alt.equivalenceType)}
                      <span className="text-xs font-semibold">{getQualBadge(alt.qualificationStatus)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                    <strong>Engineering Assessment:</strong> {alt.notes}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="rounded-lg bg-white p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Unit Cost Delta</span>
                      <span className={`font-bold font-mono ${alt.unitPriceDeltaPercent <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {alt.unitPriceDeltaPercent > 0 ? `+${alt.unitPriceDeltaPercent}%` : `${alt.unitPriceDeltaPercent}%`}
                      </span>
                    </div>
                    <div className="rounded-lg bg-white p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Lead-Time</span>
                      <span className="font-bold font-mono text-slate-800">{alt.leadTimeWeeks} Weeks</span>
                    </div>
                    <div className="rounded-lg bg-white p-2 border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">Qualification</span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate block">{alt.qualificationStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItemForAlternates(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAST-TIME-BUY (LTB) PLANNING MODAL */}
      {selectedItemForLTB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Last-Time-Buy (LTB) Buffer Order Calculator
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedItemForLTB.mpn} ({selectedItemForLTB.manufacturer})
                </p>
              </div>
              <button
                onClick={() => setSelectedItemForLTB(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-900">
                <strong>LTB Deadline:</strong> Order must be placed prior to <strong className="underline">{selectedItemForLTB.lastTimeBuyDeadline}</strong> to secure wafer allocation.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-400 block">12-Mo Projected Demand</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {selectedItemForLTB.projectedDemand12Mo.toLocaleString()} units
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-400 block">Current Available Stock</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {selectedItemForLTB.currentStockTotal.toLocaleString()} units
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-blue-500 bg-blue-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Calculated Buffer Shortfall</span>
                  <span className="text-lg font-black text-rose-600 font-mono">
                    {selectedItemForLTB.bufferShortfallUnits.toLocaleString()} units
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-200 text-blue-900">
                  <span>Required Capital Commitment:</span>
                  <span className="font-bold font-mono text-base">
                    ${selectedItemForLTB.estimatedLTBCostUSD.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItemForLTB(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCommittedLTBs(prev => ({ ...prev, [selectedItemForLTB.id]: selectedItemForLTB.bufferShortfallUnits }));
                  setSelectedItemForLTB(null);
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
              >
                Approve & Commit LTB PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
