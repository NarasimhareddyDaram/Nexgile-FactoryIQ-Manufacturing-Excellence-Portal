import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Download,
  PackageCheck,
  User,
  Building2,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Archive,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import {
  RenewalTask,
  AuditBundle,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';

interface ExpiryRenewalTrackingTabProps {
  renewalTasks: RenewalTask[];
  auditBundles: AuditBundle[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const ExpiryRenewalTrackingTab: React.FC<ExpiryRenewalTrackingTabProps> = ({
  renewalTasks,
  auditBundles,
  selectedSite,
  currentRole,
  currentUser,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [downloadingBundleId, setDownloadingBundleId] = useState<string | null>(null);

  // Filter tasks by site if specified
  const filteredTasks = useMemo(() => {
    return renewalTasks.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [renewalTasks]);

  const handleDownloadBundle = (bundle: AuditBundle) => {
    setDownloadingBundleId(bundle.id);
    setTimeout(() => {
      setDownloadingBundleId(null);
      alert(`Successfully generated and downloaded audit-ready bundle package:\n\n"${bundle.name}" (${bundle.packageSize})\nIncludes ${bundle.includedDocsCount} compliance files and full audit evidence.`);
    }, 900);
  };

  const getAlertBadge = (level: RenewalTask['alertLevel'], days: number) => {
    if (level === 'critical' || days <= 30) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
          Critical: {days} Days Left
        </span>
      );
    }
    if (level === 'warning' || days <= 90) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          Warning: {days} Days Left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
        <Clock className="h-3.5 w-3.5 text-blue-600" />
        {days} Days Remaining
      </span>
    );
  };

  const getStageBadge = (stage: RenewalTask['stage']) => {
    switch (stage) {
      case 'Gap Analysis':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Internal Pre-Audit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Registrar Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Corrective Actions':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Recertification Issued':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Certificate Expiry, Recertification Tracking & Audit Bundles
            </h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              {filteredTasks.filter(t => t.daysRemaining <= 90).length} Actionable Expiries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated countdown alerts, pre-audit milestone stages, registrar schedules, and one-click audit bundles
          </p>
        </div>

        {/* View Toggle (List vs Calendar) */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === 'calendar'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Audit Calendar</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: UPCOMING EXPIRY / RENEWAL TASKS (List or Calendar) */}
      {viewMode === 'list' ? (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Recertification Tasks & Milestone Progress
            </h3>
            <span className="text-xs text-slate-400">
              Sorted by urgency (shortest days remaining)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-2xl border bg-white p-5 shadow-2xs transition hover:border-slate-300 ${
                  task.alertLevel === 'critical'
                    ? 'border-rose-200 bg-linear-to-r from-rose-50/20 to-white'
                    : task.alertLevel === 'warning'
                    ? 'border-amber-200 bg-linear-to-r from-amber-50/20 to-white'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {getAlertBadge(task.alertLevel, task.daysRemaining)}
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                        {task.standard}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${getStageBadge(task.stage)}`}>
                        Stage: {task.stage}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {task.certTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{task.facility}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>Target Audit Date: <strong className="text-slate-700">{task.targetAuditDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Lead: <strong className="text-slate-700">{task.assignedLead}</strong></span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 font-medium">
                      {task.notes}
                    </p>
                  </div>

                  {/* Right Progress & Action */}
                  <div className="lg:w-72 shrink-0 space-y-3 lg:border-l lg:border-slate-100 lg:pl-5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Pre-Audit Readiness</span>
                        <span className="font-bold text-blue-600">{task.progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            task.progressPercent >= 80
                              ? 'bg-emerald-500'
                              : task.progressPercent >= 50
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${task.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Checklists closed</span>
                        <span>{task.checklistCount.completed} / {task.checklistCount.total} items</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          alert(`Opening renewal workflow for ${task.standard} (${task.certTitle}). Assigned to ${task.assignedLead}.`);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
                      >
                        <span>Manage Task</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* CALENDAR VIEW */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Global Quality & Surveillance Audit Schedule (2026 - 2027)
                </h3>
                <p className="text-xs text-slate-500">
                  Registrar surveillance, recertifications, and pre-audit readiness windows
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                Q3 / Q4 2026 Schedule
              </span>
            </div>
          </div>

          {/* Month Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Month 1: September 2026 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-xs text-slate-900">September 2026</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  2 Audits Scheduled
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg border border-rose-200 bg-white p-3 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-700">Sept 08 - 10</span>
                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">
                      LRQA
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-800">ISO 9001:2015 Recertification</p>
                  <p className="text-[11px] text-slate-500">Guadalajara Tech-3 (Mexico)</p>
                  <p className="text-[10px] text-slate-400">Lead: Ing. Mateo Alvarez</p>
                </div>

                <div className="rounded-lg border border-amber-200 bg-white p-3 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-700">Sept 22 - 24</span>
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      BSI Group
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-800">ISO 13485:2016 Medical Surveillance</p>
                  <p className="text-[11px] text-slate-500">Fremont Mega-2 Cleanroom</p>
                  <p className="text-[10px] text-slate-400">Lead: Sarah Lin, CQE</p>
                </div>
              </div>
            </div>

            {/* Month 2: October 2026 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-xs text-slate-900">October 2026</span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  1 Audit Scheduled
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg border border-blue-200 bg-white p-3 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-700">Oct 14 - 17</span>
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                      PRI Nadcap
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-800">NADCAP AC7119 Electronics</p>
                  <p className="text-[11px] text-slate-500">Penang Plant-4 (Malaysia)</p>
                  <p className="text-[10px] text-slate-400">Lead: Chai Hock Boon</p>
                </div>
              </div>
            </div>

            {/* Month 3: November / December 2026 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-xs text-slate-900">Nov - Dec 2026</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Annual Filings
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="rounded-lg border border-emerald-200 bg-white p-3 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-700">Nov 15</span>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                      US FDA CDRH
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-800">FDA 21 CFR 820 Annual Registration</p>
                  <p className="text-[11px] text-slate-500">Fremont Facility (DHF / DMR)</p>
                  <p className="text-[10px] text-slate-400">Lead: Sarah Lin, CQE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AUDIT-READY DOCUMENT BUNDLES GENERATOR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
              <PackageCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Downloadable Audit-Ready Document Bundles
                </h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  Registrar Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-packaged zip archives containing standard certificates, Quality Manuals, pFMEAs, MSA studies, and calibration registers
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
            Automated packaging service
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auditBundles.map((bundle) => (
            <div
              key={bundle.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 hover:bg-slate-50 hover:border-slate-300 transition group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {bundle.standard}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-blue-600 transition">
                      {bundle.name}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {bundle.packageSize}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {bundle.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Included Documents ({bundle.includedDocsCount} files):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bundle.docTypes.map((dtype, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
                      >
                        <FileCheck2 className="h-3 w-3 text-emerald-600" />
                        {dtype}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400">
                  Updated: <strong className="text-slate-600">{bundle.lastUpdated}</strong>
                </span>

                <button
                  onClick={() => handleDownloadBundle(bundle)}
                  disabled={downloadingBundleId === bundle.id}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-2xs disabled:opacity-50"
                >
                  {downloadingBundleId === bundle.id ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Packaging ZIP...</span>
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5" />
                      <span>Download Bundle ZIP</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
