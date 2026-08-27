import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  AlertOctagon,
  Activity,
  ClipboardList,
  Building2,
  Download,
  Filter,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import {
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';
import {
  complianceDocuments,
  renewalTasks,
  auditBundles,
  ncrCapaRecords,
  spcParameterSeries,
  yieldTrendData,
  escapedDefectMetrics,
  auditSchedules,
  auditFindings,
  calibrationRecords
} from '../../data/qualityComplianceData';
import { CertificationsLibraryTab } from './CertificationsLibraryTab';
import { ExpiryRenewalTrackingTab } from './ExpiryRenewalTrackingTab';
import { NCRCAPAWorkflowTab } from './NCRCAPAWorkflowTab';
import { SPCQualityAnalyticsTab } from './SPCQualityAnalyticsTab';
import { AuditManagementTab } from './AuditManagementTab';

interface QualityManagementPageProps {
  currentRole: Role;
  currentUser: UserType;
}

export const QualityManagementPage: React.FC<QualityManagementPageProps> = ({
  currentRole,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'certs' | 'renewals' | 'ncr_capa' | 'spc_analytics' | 'audits'>('certs');
  const [selectedSite, setSelectedSite] = useState<FactorySiteId>('all');

  const sites: { id: FactorySiteId; name: string }[] = [
    { id: 'all', name: 'All Manufacturing Facilities' },
    { id: 'austin', name: 'Austin Giga-1 (Texas, USA)' },
    { id: 'fremont', name: 'Fremont Mega-2 (California, USA)' },
    { id: 'guadalajara', name: 'Guadalajara Tech-3 (Mexico)' },
    { id: 'penang', name: 'Penang Plant-4 (Malaysia)' }
  ];

  const activeExpiringCount = renewalTasks.filter(t => t.daysRemaining <= 90).length;
  const activeCapaCount = ncrCapaRecords.filter(r => r.status !== 'Closed').length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Quality Management & Compliance Excellence
              </h1>
              <p className="text-xs text-slate-500">
                Global compliance registry, 8D CAPA resolution engine, live SPC metrology, and registrar audit schedules
              </p>
            </div>
          </div>
        </div>

        {/* Top Controls: Site Selector & Quick Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Facility Filter */}
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value as FactorySiteId)}
              aria-label="Filter compliance records by manufacturing facility"
              className="appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => {
              alert('Generating executive Quality & Compliance Dossier for all sites in PDF / ZIP format.');
            }}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Executive Quality Dossier</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        <nav className="flex flex-wrap gap-1">
          {/* TAB 1: CERTIFICATIONS */}
          <button
            onClick={() => setActiveTab('certs')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'certs'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Certifications & Standards</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === 'certs' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {complianceDocuments.length}
            </span>
          </button>

          {/* TAB 2: EXPIRY & RENEWALS */}
          <button
            onClick={() => setActiveTab('renewals')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'renewals'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Expiry & Renewal Tracking</span>
            {activeExpiringCount > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === 'renewals' ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
              }`}>
                {activeExpiringCount} Due
              </span>
            )}
          </button>

          {/* TAB 3: NCR & 8D CAPA */}
          <button
            onClick={() => setActiveTab('ncr_capa')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'ncr_capa'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="h-4 w-4" />
            <span>NCR / CAPA (8D Workflows)</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === 'ncr_capa' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
            }`}>
              {activeCapaCount} Active
            </span>
          </button>

          {/* TAB 4: SPC & QUALITY ANALYTICS */}
          <button
            onClick={() => setActiveTab('spc_analytics')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'spc_analytics'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>SPC & Metrology Analytics</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === 'spc_analytics' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Cpk 1.84
            </span>
          </button>

          {/* TAB 5: AUDIT MANAGEMENT & CALIBRATION */}
          <button
            onClick={() => setActiveTab('audits')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'audits'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Audit Management & Calibration</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === 'audits' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {auditSchedules.length} Scheduled
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'certs' && (
        <CertificationsLibraryTab
          documents={complianceDocuments}
          selectedSite={selectedSite}
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'renewals' && (
        <ExpiryRenewalTrackingTab
          renewalTasks={renewalTasks}
          auditBundles={auditBundles}
          selectedSite={selectedSite}
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'ncr_capa' && (
        <NCRCAPAWorkflowTab
          records={ncrCapaRecords}
          selectedSite={selectedSite}
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'spc_analytics' && (
        <SPCQualityAnalyticsTab
          spcSeries={spcParameterSeries}
          yieldTrends={yieldTrendData}
          escapedDefects={escapedDefectMetrics}
          selectedSite={selectedSite}
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}

      {activeTab === 'audits' && (
        <AuditManagementTab
          auditSchedules={auditSchedules}
          auditFindings={auditFindings}
          calibrationRecords={calibrationRecords}
          selectedSite={selectedSite}
          currentRole={currentRole}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
