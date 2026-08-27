import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Truck,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  DollarSign,
  ShieldAlert,
  Package,
  Layers,
  FileText,
  X,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import {
  PurchaseOrder,
  SupplierScorecard,
  FactorySiteId,
  Role,
  User as UserType,
  POStatus
} from '../../types';
import { mockLeadTimeTrendData } from '../../data/supplyChainData';

interface POSupplierTrackingTabProps {
  purchaseOrders: PurchaseOrder[];
  suppliers: SupplierScorecard[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
  onSelectPO?: (po: PurchaseOrder) => void;
}

export const POSupplierTrackingTab: React.FC<POSupplierTrackingTabProps> = ({
  purchaseOrders,
  suppliers,
  selectedSite,
  currentRole,
  currentUser,
  onSelectPO
}) => {
  const [activeSubView, setActiveSubView] = useState<'orders' | 'suppliers' | 'leadtimes'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [selectedPODetail, setSelectedPODetail] = useState<PurchaseOrder | null>(null);
  const [selectedSupplierDetail, setSelectedSupplierDetail] = useState<SupplierScorecard | null>(null);

  // Filter Purchase Orders
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      // Site filter
      if (selectedSite !== 'all' && po.facilityDestination !== selectedSite) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && po.status !== statusFilter) {
        return false;
      }
      // Supplier filter
      if (supplierFilter !== 'all' && po.supplierId !== supplierFilter) {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNumber = po.poNumber.toLowerCase().includes(term);
        const matchSupplier = po.supplierName.toLowerCase().includes(term);
        const matchProgram = po.programCode.toLowerCase().includes(term) || po.programName.toLowerCase().includes(term);
        const matchParts = po.lineItems.some(
          li => li.partNumber.toLowerCase().includes(term) || li.mpn.toLowerCase().includes(term) || li.description.toLowerCase().includes(term)
        );
        if (!matchNumber && !matchSupplier && !matchProgram && !matchParts) {
          return false;
        }
      }
      return true;
    });
  }, [purchaseOrders, selectedSite, statusFilter, supplierFilter, searchTerm]);

  // Status badges
  const getPOStatusBadge = (status: POStatus) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Received
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <Truck className="h-3 w-3" /> In Transit
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 animate-pulse">
            <AlertTriangle className="h-3 w-3" /> Delayed
          </span>
        );
      case 'partially_received':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Partial
          </span>
        );
      case 'acknowledged':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
            Acknowledged
          </span>
        );
      case 'issued':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            Issued
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const getRiskBadge = (risk: SupplierScorecard['riskLevel']) => {
    switch (risk) {
      case 'low':
        return <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">Low Risk</span>;
      case 'medium':
        return <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">Medium Risk</span>;
      case 'high':
      case 'critical':
        return <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">High Risk</span>;
    }
  };

  // PO stats summary
  const totalSpend = useMemo(() => filteredOrders.reduce((sum, po) => sum + po.totalAmountUSD, 0), [filteredOrders]);
  const delayedCount = useMemo(() => filteredOrders.filter(po => po.status === 'delayed').length, [filteredOrders]);
  const inTransitCount = useMemo(() => filteredOrders.filter(po => po.status === 'in_transit').length, [filteredOrders]);

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Purchase Orders & Supplier Performance Intelligence
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Active Procurement Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global component PO tracking, lead-time dynamics, and tier-1 supplier quality/delivery scorecards
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setActiveSubView('orders')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubView === 'orders'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Purchase Orders ({filteredOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView('suppliers')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubView === 'suppliers'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Supplier Scorecards ({suppliers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubView('leadtimes')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSubView === 'leadtimes'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Lead-Time Trends</span>
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: PURCHASE ORDERS TABLE & FILTERS */}
      {activeSubView === 'orders' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Active PO Commitment</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">${(totalSpend / 1000).toFixed(1)}k</span>
                <span className="text-xs text-slate-400 font-medium">{filteredOrders.length} Orders</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">In-Transit Shipments</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600">{inTransitCount}</span>
                <span className="text-xs text-blue-600 font-medium">Air & Ocean</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Delayed / Critical Alerts</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rose-600">{delayedCount}</span>
                <span className="text-xs text-rose-600 font-medium">Action Required</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Avg Cycle Lead Time</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">38 Days</span>
                <span className="text-xs text-emerald-600 font-medium">↓ 4d vs Q1</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search PO#, MPN, part, supplier..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span>Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="in_transit">In Transit</option>
                <option value="delayed">Delayed</option>
                <option value="received">Received</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="issued">Issued</option>
              </select>

              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PO Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">PO Number & Program</th>
                    <th className="px-4 py-3.5">Supplier & Tier</th>
                    <th className="px-4 py-3.5">Key Components (Line Items)</th>
                    <th className="px-4 py-3.5">Destination & Incoterm</th>
                    <th className="px-4 py-3.5">Dates & Lead-Time</th>
                    <th className="px-4 py-3.5 text-right">Total (USD)</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((po) => (
                    <tr
                      key={po.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => setSelectedPODetail(po)}
                    >
                      <td className="px-5 py-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-blue-600 hover:underline block">
                            {po.poNumber}
                          </span>
                          <span className="font-semibold text-slate-900 block">{po.programCode}</span>
                          <span className="text-[11px] text-slate-400 truncate block max-w-xs">{po.programName}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block">{po.supplierName}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 inline-block">
                            {po.supplierTier}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="space-y-1 max-w-xs">
                          {po.lineItems.map((item) => (
                            <div key={item.id} className="text-[11px]">
                              <span className="font-mono font-semibold text-slate-800">{item.mpn}</span>
                              <span className="text-slate-400 block truncate">
                                {item.qtyOrdered.toLocaleString()} units • {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="font-semibold text-slate-800">{po.facilityName}</span>
                          <span className="text-slate-400 block font-mono">{po.incoterms}</span>
                          <span className="text-slate-500 block">{po.shippingMethod}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="text-slate-400">Promised: <strong className="text-slate-800">{po.promisedDeliveryDate}</strong></span>
                          {po.revisedETA && po.revisedETA !== po.promisedDeliveryDate && (
                            <span className="text-rose-600 font-bold block">
                              ETA: {po.revisedETA}
                            </span>
                          )}
                          <span className="text-slate-400 block">Lead-time: {po.leadTimeDays}d</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top text-right whitespace-nowrap font-mono font-bold text-slate-900">
                        ${po.totalAmountUSD.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 align-top text-center whitespace-nowrap">
                        {getPOStatusBadge(po.status)}
                      </td>

                      <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPODetail(po);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: SUPPLIER SCORECARDS */}
      {activeSubView === 'suppliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => setSelectedSupplierDetail(supplier)}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-400 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {supplier.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{supplier.name}</h3>
                      <span className="text-xs text-slate-500 font-mono">{supplier.code} • {supplier.country}</span>
                    </div>

                    <div className={`rounded-xl border px-2.5 py-1 text-center font-bold text-sm ${getScoreColor(supplier.overallScore)}`}>
                      <span className="text-[9px] uppercase tracking-wider block opacity-70">Rating</span>
                      {supplier.overallScore}/100
                    </div>
                  </div>

                  {/* Rating Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                    <div className="rounded-xl bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Quality</span>
                      <span className="text-xs font-bold text-slate-800">{supplier.qualityRating}%</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Delivery OTD</span>
                      <span className="text-xs font-bold text-slate-800">{supplier.deliveryOTD}%</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Cost Index</span>
                      <span className="text-xs font-bold text-slate-800">{supplier.costCompetitiveness}%</span>
                    </div>
                  </div>

                  {/* Lead-Time Mini Sparkline */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Average Lead-Time:</span>
                      <span className="font-bold text-slate-800">{supplier.avgLeadTimeWeeks} Weeks</span>
                    </div>
                    <div className="h-16 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={supplier.historicalLeadTimes} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} />
                          <YAxis stroke="#94a3b8" fontSize={9} />
                          <Tooltip />
                          <Line type="monotone" dataKey="leadTimeWeeks" name="Lead-Time (Wks)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                          <Line type="monotone" dataKey="industryAvgWeeks" name="Industry Avg" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Footer Spend & Risk */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Annual Spend</span>
                    <span className="font-bold text-slate-900">${(supplier.annualSpendUSD / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRiskBadge(supplier.riskLevel)}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      ESG {supplier.esgRating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 3: LEAD-TIME DYNAMICS & CHARTS */}
      {activeSubView === 'leadtimes' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Global Component Category Lead-Time Trends (Weeks)
                </h3>
                <p className="text-xs text-slate-500">
                  Rolling 7-month manufacturing procurement lead-time curves across critical commodity groups
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                Industry Semiconductor Index Stabilizing
              </span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLeadTimeTrendData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} label={{ value: 'Weeks', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                    formatter={(val: number) => [`${val} Weeks`, 'Lead-Time']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="mcuLeadTime" name="Microcontrollers & SoC" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="analogLeadTime" name="Analog & Power ICs" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="passivesLeadTime" name="MLCCs & Passives" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="interconnectLeadTime" name="Mil-Spec Interconnect" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="pcbLeadTime" name="HDI & High-Layer PCBs" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* PO DETAIL MODAL */}
      {selectedPODetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedPODetail.poNumber}</h3>
                  {getPOStatusBadge(selectedPODetail.status)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Program: <strong className="text-slate-800">{selectedPODetail.programCode}</strong> — {selectedPODetail.programName}
                </p>
              </div>
              <button
                onClick={() => setSelectedPODetail(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* PO Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 text-[10px] block">Supplier</span>
                <span className="font-bold text-slate-800">{selectedPODetail.supplierName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Destination Facility</span>
                <span className="font-semibold text-slate-800">{selectedPODetail.facilityName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Incoterms</span>
                <span className="font-mono font-semibold text-slate-800">{selectedPODetail.incoterms}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Order Date</span>
                <span className="font-semibold text-slate-800">{selectedPODetail.orderDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Promised Delivery</span>
                <span className="font-semibold text-slate-800">{selectedPODetail.promisedDeliveryDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Payment Terms</span>
                <span className="font-semibold text-slate-800">{selectedPODetail.paymentTerms}</span>
              </div>
              {selectedPODetail.trackingNumber && (
                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Freight Carrier & AWB Tracking</span>
                    <span className="font-mono font-bold text-blue-600">{selectedPODetail.carrier} — {selectedPODetail.trackingNumber}</span>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                    {selectedPODetail.shippingMethod}
                  </span>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ordered Components</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="p-2.5">MPN / Description</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPODetail.lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="p-2.5">
                          <span className="font-mono font-bold text-slate-900 block">{item.mpn}</span>
                          <span className="text-[11px] text-slate-500">{item.description}</span>
                        </td>
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                          {item.qtyOrdered.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-700">
                          ${item.unitPriceUSD.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          ${item.lineTotalUSD.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right text-slate-700">Total Purchase Order Value:</td>
                      <td className="p-2.5 text-right font-mono text-blue-600 text-sm">
                        ${selectedPODetail.totalAmountUSD.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedPODetail.notes && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-800">
                <strong>Procurement Logistics Note:</strong> {selectedPODetail.notes}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPODetail(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLIER DETAIL MODAL */}
      {selectedSupplierDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedSupplierDetail.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {selectedSupplierDetail.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category: {selectedSupplierDetail.category} • Tier: {selectedSupplierDetail.tier}
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplierDetail(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">Primary Executive Contact</span>
                <span className="font-bold text-slate-800 block mt-0.5">{selectedSupplierDetail.primaryContact}</span>
                <span className="text-blue-600 font-mono text-[11px] block">{selectedSupplierDetail.contactEmail}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 text-[10px] block">Annual Spend Allocation</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  ${(selectedSupplierDetail.annualSpendUSD / 1000000).toFixed(2)}M USD
                </span>
                <span className="text-slate-500 text-[11px]">{selectedSupplierDetail.openPOCount} Open Purchase Orders</span>
              </div>
            </div>

            {/* Scorecard Table */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Audit & Quality Metrology Scorecard</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">On-Time Delivery Rate (OTD)</span>
                  <span className="font-bold text-slate-900">{selectedSupplierDetail.deliveryOTD}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedSupplierDetail.deliveryOTD}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-600">Incoming Lot Acceptance Rate</span>
                  <span className="font-bold text-slate-900">{selectedSupplierDetail.qualityRating}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${selectedSupplierDetail.qualityRating}%` }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSupplierDetail(null)}
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
