import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ShieldAlert,
  Boxes,
  Zap,
  ArrowUpDown,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  Shuffle
} from 'lucide-react';
import { BomComponent, BomAvailabilitySignal } from '../../types';
import { INITIAL_BOM_COMPONENTS } from '../../data/collaborationData';

export function InteractiveBomTable() {
  const [bomItems, setBomItems] = useState<BomComponent[]>(INITIAL_BOM_COMPONENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedComponentForAlternate, setSelectedComponentForAlternate] = useState<BomComponent | null>(null);

  // Filter items
  const filteredItems = bomItems.filter(item => {
    if (signalFilter !== 'all' && item.availabilitySignal !== signalFilter) return false;
    if (riskFilter !== 'all' && item.singleSourceRisk !== riskFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchRefDes = item.refDes.toLowerCase().includes(q);
      const matchMpn = item.mpn.toLowerCase().includes(q);
      const matchMfr = item.manufacturer.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      return matchRefDes || matchMpn || matchMfr || matchDesc;
    }
    return true;
  });

  const totalLines = bomItems.length;
  const inStockCount = bomItems.filter(i => i.availabilitySignal === 'In Stock').length;
  const highRiskCount = bomItems.filter(i => i.singleSourceRisk === 'Critical High').length;
  const extendedLeadTimeCount = bomItems.filter(i => i.leadTimeWeeks >= 12).length;

  const getSignalBadge = (signal: BomAvailabilitySignal) => {
    switch (signal) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            In Stock
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Low Stock
          </span>
        );
      case 'Lead Time Alert':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Lead Time Alert
          </span>
        );
      case 'Allocation Risk':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
            <Zap className="w-3 h-3 text-purple-600" />
            Allocation Risk
          </span>
        );
      case 'Alternate Qualified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            <Shuffle className="w-3 h-3 text-blue-600" />
            Alternate Qualified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
            {signal}
          </span>
        );
    }
  };

  return (
    <div id="interactive-bom-container" className="space-y-4 text-left">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active BOM Lines</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalLines}</p>
          <span className="text-[11px] text-slate-500 font-medium">100% RoHS / REACH compliant</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Immediate In-Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {Math.round((inStockCount / totalLines) * 100)}%
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">{inStockCount} of {totalLines} items staged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Single Source Critical</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-1">{highRiskCount}</p>
          <span className="text-[11px] text-rose-600 font-medium">Requires LTB buffer / 2nd source</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lead Time &gt; 12 Weeks</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{extendedLeadTimeCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">Early procurement PO issued</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by RefDes (e.g. U102, C104), MPN, Manufacturer, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs">
          <select
            aria-label="Filter by availability signal"
            value={signalFilter}
            onChange={(e) => setSignalFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Availability Signals</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Lead Time Alert">Lead Time Alert</option>
            <option value="Allocation Risk">Allocation Risk</option>
          </select>

          <select
            aria-label="Filter by single source risk"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Risk Tiers</option>
            <option value="None">Low / No Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Critical High">Critical High Risk</option>
          </select>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* BOM Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3.5">RefDes</th>
                <th className="py-3 px-3.5">Manufacturer Part # (MPN)</th>
                <th className="py-3 px-3.5">Manufacturer</th>
                <th className="py-3 px-3.5">Description & Footprint</th>
                <th className="py-3 px-3.5 text-center">Qty</th>
                <th className="py-3 px-3.5">Availability Signal</th>
                <th className="py-3 px-3.5">Lead Time</th>
                <th className="py-3 px-3.5">Global Stock</th>
                <th className="py-3 px-3.5">Single-Source Risk</th>
                <th className="py-3 px-3.5 text-right">Unit Price</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* RefDes */}
                  <td className="py-3 px-3.5 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {item.refDes}
                  </td>

                  {/* MPN */}
                  <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {item.mpn}
                  </td>

                  {/* Manufacturer */}
                  <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                    {item.manufacturer}
                  </td>

                  {/* Description & Package */}
                  <td className="py-3 px-3.5 max-w-xs">
                    <p className="font-medium text-slate-800 line-clamp-1">{item.description}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{item.packageFootprint}</span>
                  </td>

                  {/* Qty */}
                  <td className="py-3 px-3.5 text-center font-bold font-mono text-slate-800">
                    {item.quantityPerBoard}
                  </td>

                  {/* Availability Signal */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    {getSignalBadge(item.availabilitySignal)}
                  </td>

                  {/* Lead Time */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className={`font-mono font-semibold ${
                      item.leadTimeWeeks >= 14 ? 'text-rose-600 font-bold' : 'text-slate-700'
                    }`}>
                      {item.leadTimeWeeks} wks
                    </span>
                  </td>

                  {/* Stock Qty */}
                  <td className="py-3 px-3.5 font-mono text-slate-700 whitespace-nowrap">
                    {item.globalStockQty.toLocaleString()} pcs
                  </td>

                  {/* Single Source Risk */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.singleSourceRisk === 'Critical High' ? 'bg-rose-100 text-rose-800' :
                      item.singleSourceRisk === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.singleSourceRisk}
                    </span>
                  </td>

                  {/* Unit Price */}
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ${item.unitCostUSD.toFixed(item.unitCostUSD < 1 ? 3 : 2)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    {item.secondSourceMpn ? (
                      <button
                        onClick={() => setSelectedComponentForAlternate(item)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors text-[11px] font-bold inline-flex items-center gap-1"
                        title="View Alternate Part"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        Alt
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Single Src</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALTERNATE PART MODAL */}
      {selectedComponentForAlternate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Shuffle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Alternate Part Cross-Reference</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedComponentForAlternate.refDes} &bull; {selectedComponentForAlternate.mpn}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedComponentForAlternate(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Part on Schematic</span>
                <p className="font-bold text-slate-900 font-mono">{selectedComponentForAlternate.mpn} ({selectedComponentForAlternate.manufacturer})</p>
                <p className="text-slate-600">{selectedComponentForAlternate.description}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pre-Qualified Form-Fit-Function Alternate
                </span>
                <p className="font-bold text-emerald-950 font-mono">{selectedComponentForAlternate.secondSourceMpn}</p>
                <p className="text-emerald-800 text-[11px]">
                  Pin-to-pin compatible drop-in equivalent with matching thermal pad and register map. Verified under NPI Engineering DVT qualification.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Alternate Lead Time:</span>
                  <span className="font-bold text-emerald-700 font-mono">3 Weeks (Fast Track)</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Distributor Stock Buffer:</span>
                  <span className="font-bold text-slate-800 font-mono">24,500 Available</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedComponentForAlternate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Alternate part ${selectedComponentForAlternate.secondSourceMpn} requested for BOM swap.`);
                  setSelectedComponentForAlternate(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                Request Second-Source Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
