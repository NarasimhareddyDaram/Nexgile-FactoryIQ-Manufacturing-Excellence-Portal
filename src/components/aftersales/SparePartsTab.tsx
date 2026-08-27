import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ShoppingCart,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  DollarSign,
  Package,
  Building,
  RefreshCw,
  GitCompare,
  MapPin,
  Clock,
  X
} from 'lucide-react';
import {
  SparePart,
  SparePartOrder,
  SparePartEquivalent,
  Role,
  User
} from '../../types';
import {
  mockSpareParts,
  mockSparePartOrders
} from '../../data/afterSalesData';

interface SparePartsTabProps {
  currentRole: Role | null;
  currentUser: User | null;
}

export function SparePartsTab({ currentRole, currentUser }: SparePartsTabProps) {
  const [parts, setParts] = useState<SparePart[]>(mockSpareParts);
  const [orders, setOrders] = useState<SparePartOrder[]>(mockSparePartOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPartForCrossRef, setSelectedPartForCrossRef] = useState<SparePart | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [targetOrderPart, setTargetOrderPart] = useState<SparePart | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Order Placement Form
  const [orderCustomer, setOrderCustomer] = useState(currentUser?.company || 'AeroDynamics Global Corp');
  const [orderPO, setOrderPO] = useState('PO-SPARE-2026-099');
  const [orderQty, setOrderQty] = useState(2);
  const [orderShippingSpeed, setOrderShippingSpeed] = useState<'Priority Courier (Next Day)' | 'Standard Air (3-5 Days)' | 'Economy Ground'>('Priority Courier (Next Day)');
  const [orderAddress, setOrderAddress] = useState('8400 Aviation Way, Hangar 4, Seattle WA 98108');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenOrder = (part: SparePart) => {
    setTargetOrderPart(part);
    setOrderQty(part.minOrderQty || 1);
    setShowOrderModal(true);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrderPart) return;

    const unitPrice = targetOrderPart.unitPriceUSD;
    const total = unitPrice * orderQty;
    const randomOrderNum = `SPO-2026-0${940 + orders.length + 1}`;
    const randomTracking = `7946 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: SparePartOrder = {
      id: `spo-${Date.now()}`,
      orderNumber: randomOrderNum,
      customerName: orderCustomer,
      poReference: orderPO,
      orderDate: new Date().toISOString().split('T')[0],
      items: [
        {
          partNumber: targetOrderPart.partNumber,
          name: targetOrderPart.name,
          quantity: orderQty,
          unitPriceUSD: unitPrice,
          lineTotalUSD: total
        }
      ],
      totalAmountUSD: total,
      shippingSpeed: orderShippingSpeed,
      destinationAddress: orderAddress,
      status: 'Picking & Packing',
      carrier: 'FedEx Priority Overnight',
      trackingNumber: randomTracking,
      estimatedDelivery: 'Tomorrow, 10:30 AM'
    };

    // Deduct stock
    setParts(prev =>
      prev.map(p => {
        if (p.id !== targetOrderPart.id) return p;
        const newAvailable = Math.max(0, p.availableQty - orderQty);
        const newAllocated = p.allocatedQty + orderQty;
        return {
          ...p,
          availableQty: newAvailable,
          allocatedQty: newAllocated,
          stockStatus: newAvailable <= 5 ? 'Low Stock' : 'In Stock'
        };
      })
    );

    setOrders([newOrder, ...orders]);
    setShowOrderModal(false);
    showToast(`Spare Part Order ${randomOrderNum} placed successfully! Tracking generated.`);
  };

  const filteredParts = parts.filter(p => {
    const matchesSearch =
      p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mpn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.compatiblePrograms.some(prog => prog.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.stockStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = parts.reduce((acc, p) => acc + p.availableQty * p.unitPriceUSD, 0);

  return (
    <div id="spare-parts-container" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Spares Catalog</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{parts.length} SKUs</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              100% Qualified
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">FRUs, modules, passives & mechanicals</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability Fill Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">96.8%</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Target &gt; 95%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Same-day dispatch readiness</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Buffer Value</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">${(totalValue / 1000).toFixed(1)}k USD</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Across Hubs
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Austin, Guadalajara & Penang stock</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Fulfillment Orders</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{orders.length} Orders</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              In Delivery
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Express courier air shipments</p>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="spares-search-input"
              type="text"
              placeholder="Search by Part #, MPN, Name, Program..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="spares-category-filter"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="PCB Assemblies (FRU)">PCB Assemblies (FRU)</option>
              <option value="Sub-modules & Sensors">Sub-modules & Sensors</option>
              <option value="Cables & Harnesses">Cables & Harnesses</option>
              <option value="Consumables & Gaskets">Consumables & Gaskets</option>
            </select>

            <select
              id="spares-status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Backordered">Backordered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spare Parts Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Part # & MPN</th>
                <th className="py-3 px-4">Description & Category</th>
                <th className="py-3 px-4">Compatible Programs</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Location / Lead Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No spare parts match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredParts.map(part => (
                  <tr key={part.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-indigo-600 font-mono text-xs sm:text-sm">
                        {part.partNumber}
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{part.mpn}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 max-w-[260px]">{part.name}</div>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium mt-1 inline-block">
                        {part.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {part.compatiblePrograms.map((prog, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${part.unitPriceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            part.stockStatus === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : part.stockStatus === 'Low Stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {part.stockStatus}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-mono">
                        <strong className="text-slate-900">{part.availableQty}</strong> Avail /{' '}
                        <span className="text-slate-400">{part.onHandQty} On-Hand</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-slate-700 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]" title={part.warehouseLocation}>
                          {part.warehouseLocation}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Lead Time: <strong className="text-slate-700">{part.leadTimeDays} Days</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {part.alternateEquivalents.length > 0 && (
                          <button
                            id={`btn-crossref-${part.id}`}
                            onClick={() => setSelectedPartForCrossRef(part)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-slate-200 transition-colors"
                            title="View Form-Fit-Function Alternate Equivalents"
                          >
                            <GitCompare className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          id={`btn-order-${part.id}`}
                          onClick={() => handleOpenOrder(part)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Reference / Alternate Part Finder Modal */}
      {selectedPartForCrossRef && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm">Cross-Reference & Alternate Part Finder</h3>
                  <p className="text-xs text-slate-400">
                    Primary: <span className="text-white font-mono">{selectedPartForCrossRef.partNumber}</span> (
                    {selectedPartForCrossRef.mpn})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartForCrossRef(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <strong>Engineering Equivalence Notes:</strong> The alternates below have undergone formal Form-Fit-Function
                (FFF) evaluation and are authorized for factory depot servicing.
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Alternate Part # & MPN</th>
                      <th className="p-3">Manufacturer</th>
                      <th className="p-3">Compatibility Tier</th>
                      <th className="p-3">Unit Price</th>
                      <th className="p-3">Depot Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPartForCrossRef.alternateEquivalents.map((alt, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 font-mono">{alt.partNumber}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{alt.mpn}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-800">{alt.manufacturer}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold ${
                              alt.compatibilityLevel.includes('100%')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alt.compatibilityLevel}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">${alt.priceUSD.toFixed(2)}</td>
                        <td className="p-3 font-mono font-semibold text-indigo-600">{alt.stockQty} Units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedPartForCrossRef(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spare Parts Order Modal */}
      {showOrderModal && targetOrderPart && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Place Fast-Track Spares Order</h3>
                <p className="text-xs text-indigo-100">Same-day dispatch from certified depot warehouse</p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 text-indigo-200 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{targetOrderPart.name}</div>
                <div className="font-mono text-slate-500">
                  PN: {targetOrderPart.partNumber} | Available: {targetOrderPart.availableQty} Units
                </div>
                <div className="text-indigo-600 font-bold font-mono">
                  ${targetOrderPart.unitPriceUSD.toLocaleString()} USD / Unit
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Order Quantity</label>
                  <input
                    type="number"
                    min={targetOrderPart.minOrderQty || 1}
                    max={targetOrderPart.availableQty}
                    required
                    value={orderQty}
                    onChange={e => setOrderQty(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Customer PO Reference</label>
                  <input
                    type="text"
                    required
                    value={orderPO}
                    onChange={e => setOrderPO(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Shipping Speed</label>
                <select
                  value={orderShippingSpeed}
                  onChange={e => setOrderShippingSpeed(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Priority Courier (Next Day)">Priority Courier (Next Day Air)</option>
                  <option value="Standard Air (3-5 Days)">Standard Air (3-5 Days)</option>
                  <option value="Economy Ground">Economy Ground (5-7 Days)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  value={orderAddress}
                  onChange={e => setOrderAddress(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                <span>Calculated Order Total:</span>
                <span className="text-base font-mono font-black text-emerald-400">
                  ${(targetOrderPart.unitPriceUSD * orderQty).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  USD
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Confirm & Dispatch Spares</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Spare Part Orders & Delivery Tracking Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
              <Truck className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-slate-900">Active Spares Delivery Tracking & Order Status</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{orders.length} Active Shipments</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Order # & PO</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Item Breakdown</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Carrier & Tracking</th>
                <th className="p-3">Status</th>
                <th className="p-3">Delivery ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <div className="font-bold text-indigo-600 font-mono">{ord.orderNumber}</div>
                    <div className="text-[11px] font-mono text-slate-500">{ord.poReference}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-900">{ord.customerName}</td>
                  <td className="p-3">
                    {ord.items.map((it, i) => (
                      <div key={i} className="text-slate-700">
                        <span className="font-bold text-slate-900">{it.quantity}x</span> {it.name}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    ${ord.totalAmountUSD.toLocaleString()} USD
                  </td>
                  <td className="p-3 font-mono">
                    <div className="text-slate-900 font-semibold">{ord.carrier}</div>
                    <div className="text-indigo-600 text-[11px] font-bold">{ord.trackingNumber}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        ord.status.includes('Shipped')
                          ? 'bg-purple-100 text-purple-800'
                          : ord.status.includes('Delivered')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{ord.estimatedDelivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
