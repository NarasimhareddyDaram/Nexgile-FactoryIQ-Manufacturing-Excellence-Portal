import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ClipboardList,
  AlertOctagon,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Building2,
  Plus,
  Search,
  ArrowUpRight,
  Shield,
  FileCheck2,
  Filter,
  CheckSquare,
  Wrench,
  Gauge
} from 'lucide-react';
import {
  QualityAuditSchedule,
  AuditFinding,
  CalibrationGageRecord,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';
import { AuditChecklistModal } from './AuditChecklistModal';

interface AuditManagementTabProps {
  auditSchedules: QualityAuditSchedule[];
  auditFindings: AuditFinding[];
  calibrationRecords: CalibrationGageRecord[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const AuditManagementTab: React.FC<AuditManagementTabProps> = ({
  auditSchedules,
  auditFindings,
  calibrationRecords,
  selectedSite,
  currentRole,
  currentUser,
}) => {
  const [activeSection, setActiveSection] = useState<'audits' | 'findings' | 'calibration'>('audits');
  const [selectedAuditForChecklist, setSelectedAuditForChecklist] = useState<QualityAuditSchedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter lists by selected facility
  const filteredAudits = useMemo(() => {
    return auditSchedules.filter((a) => {
      if (selectedSite === 'all') return true;
      if (selectedSite === 'austin' && a.facility.includes('Austin')) return true;
      if (selectedSite === 'fremont' && a.facility.includes('Fremont')) return true;
      if (selectedSite === 'guadalajara' && a.facility.includes('Guadalajara')) return true;
      if (selectedSite === 'penang' && a.facility.includes('Penang')) return true;
      return true;
    });
  }, [auditSchedules, selectedSite]);

  const filteredCalibration = useMemo(() => {
    return calibrationRecords.filter((c) => {
      if (selectedSite === 'all') return true;
      if (selectedSite === 'austin' && c.facility.includes('Austin')) return true;
      if (selectedSite === 'fremont' && c.facility.includes('Fremont')) return true;
      if (selectedSite === 'guadalajara' && c.facility.includes('Guadalajara')) return true;
      if (selectedSite === 'penang' && c.facility.includes('Penang')) return true;
      return true;
    });
  }, [calibrationRecords, selectedSite]);

  // Findings Severity badge
  const getFindingSeverityBadge = (severity: AuditFinding['severity']) => {
    switch (severity) {
      case 'Major NC':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Minor NC':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'OFI':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Gage R&R badge
  const getGrrBadge = (grr: number) => {
    if (grr <= 10) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          {grr}% (Acceptable &lt;10%)
        </span>
      );
    }
    if (grr <= 30) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
          <AlertTriangle className="h-3 w-3 text-amber-600" />
          {grr}% (Marginal 10-30%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
        {grr}% (Unacceptable &gt;30%)
      </span>
    );
  };

  const getCalibStatusBadge = (status: CalibrationGageRecord['status']) => {
    switch (status) {
      case 'Calibrated':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Calibrated
          </span>
        );
      case 'Due Soon':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3" /> Due Soon (&lt;30d)
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
            Overdue
          </span>
        );
      case 'Out of Service':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-300">
            Out of Service
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Audit Schedules, Corrective Action Findings & Calibration Metrology
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              ISO / IATF / VDA 6.3
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global internal & registrar audit logs, clause checklist evaluator, finding closure tracking, and Gage R&R registers
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setActiveSection('audits')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSection === 'audits'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Audits ({filteredAudits.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('findings')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSection === 'findings'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Findings ({auditFindings.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('calibration')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSection === 'calibration'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Gauge className="h-3.5 w-3.5" />
            <span>Gage R&R ({filteredCalibration.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AUDIT SCHEDULES & LIVE CHECKLISTS */}
      {activeSection === 'audits' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredAudits.map((audit) => (
              <div
                key={audit.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {audit.id}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                        {audit.standard}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        {audit.auditType}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {audit.auditTitle}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium">
                      Scope: {audit.scopeSummary}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{audit.facility}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Scheduled: {audit.scheduledDate} ({audit.durationDays} Days)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Auditor: <strong className="text-slate-700">{audit.leadAuditor}</strong> ({audit.auditingBody})</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Scorecard & Checklist Action */}
                  <div className="lg:w-64 shrink-0 space-y-3 lg:border-l lg:border-slate-100 lg:pl-5">
                    {audit.overallScore !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700">Compliance Score</span>
                          <span className="font-bold text-emerald-600">{audit.overallScore}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${audit.overallScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedAuditForChecklist(audit)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        <span>Open Audit Checklist ({audit.checklists.length})</span>
                      </button>

                      <div className="flex justify-between text-[11px] text-slate-400 px-1">
                        <span>Findings: {audit.findingsSummary.major} Major, {audit.findingsSummary.minor} Minor</span>
                        <span className="font-semibold text-slate-700 capitalize">{audit.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: AUDIT FINDINGS & CORRECTIVE ACTIONS */}
      {activeSection === 'findings' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Audit Findings & Non-Conformance Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed finding descriptions, standard clauses, corrective action assignments, and closure status
              </p>
            </div>

            <button
              onClick={() => {
                alert('Exporting audit findings log as corrective action matrix.');
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Export Finding Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Finding ID & Severity</th>
                  <th className="px-4 py-3.5">Clause Reference</th>
                  <th className="px-4 py-3.5">Finding Description</th>
                  <th className="px-4 py-3.5">Assignee & Due Date</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditFindings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 align-top whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-slate-900 block">
                          {finding.code}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${getFindingSeverityBadge(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">
                          {finding.title}
                        </span>
                        <span className="font-mono text-[11px] text-blue-600">
                          {finding.clause}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top max-w-xs">
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {finding.description}
                      </p>
                      {finding.linkedCapaId && (
                        <span className="inline-block mt-1 font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                          Linked CAPA: {finding.linkedCapaId}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="font-medium text-slate-800 block">{finding.assignedOwner}</span>
                        <span className="text-slate-400">Due: <strong className="text-slate-700">{finding.targetDueDate}</strong></span>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        finding.status === 'Closed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : finding.status === 'CAPA Assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {finding.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: CALIBRATION & GAGE R&R METROLOGY */}
      {activeSection === 'calibration' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Equipment Metrology, NIST Traceability & Gage R&R Register
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Metrology repeatability & reproducibility (%GRR), calibration cycles, and certificates
              </p>
            </div>

            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              100% Traceable to NIST / ISO 17025
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Asset & Tool Name</th>
                  <th className="px-4 py-3.5">Facility & Location</th>
                  <th className="px-4 py-3.5">Gage R&R Study (%GRR)</th>
                  <th className="px-4 py-3.5">Calibration Dates</th>
                  <th className="px-4 py-3.5">NIST Standard / Cert</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCalibration.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 align-top whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <Wrench className="h-3.5 w-3.5 text-slate-400" />
                          <span>{tool.equipmentName}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 pl-5">
                          Tag: {tool.assetTag} • {tool.type}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="font-medium text-slate-800">{tool.facility}</span>
                        <p className="text-slate-400">{tool.locationBay}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-1">
                        <div>{getGrrBadge(tool.grrPercent)}</div>
                        <p className="text-[10px] text-slate-400">{tool.grrRating}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="text-slate-400">Last: {tool.lastCalDate}</span>
                        <p className="font-semibold text-slate-800">
                          Next Due: <strong className={tool.status === 'Due Soon' ? 'text-amber-700' : 'text-slate-900'}>{tool.nextCalDue}</strong>
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap text-[11px]">
                      <span className="font-mono text-slate-700 block">{tool.certificateRef}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-xs block">{tool.standardRef}</span>
                    </td>

                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      {getCalibStatusBadge(tool.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clause Checklist Modal */}
      {selectedAuditForChecklist && (
        <AuditChecklistModal
          audit={selectedAuditForChecklist}
          onClose={() => setSelectedAuditForChecklist(null)}
        />
      )}
    </div>
  );
};
