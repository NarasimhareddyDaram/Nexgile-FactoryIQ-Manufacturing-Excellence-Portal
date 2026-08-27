import React, { useState } from 'react';
import {
  X,
  GitMerge,
  Calendar,
  Layers,
  Cpu,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Program, Role, User, StatusHistoryRecord, Issue, Approval, HealthStatus } from '../types';

interface ProgramDetailDrawerProps {
  program: Program;
  currentRole: Role;
  currentUser: User;
  statusHistory: StatusHistoryRecord[];
  issues: Issue[];
  approvals: Approval[];
  onClose: () => void;
  onOpenStatusUpdate: (program: Program) => void;
}

export const ProgramDetailDrawer: React.FC<ProgramDetailDrawerProps> = ({
  program,
  currentRole,
  currentUser,
  statusHistory,
  issues,
  approvals,
  onClose,
  onOpenStatusUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'history' | 'issues'>('overview');

  const isInternal = currentRole.category === 'internal';

  const programHistory = statusHistory.filter((sh) => sh.programId === program.id);
  const programIssues = issues.filter((i) => i.programId === program.id);
  const programApprovals = approvals.filter((a) => a.programId === program.id);

  const getHealthBadge = (health: HealthStatus) => {
    switch (health) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Green (On Track)
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Yellow (At Risk)
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            Red (Critical)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {program.code}
              </span>
              {getHealthBadge(program.health)}
              <span className="inline-flex items-center rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {program.stage}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 leading-snug">
              {program.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer: <span className="font-semibold text-slate-700">{program.customerName}</span> • Facility: <span className="font-semibold text-slate-700">{program.facility}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'milestones'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Milestones ({program.keyMilestones.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Status History ({programHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'issues'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Issues ({programIssues.length})
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Yield Rate</span>
                  <p className="text-base font-bold text-slate-800 mt-1">{program.currentYieldPercent}%</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Built</span>
                  <p className="text-base font-bold text-slate-800 mt-1">
                    {program.currentUnitsBuilt.toLocaleString()} u
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Target Volume</span>
                  <p className="text-base font-bold text-slate-800 mt-1">
                    {program.targetVolume.toLocaleString()} u
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Launch Target</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">{program.targetLaunchDate}</p>
                </div>
              </div>

              {/* Customer Executive Summary Section */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Executive Customer Summary
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">Customer-Facing</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{program.customerSummary}</p>
              </div>

              {/* Internal Engineering Notes */}
              <div
                className={`rounded-xl border p-4 transition-all shadow-2xs ${
                  isInternal
                    ? 'border-indigo-300 bg-indigo-50/50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                    Internal Engineering & Shopfloor Notes
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    Internal Ops Only
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-mono text-[11px]">
                  {program.internalNotes}
                </p>
                {isInternal && (
                  <div className="mt-3 pt-2 border-t border-indigo-200/70 flex items-center justify-between text-[11px] text-indigo-800">
                    <span>Internal Scrap: <strong>{program.internalScrapPercent}%</strong></span>
                    <span>Facility: <strong>{program.facility}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenStatusUpdate(program)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  Log Status Change / Update Health
                </button>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-3">
              {program.keyMilestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-800 text-xs">{m.title}</span>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'delayed'
                          ? 'bg-rose-100 text-rose-800'
                          : m.status === 'at_risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span>Target Due Date: {m.dueDate}</span>
                    <span className="font-semibold text-slate-700">{m.completionPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${m.completionPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {programHistory.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No status history records for this program yet.</p>
              ) : (
                programHistory.map((sh) => (
                  <div
                    key={sh.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold uppercase text-indigo-600">{sh.category} Update</span>
                      <span className="text-slate-400">{new Date(sh.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      {sh.oldStatus && <span className="text-slate-400 line-through">{sh.oldStatus}</span>}
                      <span>→</span>
                      <span className="text-emerald-700">{sh.newStatus}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{sh.reason}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Logged by: {sh.changedByName}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-3">
              {programIssues.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No open issues for this program.</p>
              ) : (
                programIssues.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          iss.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : iss.severity === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {iss.severity} Severity
                      </span>
                      <span className="text-[10px] text-slate-400">{iss.category}</span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs">{iss.title}</p>
                    <p className="text-[11px] text-slate-600">{iss.customerSummary}</p>
                    {isInternal && (
                      <div className="mt-2 p-2 rounded bg-indigo-50/60 border border-indigo-100 text-[10px] text-indigo-900">
                        <span className="font-bold">Root Cause: </span>
                        {iss.internalRootCause}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
