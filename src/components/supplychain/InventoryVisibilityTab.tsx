import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Package,
  Boxes,
  ShieldAlert,
  ArrowUpDown,
  Building2,
  Tag,
  Hash,
  Clock,
  Sparkles,
  X,
  Eye,
  Info,
  Calendar,
  Grid
} from 'lucide-react';
import {
  InventoryItem,
  InventoryStockStatus,
  InventoryOwnership,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';

interface InventoryVisibilityTabProps {
  inventory: InventoryItem[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const InventoryVisibilityTab: React.FC<InventoryVisibilityTabProps> = ({
  inventory,
  selectedSite,
  currentRole,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<string>('all');
  const [selectedItemDetail, setSelectedItemDetail] = useState<InventoryItem | null>(null);
  const [drillDownBinItem, setDrillDownBinItem] = useState<InventoryItem | null>(null);

  // Filtered inventory items
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      // Site filter
      if (selectedSite !== 'all' && item.facility !== selectedSite) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && item.stockStatus !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      // Ownership filter
      if (ownershipFilter !== 'all' && item.ownershipType !== ownershipFilter) {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchPart = item.partNumber.toLowerCase().includes(term);
        const matchMpn = item.mpn.toLowerCase().includes(term);
        const matchDesc = item.description.toLowerCase().includes(term);
        const matchMfr = item.manufacturer.toLowerCase().includes(term);
        const matchBin = item.binLocation.toLowerCase().includes(term);
        const matchLot = item.lotNumber.toLowerCase().includes(term);
        if (!matchPart && !matchMpn && !matchDesc && !matchMfr && !matchBin && !matchLot) {
          return false;
        }
      }
      return true;
    });
  }, [inventory, selectedSite, statusFilter, categoryFilter, ownershipFilter, searchTerm]);

  // Aggregated Stock Metrics
  const totalValuation = useMemo(() => filteredItems.reduce((sum, item) => sum + item.totalInventoryValueUSD, 0), [filteredItems]);
  const criticalShortages = useMemo(() => filteredItems.filter(item => item.stockStatus === 'critical_shortage' || item.stockStatus === 'stockout').length, [filteredItems]);
  const lowStockCount = useMemo(() => filteredItems.filter(item => item.stockStatus === 'low_stock').length, [filteredItems]);
  const consignmentItemsCount = useMemo(() => filteredItems.filter(item => item.ownershipType !== 'Factory-Owned').length, [filteredItems]);

  const getStockStatusBadge = (status: InventoryStockStatus) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Healthy
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3" /> Low Stock
          </span>
        );
      case 'critical_shortage':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 animate-pulse">
            <ShieldAlert className="h-3 w-3" /> Critical Shortage
          </span>
        );
      case 'stockout':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-black text-rose-900 border border-rose-300">
            Stockout
          </span>
        );
      case 'overstock':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
            Overstock
          </span>
        );
    }
  };

  const getOwnershipBadge = (ownership: InventoryOwnership) => {
    switch (ownership) {
      case 'Consignment (Supplier-Owned)':
        return <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">Consignment (Supplier)</span>;
      case 'Customer-Consigned (VMI)':
        return <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">Customer VMI</span>;
      case 'Factory-Owned':
      default:
        return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">Factory-Owned</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Quick-Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Material Valuation</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              ${(totalValuation / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-400 font-medium">{filteredItems.length} SKUs Active</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Critical Shortages / Stockouts</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{criticalShortages}</span>
            <span className="text-xs text-rose-500 font-medium">Under Safety Buffer</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Low Stock Warnings</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{lowStockCount}</span>
            <span className="text-xs text-amber-500 font-medium">Reorder Triggered</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Consigned / VMI Stock</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-600">{consignmentItemsCount}</span>
            <span className="text-xs text-slate-400 font-medium">Supplier & Client VMI</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search part #, MPN, bin, lot..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Stock Statuses</option>
            <option value="critical_shortage">Critical Shortage</option>
            <option value="low_stock">Low Stock</option>
            <option value="healthy">Healthy</option>
            <option value="overstock">Overstock</option>
            <option value="stockout">Stockout</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Semiconductor">Semiconductors</option>
            <option value="Passive">Passives & Discretes</option>
            <option value="Connector">Connectors & Interconnect</option>
            <option value="PCB">Printed Circuit Boards (PCB)</option>
            <option value="Mechanical Hardware">Mechanical & Enclosures</option>
          </select>

          {/* Ownership Filter */}
          <select
            value={ownershipFilter}
            onChange={(e) => setOwnershipFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">All Ownership Types</option>
            <option value="Factory-Owned">Factory-Owned</option>
            <option value="Consignment (Supplier-Owned)">Consignment (Supplier)</option>
            <option value="Customer-Consigned (VMI)">Customer-Consigned (VMI)</option>
          </select>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Component / Part # / MPN</th>
                <th className="px-4 py-3.5">Warehouse Location & Bin</th>
                <th className="px-4 py-3.5 text-right">On Hand</th>
                <th className="px-4 py-3.5 text-right">Allocated</th>
                <th className="px-4 py-3.5 text-right">Available</th>
                <th className="px-4 py-3.5 text-right">On Order</th>
                <th className="px-4 py-3.5 text-center">Safety & Min/Max</th>
                <th className="px-4 py-3.5 text-center">Stock Status</th>
                <th className="px-4 py-3.5">Ownership</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => setSelectedItemDetail(item)}
                >
                  <td className="px-5 py-4 align-top">
                    <div className="space-y-0.5 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{item.partNumber}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-blue-600 block">{item.mpn}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{item.description}</span>
                      <span className="text-[10px] text-slate-400 block">Mfr: {item.manufacturer}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDrillDownBinItem(item);
                      }}
                      className="text-left group"
                    >
                      <div className="flex items-center gap-1 font-mono font-bold text-indigo-700 group-hover:underline">
                        <MapPin className="h-3 w-3 text-indigo-500" />
                        {item.binLocation}
                      </div>
                      <span className="text-[11px] text-slate-500 block">{item.facilityName}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">{item.warehouseZone}</span>
                    </button>
                  </td>

                  <td className="px-4 py-4 align-top text-right font-mono font-bold text-slate-900">
                    {item.onHandQty.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 align-top text-right font-mono text-amber-700">
                    {item.allocatedQty.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 align-top text-right font-mono font-bold text-emerald-700">
                    {item.availableQty.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 align-top text-right font-mono text-blue-600">
                    {item.onOrderQty > 0 ? `+${item.onOrderQty.toLocaleString()}` : '—'}
                  </td>

                  <td className="px-4 py-4 align-top text-center text-[11px]">
                    <span className="font-mono text-slate-700 block">
                      Min: {item.minStockQty.toLocaleString()} / Max: {item.maxStockQty.toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      Safety: {item.safetyStockQty.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top text-center whitespace-nowrap">
                    {getStockStatusBadge(item.stockStatus)}
                  </td>

                  <td className="px-4 py-4 align-top whitespace-nowrap">
                    {getOwnershipBadge(item.ownershipType)}
                  </td>

                  <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrillDownBinItem(item);
                        }}
                        title="View Bin Location Rack"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 transition shadow-2xs"
                      >
                        <Grid className="h-3.5 w-3.5 text-indigo-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItemDetail(item);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOCATION / BIN DRILL-DOWN MODAL */}
      {drillDownBinItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
                  <Grid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Warehouse Bin & Aisle Location Drill-Down
                  </h3>
                  <span className="font-mono text-xs text-indigo-600 font-bold">
                    {drillDownBinItem.binLocation} — {drillDownBinItem.facilityName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDrillDownBinItem(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Warehouse Physical Layout Schematic */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                Physical Storage Bay Mapping
              </span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block uppercase">Warehouse Zone</span>
                  <span className="font-bold text-slate-800">{drillDownBinItem.warehouseZone}</span>
                </div>
                <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block uppercase">Aisle & Row</span>
                  <span className="font-bold text-slate-800">{drillDownBinItem.aisle}</span>
                </div>
                <div className="rounded-xl bg-white p-3 border border-indigo-100 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block uppercase">Shelf & Tier</span>
                  <span className="font-bold text-slate-800">{drillDownBinItem.shelf}</span>
                </div>
              </div>

              {/* Visual Simulated Rack Matrix */}
              <div className="mt-3 rounded-xl bg-slate-900 p-4 text-white space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Rack Bay B-04 Visualizer</span>
                  <span className="text-emerald-400 font-mono">RFID Tag Verified</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-400">Bin A01</div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-400">Bin A02</div>
                  <div className="rounded-lg border-2 border-indigo-500 bg-indigo-900/60 p-2 text-white font-bold shadow-lg shadow-indigo-500/30">
                    ★ {drillDownBinItem.binLocation}
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-400">Bin A04</div>
                </div>
              </div>
            </div>

            {/* Batch & QA Metrology Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">Batch / Lot Number</span>
                <span className="font-mono font-bold text-slate-800">{drillDownBinItem.lotNumber}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">Date Code</span>
                <span className="font-mono font-bold text-slate-800">{drillDownBinItem.dateCode}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">MSD Sensitivity Level</span>
                <span className="font-bold text-indigo-600">{drillDownBinItem.msdLevel}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">RoHS / REACH</span>
                <span className="font-bold text-emerald-600">Compliant (Lead-Free)</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">Country of Origin</span>
                <span className="font-bold text-slate-800">{drillDownBinItem.countryOfOrigin}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">Last Physical Cycle Count</span>
                <span className="font-semibold text-slate-800">{drillDownBinItem.lastCycleCountDate}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDrillDownBinItem(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
              >
                Close Location View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL INVENTORY ITEM DETAIL MODAL */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedItemDetail.partNumber}</h3>
                  {getStockStatusBadge(selectedItemDetail.stockStatus)}
                </div>
                <p className="text-xs text-blue-600 font-mono mt-0.5 font-bold">
                  MPN: {selectedItemDetail.mpn} ({selectedItemDetail.manufacturer})
                </p>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description & Assigned Programs */}
            <div className="rounded-xl bg-slate-50 p-4 text-xs space-y-2">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Part Description</span>
                <p className="text-slate-800 font-medium">{selectedItemDetail.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Assigned Programs:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedItemDetail.assignedPrograms.map((prg) => (
                    <span key={prg} className="rounded bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 border border-slate-200">
                      {prg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Balance Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-[10px] text-slate-400 block font-medium">On Hand</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {selectedItemDetail.onHandQty.toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-[10px] text-slate-400 block font-medium">Allocated</span>
                <span className="text-lg font-bold font-mono text-amber-600">
                  {selectedItemDetail.allocatedQty.toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-[10px] text-slate-400 block font-medium">Free Available</span>
                <span className="text-lg font-bold font-mono text-emerald-600">
                  {selectedItemDetail.availableQty.toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-[10px] text-slate-400 block font-medium">On Order</span>
                <span className="text-lg font-bold font-mono text-blue-600">
                  +{selectedItemDetail.onOrderQty.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Financial Valuation */}
            <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Standard Unit Cost</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${selectedItemDetail.unitCostUSD.toFixed(3)} USD
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Extended Inventory Value</span>
                <span className="font-mono font-bold text-blue-600 text-sm">
                  ${selectedItemDetail.totalInventoryValueUSD.toLocaleString()} USD
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Ownership Model</span>
                {getOwnershipBadge(selectedItemDetail.ownershipType)}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
