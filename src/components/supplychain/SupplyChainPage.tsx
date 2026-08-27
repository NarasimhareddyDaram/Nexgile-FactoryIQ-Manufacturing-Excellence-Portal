import React, { useState } from 'react';
import {
  Truck,
  Package,
  Boxes,
  Layers,
  Sparkles,
  RefreshCw,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Filter,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import {
  FactorySiteId,
  Role,
  User as UserType,
  PurchaseOrder,
  SupplierScorecard,
  InventoryItem,
  LogisticsShipment,
  ObsolescenceItem,
  ForecastScenario,
  MRPSummaryItem,
  CapacityCommitment
} from '../../types';
import {
  mockPurchaseOrders,
  mockSupplierScorecards,
  mockInventoryItems,
  mockLogisticsShipments,
  mockObsolescenceItems,
  mockForecastScenarios,
  mockMRPSummaryItems,
  mockCapacityCommitments
} from '../../data/supplyChainData';
import { POSupplierTrackingTab } from './POSupplierTrackingTab';
import { InventoryVisibilityTab } from './InventoryVisibilityTab';
import { LogisticsTrackingTab } from './LogisticsTrackingTab';
import { ObsolescenceLifecycleTab } from './ObsolescenceLifecycleTab';
import { ForecastMRPCollaborationTab } from './ForecastMRPCollaborationTab';

interface SupplyChainPageProps {
  currentRole: Role;
  currentUser: UserType;
}

export type SupplyChainSubTab =
  | 'po_suppliers'
  | 'inventory'
  | 'logistics'
  | 'obsolescence'
  | 'forecast_mrp';

export const SupplyChainPage: React.FC<SupplyChainPageProps> = ({
  currentRole,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<SupplyChainSubTab>('po_suppliers');
  const [selectedSite, setSelectedSite] = useState<FactorySiteId>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State holdings
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [suppliers, setSuppliers] = useState<SupplierScorecard[]>(mockSupplierScorecards);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems);
  const [shipments, setShipments] = useState<LogisticsShipment[]>(mockLogisticsShipments);
  const [obsolescenceItems, setObsolescenceItems] = useState<ObsolescenceItem[]>(mockObsolescenceItems);
  const [scenarios, setScenarios] = useState<ForecastScenario[]>(mockForecastScenarios);
  const [mrpItems, setMrpItems] = useState<MRPSummaryItem[]>(mockMRPSummaryItems);
  const [capacityCommitments, setCapacityCommitments] = useState<CapacityCommitment[]>(mockCapacityCommitments);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Quick summary counts
  const delayedPOCount = purchaseOrders.filter(p => p.status === 'delayed').length;
  const criticalInventoryCount = inventory.filter(i => i.stockStatus === 'critical_shortage' || i.stockStatus === 'stockout').length;
  const inTransitCount = shipments.filter(s => s.status !== 'Delivered').length;
  const eolItemsCount = obsolescenceItems.filter(o => o.lifecycleStatus === 'EOL' || o.lifecycleStatus === 'Discontinued').length;
  const mrpShortagesCount = mrpItems.filter(m => m.isShortage).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Supply Chain & Materials Visibility
                </h1>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  Global Control Tower
                </span>
              </div>
              <p className="text-xs text-slate-500">
                End-to-end purchase orders, supplier scorecards, global inventory bins, in-transit logistics, component obsolescence, and MRP forecast collaboration.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Facility Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Facility Filter */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-2xs">
            <Building2 className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">Facility:</span>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value as FactorySiteId)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Global (All 4 Sites)</option>
              <option value="austin">Austin Giga-1 (USA)</option>
              <option value="fremont">Fremont Mega-2 (USA)</option>
              <option value="guadalajara">Guadalajara Tech-3 (MX)</option>
              <option value="penang">Penang Plant-4 (MY)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live ERP</span>
          </button>
        </div>
      </div>

      {/* Role & Persona Visibility Indicator */}
      <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-2.5 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            Logged in as <strong>{currentUser.name}</strong> ({currentRole.name}) — Showing{' '}
            {currentRole.category === 'customer'
              ? 'Customer-dedicated material allocations, committed lead-times, and forecast MRP.'
              : 'Internal plant procurement, global warehouse bins, and tier-1 vendor contracts.'}
          </span>
        </div>
        <span className="rounded-full bg-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
          SAP & Oracle SCM Live Link
        </span>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs gap-1">
        <button
          onClick={() => setActiveTab('po_suppliers')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'po_suppliers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>PO & Supplier Tracking</span>
          {delayedPOCount > 0 && (
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${activeTab === 'po_suppliers' ? 'bg-white text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
              {delayedPOCount} delayed
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Inventory & Bin Drill-Down</span>
          {criticalInventoryCount > 0 && (
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${activeTab === 'inventory' ? 'bg-white text-blue-700' : 'bg-amber-100 text-amber-800'}`}>
              {criticalInventoryCount} alert
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'logistics'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Logistics & Customs Milestones</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${activeTab === 'logistics' ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
            {inTransitCount} in-transit
          </span>
        </button>

        <button
          onClick={() => setActiveTab('obsolescence')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'obsolescence'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Obsolescence & LTB Planning</span>
          {eolItemsCount > 0 && (
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${activeTab === 'obsolescence' ? 'bg-white text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
              {eolItemsCount} EOL
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('forecast_mrp')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'forecast_mrp'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Forecast Collaboration & MRP</span>
          {mrpShortagesCount > 0 && (
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${activeTab === 'forecast_mrp' ? 'bg-white text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
              {mrpShortagesCount} shortage
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content Rendering */}
      <div>
        {activeTab === 'po_suppliers' && (
          <POSupplierTrackingTab
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
            selectedSite={selectedSite}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryVisibilityTab
            inventory={inventory}
            selectedSite={selectedSite}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsTrackingTab
            shipments={shipments}
            selectedSite={selectedSite}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'obsolescence' && (
          <ObsolescenceLifecycleTab
            obsolescenceItems={obsolescenceItems}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'forecast_mrp' && (
          <ForecastMRPCollaborationTab
            scenarios={scenarios}
            mrpItems={mrpItems}
            capacityCommitments={capacityCommitments}
            selectedSite={selectedSite}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};
