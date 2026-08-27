import React, { useState } from 'react';
import {
  GitMerge,
  AlertTriangle,
  Clock,
  Activity as ActivityIcon,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Eye,
  Edit3,
  Calendar,
  AlertCircle,
  FileCheck2,
  Building2,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Download
} from 'lucide-react';
import {
  Program,
  Role,
  User,
  StatusHistoryRecord,
  Issue,
  Approval,
  Activity,
  HealthStatus,
  ProgramStage
} from '../types';

interface HomeDashboardProps {
  programs: Program[];
  statusHistory: StatusHistoryRecord[];
  issues: Issue[];
  approvals: Approval[];
  activities: Activity[];
  currentRole: Role;
  currentUser: User;
  onSelectProgram: (program: Program) => void;
  onOpenNewProgram: () => void;
  onOpenStatusHistoryModal: (program?: Program) => void;
  onDecideApproval: (approvalId: string, decision: 'approved' | 'rejected') => void;
  onNavigateSection: (sectionId: any) => void;
  searchTerm: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  programs,
  statusHistory,
  issues,
  approvals,
  activities,
  currentRole,
  currentUser,
  onSelectProgram,
  onOpenNewProgram,
  onOpenStatusHistoryModal,
  onDecideApproval,
  onNavigateSection,
  searchTerm
}) => {
  const [healthFilter, setHealthFilter] = useState<'all' | HealthStatus>('all');
  const [stageFilter, setStageFilter] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const isInternal = currentRole.category === 'internal';

  // Filter programs
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHealth = healthFilter === 'all' || p.health === healthFilter;
    const matchesStage = stageFilter === 'all' || p.stage === stageFilter;

    return matchesSearch && matchesHealth && matchesStage;
  });

  // Calculate high-level KPIs
  const totalPrograms = programs.length;
  const greenCount = programs.filter((p) => p.health === 'green').length;
  const yellowCount = programs.filter((p) => p.health === 'yellow').length;
  const redCount = programs.filter((p) => p.health === 'red').length;

  const openIssues = issues.filter((i) => i.status !== 'resolved');
  const criticalIssues = openIssues.filter((i) => i.severity === 'critical');
  const highIssues = openIssues.filter((i) => i.severity === 'high');

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  const getHealthBadge = (health: HealthStatus) => {
    switch (health) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ON TRACK
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            AT RISK
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            CRITICAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Contextual Header matching Sleek Interface Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Overview Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {isInternal ? (
              <span>
                Internal Plant Operations Console — Full shopfloor yield, root causes & stage gates for <strong className="text-slate-700 font-semibold">{currentUser.name}</strong> ({currentRole.name})
              </span>
            ) : (
              <span>
                Customer Milestone Portal — Program schedules, delivery forecast & quality sign-offs for <strong className="text-slate-700 font-semibold">{currentUser.name}</strong> ({currentUser.company})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="quick-log-status-btn"
            onClick={() => onOpenStatusHistoryModal()}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Edit3 className="h-4 w-4 text-indigo-600" />
            Log Status Update
          </button>

          <button
            id="create-program-btn"
            onClick={onOpenNewProgram}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Program
          </button>
        </div>
      </div>

      {/* 4 Core Summary KPI Cards matching Sleek Interface Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Programs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Active Programs
          </div>
          <div className="text-3xl font-bold text-slate-800">{totalPrograms}</div>
          <div className="mt-2 text-xs font-medium flex items-center justify-between text-slate-500">
            <span className="text-emerald-600 font-semibold">{greenCount} On Track</span>
            <span className="text-amber-600 font-semibold">{yellowCount} At Risk</span>
            <span className="text-rose-600 font-semibold">{redCount} Critical</span>
          </div>
        </div>

        {/* Card 2: Open Issues & NCRs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Open Issues & NCRs
          </div>
          <div className="text-3xl font-bold text-rose-600">{openIssues.length}</div>
          <div className="mt-2 text-xs font-medium flex items-center justify-between">
            <span className="text-rose-600 font-semibold">{criticalIssues.length} Critical Action</span>
            <button
              onClick={() => onNavigateSection('quality')}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              QA Board <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Pending Approvals
          </div>
          <div className="text-3xl font-bold text-indigo-600">{pendingApprovals.length}</div>
          <div className="mt-2 text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>ECOs & Gate Sign-offs</span>
            <span className="font-bold text-indigo-700">Requires Review</span>
          </div>
        </div>

        {/* Card 4: Portfolio Yield */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Portfolio Yield Rate
          </div>
          <div className="text-3xl font-bold text-emerald-600">97.9%</div>
          <div className="mt-2 text-xs font-medium text-slate-500 flex items-center justify-between">
            <span className="text-emerald-600 font-semibold">+0.8% MoM Target</span>
            <span>OTD: 99.2%</span>
          </div>
        </div>
      </div>

      {/* Main Section: Programs Portfolio & Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Active Program Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live manufacturing telemetry, stage validation gates & build execution
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Health Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
              <span className="text-slate-400 px-1.5 font-medium">Health:</span>
              <button
                onClick={() => setHealthFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  healthFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({programs.length})
              </button>
              <button
                onClick={() => setHealthFilter('green')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  healthFilter === 'green' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Green ({greenCount})
              </button>
              <button
                onClick={() => setHealthFilter('yellow')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  healthFilter === 'yellow' ? 'bg-amber-500 text-white shadow-2xs' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Yellow ({yellowCount})
              </button>
              <button
                onClick={() => setHealthFilter('red')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  healthFilter === 'red' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Red ({redCount})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Programs Display */}
        {filteredPrograms.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No programs match the selected filters</p>
            <p className="text-xs text-slate-400 mt-1">Try changing health or search criteria</p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View matching Sleek Table styling */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
                  <th className="px-5 py-3">Program Code & Name</th>
                  <th className="px-5 py-3">Customer & Category</th>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3">Health Status</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">{isInternal ? 'Yield / Scrap %' : 'First-Pass Yield'}</th>
                  <th className="px-5 py-3">{isInternal ? 'Internal Notes & Root Cause' : 'Executive Customer Summary'}</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map((prog) => (
                  <tr
                    key={prog.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectProgram(prog)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {prog.code}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{prog.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{prog.customerName}</p>
                      <p className="text-[10px] text-slate-400">{prog.productCategory}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                        {prog.stage}
                      </span>
                    </td>

                    <td className="px-5 py-4">{getHealthBadge(prog.health)}</td>

                    <td className="px-5 py-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-700 mb-1">
                          <span>{prog.progressPercent}%</span>
                          <span className="text-slate-400">{prog.currentUnitsBuilt.toLocaleString()} u</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              prog.health === 'red'
                                ? 'bg-rose-500'
                                : prog.health === 'yellow'
                                ? 'bg-amber-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${prog.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{prog.currentYieldPercent}%</div>
                      {isInternal && (
                        <div className="text-[10px] text-slate-400">Scrap: {prog.internalScrapPercent}%</div>
                      )}
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                        {isInternal ? prog.internalNotes : prog.customerSummary}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectProgram(prog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenStatusHistoryModal(prog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Log Status Update"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                onClick={() => onSelectProgram(prog)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-indigo-600">{prog.code}</span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{prog.name}</h3>
                    </div>
                    {getHealthBadge(prog.health)}
                  </div>

                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {prog.customerName} • <span className="text-slate-400">{prog.facility}</span>
                  </p>

                  <div className="rounded-lg bg-white border border-slate-200 p-2.5 mb-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Current Stage:</span>
                      <span className="font-bold text-slate-800">{prog.stage}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{isInternal ? 'Yield / Scrap:' : 'Yield:'}</span>
                      <span className="font-bold text-slate-900">
                        {prog.currentYieldPercent}% {isInternal && `(${prog.internalScrapPercent}% scrap)`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Volume Built:</span>
                      <span className="font-semibold text-slate-700">
                        {prog.currentUnitsBuilt.toLocaleString()} / {prog.targetVolume.toLocaleString()} u
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold mb-1">
                        <span>Milestone Progress</span>
                        <span>{prog.progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${prog.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-white/60 p-2 rounded border border-slate-100">
                    <span className="font-semibold text-slate-700">{isInternal ? 'Internal: ' : 'Summary: '}</span>
                    {isInternal ? prog.internalNotes : prog.customerSummary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span>{prog.openIssuesCount} Issues</span>
                    <span>•</span>
                    <span>{prog.pendingApprovalsCount} Approvals</span>
                  </div>
                  <span className="font-semibold text-indigo-600 hover:underline flex items-center gap-0.5">
                    Inspect <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two-Column Lower Section: Pending Approvals & Recent Status History matching Sleek Theme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Pending Approvals Queue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Pending Approvals & Engineering Gates</h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
              {pendingApprovals.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingApprovals.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No pending approvals at this time</p>
            ) : (
              pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-200 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="inline-flex items-center rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 text-[10px] font-bold">
                        {app.approvalType}
                      </span>
                      <span className="ml-2 font-bold text-indigo-600 text-xs">{app.programCode}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Due: {app.deadline}</span>
                  </div>

                  <p className="font-semibold text-slate-900 mt-1">{app.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Requested by: <span className="font-medium text-slate-700">{app.requestedBy}</span> • Requires: <span className="font-medium text-slate-700">{app.requiredRole}</span>
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onDecideApproval(app.id, 'rejected')}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onDecideApproval(app.id, 'approved')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve & Sign
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Recent Activity / Status History Log */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ActivityIcon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Recent Status Changes & Audit History</h3>
            </div>
            <button
              onClick={() => onOpenStatusHistoryModal()}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Full Log <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {statusHistory.slice(0, 5).map((sh) => (
              <div
                key={sh.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-indigo-600">{sh.programName}</span>
                    <span className="inline-flex items-center rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-700">
                      {sh.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(sh.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 my-1">
                  {sh.oldStatus && (
                    <>
                      <span className="text-slate-400 line-through">{sh.oldStatus}</span>
                      <span>→</span>
                    </>
                  )}
                  <span className="text-emerald-700 font-bold">{sh.newStatus}</span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{sh.reason}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Logged by: {sh.changedByName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
