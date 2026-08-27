import React, { useState } from 'react';
import {
  Wrench,
  RotateCcw,
  ShieldCheck,
  Boxes,
  Clock,
  CheckCircle2,
  Building,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { Role, User } from '../../types';
import { RMAIntakeTab } from './RMAIntakeTab';
import { RepairVisibilityTab } from './RepairVisibilityTab';
import { WarrantyHandlingTab } from './WarrantyHandlingTab';
import { SparePartsTab } from './SparePartsTab';
import { EOLSupportTab } from './EOLSupportTab';

interface AfterSalesPageProps {
  currentRole: Role | null;
  currentUser: User | null;
}

type AfterSalesTabId = 'rma-intake' | 'repair-visibility' | 'warranty-handling' | 'spare-parts' | 'eol-support';

interface TabConfig {
  id: AfterSalesTabId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string;
}

const TABS: TabConfig[] = [
  {
    id: 'rma-intake',
    label: 'RMA Intake & Triage',
    shortLabel: 'RMA Intake',
    icon: RotateCcw,
    badge: '5 Active'
  },
  {
    id: 'repair-visibility',
    label: 'Repair Execution & Diagnostics',
    shortLabel: 'Repair Bay',
    icon: Wrench,
    badge: '3 Jobs'
  },
  {
    id: 'warranty-handling',
    label: 'Warranty Coverage & Claims',
    shortLabel: 'Warranty & Claims',
    icon: ShieldCheck,
    badge: 'Coverage'
  },
  {
    id: 'spare-parts',
    label: 'Spare Parts & Cross-Reference',
    shortLabel: 'Spare Parts',
    icon: Boxes,
    badge: '8 SKUs'
  },
  {
    id: 'eol-support',
    label: 'EOL & Obsolescence Programs',
    shortLabel: 'EOL & LTB',
    icon: Clock,
    badge: '2 PCNs'
  }
];

export function AfterSalesPage({ currentRole, currentUser }: AfterSalesPageProps) {
  const [activeTab, setActiveTab] = useState<AfterSalesTabId>('rma-intake');
  const [selectedRMANumber, setSelectedRMANumber] = useState<string | null>(null);

  const handleNavigateToRepair = (rmaNumber: string) => {
    setSelectedRMANumber(rmaNumber);
    setActiveTab('repair-visibility');
  };

  const handleInitiateRMAFromWarranty = (serialNumber: string) => {
    setActiveTab('rma-intake');
  };

  return (
    <div id="after-sales-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  After-Sales Service & Reverse Logistics Depot
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  End-to-end RMA intake, depot rework telemetry, warranty claim verification, fast-track spares & EOL lifetime support
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Depot Hubs: Austin (HQ) • Guadalajara • Penang</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 overflow-x-auto pb-px">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'repair-visibility') {
                    setSelectedRMANumber(null);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Render */}
      <div className="transition-all duration-200">
        {activeTab === 'rma-intake' && (
          <RMAIntakeTab
            currentRole={currentRole}
            currentUser={currentUser}
            onNavigateToRepair={handleNavigateToRepair}
          />
        )}

        {activeTab === 'repair-visibility' && (
          <RepairVisibilityTab
            currentRole={currentRole}
            currentUser={currentUser}
            selectedRMANumber={selectedRMANumber}
          />
        )}

        {activeTab === 'warranty-handling' && (
          <WarrantyHandlingTab
            currentRole={currentRole}
            currentUser={currentUser}
            onInitiateRMA={handleInitiateRMAFromWarranty}
          />
        )}

        {activeTab === 'spare-parts' && (
          <SparePartsTab
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'eol-support' && (
          <EOLSupportTab
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}
