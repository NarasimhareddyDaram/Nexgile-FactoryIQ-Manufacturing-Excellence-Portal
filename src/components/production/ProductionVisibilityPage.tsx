import React, { useState, useEffect } from 'react';
import {
  Factory,
  Building2,
  SlidersHorizontal,
  Eye,
  Shield,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Gauge,
  Scan,
  RefreshCw,
  Clock,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import {
  FactorySiteId,
  ProductionFacility,
  ProductionLine,
  Role,
  User
} from '../../types';
import {
  mockFacilities,
  mockProductionLines,
  mockShiftPerformance,
  mockInspectionResults,
  mockDefectPareto,
  mockDefectStations,
  mockLineCapacities,
  mockScheduledChangeovers,
  mockFacilityTransfers
} from '../../data/productionVisibilityData';
import { ProductionDashboardView } from './ProductionDashboardView';
import { QualityInLineView } from './QualityInLineView';
import { CapacityConstraintsView } from './CapacityConstraintsView';
import { CustomerViewSummary } from './CustomerViewSummary';
import { LineDetailModal } from './LineDetailModal';

interface ProductionVisibilityPageProps {
  currentRole: Role;
  currentUser: User;
}

export const ProductionVisibilityPage: React.FC<ProductionVisibilityPageProps> = ({
  currentRole,
  currentUser,
}) => {
  // Multi-site factory selector state
  const [selectedSite, setSelectedSite] = useState<FactorySiteId>('all');

  // Customer View vs Internal View Toggle
  // Default to customer view for customer roles, internal view for internal roles
  const [viewMode, setViewMode] = useState<'customer' | 'internal'>(() => {
    return currentRole.category === 'customer' ? 'customer' : 'internal';
  });

  // Internal sub-tab state
  const [internalTab, setInternalTab] = useState<'telemetry' | 'quality' | 'capacity'>('telemetry');

  // Selected line for drill-down modal
  const [selectedLine, setSelectedLine] = useState<ProductionLine | null>(null);

  // Live auto-refresh simulation state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  // Sync default view mode if user switches roles
  useEffect(() => {
    if (currentRole.category === 'customer') {
      setViewMode('customer');
    }
  }, [currentRole.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar with Multi-Site Selector & View Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Factory className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Production Visibility & Telemetry
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Edge Stream
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Shopfloor line assignment, work-in-progress (WIP), optical inspection, and plant capacity
            </p>
          </div>
        </div>

        {/* Global Controls: Multi-Site Dropdown + Customer/Internal Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Multi-Site Selector Dropdown */}
          <div className="relative">
            <label htmlFor="site-select" className="sr-only">Select Manufacturing Site</label>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
              <Building2 className="h-4 w-4 text-slate-500" />
              <select
                id="site-select"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value as FactorySiteId)}
                aria-label="Filter production lines by manufacturing facility"
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">All Facilities (Global Enterprise)</option>
                <option value="austin">Austin Giga-1 (Texas, USA)</option>
                <option value="fremont">Fremont Mega-2 (California, USA)</option>
                <option value="guadalajara">Guadalajara Tech-3 (Jalisco, Mexico)</option>
                <option value="penang">Penang Plant-4 (Bayan Lepas, Malaysia)</option>
              </select>
            </div>
          </div>

          {/* Customer View vs Internal View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('customer')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'customer'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Customer View</span>
            </button>

            <button
              onClick={() => setViewMode('internal')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'internal'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Internal View</span>
            </button>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh edge telemetry feeds"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">{lastRefreshedTime}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CUSTOMER VIEW (Executive Summary Cards & Benchmarks) */}
      {viewMode === 'customer' ? (
        <CustomerViewSummary
          facilities={mockFacilities}
          productionLines={mockProductionLines}
          selectedSite={selectedSite}
          currentRole={currentRole}
          currentUser={currentUser}
          onSelectLine={setSelectedLine}
        />
      ) : (
        /* VIEW 2: INTERNAL VIEW (Detailed Granular Modules) */
        <div className="space-y-6">
          {/* Internal View Module Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setInternalTab('telemetry')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                internalTab === 'telemetry'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Real-Time Dashboards & Lines</span>
            </button>

            <button
              onClick={() => setInternalTab('quality')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                internalTab === 'quality'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>Quality-In-Line & Defect Pareto</span>
            </button>

            <button
              onClick={() => setInternalTab('capacity')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                internalTab === 'capacity'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Gauge className="h-4 w-4" />
              <span>Capacity, Changeovers & Transfers</span>
            </button>
          </div>

          {/* Internal Tab 1: Real-Time Dashboards */}
          {internalTab === 'telemetry' && (
            <ProductionDashboardView
              facilities={mockFacilities}
              productionLines={mockProductionLines}
              shifts={mockShiftPerformance}
              selectedSite={selectedSite}
              currentRole={currentRole}
              currentUser={currentUser}
              onSelectLine={setSelectedLine}
            />
          )}

          {/* Internal Tab 2: Quality-In-Line & Defect Analytics */}
          {internalTab === 'quality' && (
            <QualityInLineView
              inspectionResults={mockInspectionResults}
              defectPareto={mockDefectPareto}
              defectStations={mockDefectStations}
              selectedSite={selectedSite}
              currentRole={currentRole}
              currentUser={currentUser}
            />
          )}

          {/* Internal Tab 3: Capacity, SMED Changeovers & Transfers */}
          {internalTab === 'capacity' && (
            <CapacityConstraintsView
              facilities={mockFacilities}
              lineCapacities={mockLineCapacities}
              changeovers={mockScheduledChangeovers}
              transfers={mockFacilityTransfers}
              selectedSite={selectedSite}
              currentRole={currentRole}
              currentUser={currentUser}
            />
          )}
        </div>
      )}

      {/* Drill-down Modal for Any Selected Line */}
      {selectedLine && (
        <LineDetailModal
          line={selectedLine}
          currentRole={currentRole}
          onClose={() => setSelectedLine(null)}
        />
      )}
    </div>
  );
};
