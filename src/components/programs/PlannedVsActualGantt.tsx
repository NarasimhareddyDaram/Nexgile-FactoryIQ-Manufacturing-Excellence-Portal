import React, { useState, useMemo } from 'react';
import { GanttTask, Program } from '../../types';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  GitCommit,
  Layers,
  Link2,
  Milestone as MilestoneIcon,
  ShieldAlert,
  Sparkles,
  User,
  Info,
  ArrowRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface PlannedVsActualGanttProps {
  tasks: GanttTask[];
  programs: Program[];
  selectedProgramId?: string;
  onSelectProgram?: (programId: string) => void;
}

export function PlannedVsActualGantt({
  tasks,
  programs,
  selectedProgramId,
  onSelectProgram
}: PlannedVsActualGanttProps) {
  const [filterProgramId, setFilterProgramId] = useState<string>(selectedProgramId || 'all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);

  // Time window bounds for timeline (Jan 2026 to Dec 2026)
  const timelineStart = new Date('2026-01-01').getTime();
  const timelineEnd = new Date('2026-12-31').getTime();
  const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24);

  // Months for header timeline
  const months = [
    { label: 'Jan 26', startPct: 0, widthPct: 8.5 },
    { label: 'Feb 26', startPct: 8.5, widthPct: 7.7 },
    { label: 'Mar 26', startPct: 16.2, widthPct: 8.5 },
    { label: 'Apr 26', startPct: 24.7, widthPct: 8.2 },
    { label: 'May 26', startPct: 32.9, widthPct: 8.5 },
    { label: 'Jun 26', startPct: 41.4, widthPct: 8.2 },
    { label: 'Jul 26', startPct: 49.6, widthPct: 8.5 },
    { label: 'Aug 26', startPct: 58.1, widthPct: 8.5 },
    { label: 'Sep 26', startPct: 66.6, widthPct: 8.2 },
    { label: 'Oct 26', startPct: 74.8, widthPct: 8.5 },
    { label: 'Nov 26', startPct: 83.3, widthPct: 8.2 },
    { label: 'Dec 26', startPct: 91.5, widthPct: 8.5 }
  ];

  // Today marker (Aug 27, 2026)
  const todayTime = new Date('2026-08-27').getTime();
  const todayPct = Math.max(
    0,
    Math.min(100, ((todayTime - timelineStart) / (timelineEnd - timelineStart)) * 100)
  );

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchProg = filterProgramId === 'all' || t.programId === filterProgramId;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'delayed' ? t.isDelayed : t.status === filterStatus);
      const matchCrit = !showCriticalOnly || t.criticalPath;
      return matchProg && matchStatus && matchCrit;
    });
  }, [tasks, filterProgramId, filterStatus, showCriticalOnly]);

  const delayedTasksCount = tasks.filter(t => t.isDelayed).length;

  const calculatePct = (dateStr: string) => {
    const t = new Date(dateStr).getTime();
    return Math.max(0, Math.min(100, ((t - timelineStart) / (timelineEnd - timelineStart)) * 100));
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Alert if any delayed tasks */}
      {delayedTasksCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  {delayedTasksCount} Manufacturing Milestones Flagged with Schedule Variance
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                  Engineering delay reasons, root causes, and corrective action mitigation plans have been logged. Click on any flagged task bar to inspect variance telemetry.
                </p>
              </div>
            </div>
            <button
              onClick={() => setFilterStatus(filterStatus === 'delayed' ? 'all' : 'delayed')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              {filterStatus === 'delayed' ? 'Show All Tasks' : 'Filter Delayed Only'}
            </button>
          </div>
        </div>
      )}

      {/* Control / Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Program Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Program:</span>
              <select
                value={filterProgramId}
                onChange={(e) => setFilterProgramId(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="all">All Programs ({programs.length})</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="delayed">Delayed (Flags)</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Critical Path Toggle */}
            <button
              onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                showCriticalOnly
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Flame className={`h-3.5 w-3.5 ${showCriticalOnly ? 'text-indigo-600' : 'text-slate-400'}`} />
              Critical Path Only
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-5 rounded-xs bg-slate-300" />
              <span>Planned Schedule</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-5 rounded-xs bg-indigo-600" />
              <span>Actual Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-5 rounded-xs bg-rose-500" />
              <span>Delayed Milestones</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-3 bg-red-500" />
              <span className="font-semibold text-red-600">Today Marker</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gantt Timeline Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Timeline Header Row (Months) */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 sticky top-0 z-10">
              <div className="w-72 p-3 border-r border-slate-200 shrink-0 font-bold text-slate-700">
                Milestone & Work Package
              </div>
              <div className="w-40 p-3 border-r border-slate-200 shrink-0 font-bold text-slate-700">
                Owner & Dates
              </div>
              <div className="flex-1 relative flex">
                {months.map((m, idx) => (
                  <div
                    key={idx}
                    className="border-r border-slate-200 p-2 text-center text-[11px] font-bold text-slate-500"
                    style={{ width: `${m.widthPct}%` }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Rows */}
            <div className="divide-y divide-slate-100 relative">
              {/* Today Vertical Guide Line */}
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
                style={{ left: `calc(288px + 160px + ${todayPct}% * (100% - 448px) / 100)` }}
              >
                <div className="bg-red-500 text-white text-[9px] font-bold px-1 rounded-xs -mt-1 shadow-xs">
                  Aug 27 (Today)
                </div>
                <div className="w-0.5 flex-1 bg-red-400/70 border-r border-dashed border-red-500" />
              </div>

              {filteredTasks.map((task) => {
                const planStartPct = calculatePct(task.plannedStartDate);
                const planEndPct = calculatePct(task.plannedEndDate);
                const planWidthPct = Math.max(1.5, planEndPct - planStartPct);

                // Actual bar position
                const actualEndStr = task.actualEndDate || (task.status === 'in_progress' ? '2026-08-27' : task.plannedEndDate);
                const actualEndPct = calculatePct(actualEndStr);
                const actualWidthPct = Math.max(1.5, actualEndPct - planStartPct);

                const isSelected = selectedTask?.id === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`flex items-center hover:bg-slate-50/80 transition-colors cursor-pointer text-xs ${
                      isSelected ? 'bg-indigo-50/60' : ''
                    }`}
                  >
                    {/* Column 1: Task Title & Phase */}
                    <div className="w-72 p-3 border-r border-slate-100 shrink-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {task.programCode}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {task.phase}
                        </span>
                        {task.criticalPath && (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1 rounded">
                            CP
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                        {task.title}
                      </p>
                      {task.dependsOn && task.dependsOn.length > 0 && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Link2 className="h-3 w-3 text-slate-400" />
                          <span>Depends on: {task.dependsOn.join(', ')}</span>
                        </p>
                      )}
                    </div>

                    {/* Column 2: Owner & Planned Dates */}
                    <div className="w-40 p-3 border-r border-slate-100 shrink-0 text-slate-600 text-[11px] space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-700 font-medium truncate">
                        <User className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{task.owner.split('(')[0].trim()}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {task.plannedStartDate} → {task.plannedEndDate}
                      </div>
                      {task.isDelayed && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>+{task.delayDays}d Delay</span>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Gantt Timeline Bar Canvas */}
                    <div className="flex-1 relative h-16 py-2 px-2 flex items-center overflow-hidden">
                      {/* Grid Guide lines for months */}
                      <div className="absolute inset-0 flex pointer-events-none opacity-30">
                        {months.map((m, i) => (
                          <div key={i} className="border-r border-slate-300 h-full" style={{ width: `${m.widthPct}%` }} />
                        ))}
                      </div>

                      {/* Planned Schedule Bar (Baseline ghost) */}
                      <div
                        className="absolute h-2.5 rounded-sm bg-slate-200 border border-slate-300 opacity-80"
                        style={{
                          left: `${planStartPct}%`,
                          width: `${planWidthPct}%`,
                          top: '12px'
                        }}
                        title={`Planned: ${task.plannedStartDate} to ${task.plannedEndDate}`}
                      />

                      {/* Actual / Progress Bar */}
                      <div
                        className={`absolute h-4 rounded-md shadow-xs flex items-center px-2 text-[10px] font-bold text-white transition-all ${
                          task.isDelayed
                            ? 'bg-rose-500 border border-rose-600'
                            : task.status === 'completed'
                            ? 'bg-emerald-600'
                            : 'bg-indigo-600'
                        }`}
                        style={{
                          left: `${planStartPct}%`,
                          width: `${actualWidthPct}%`,
                          top: '26px'
                        }}
                        title={`Actual Progress: ${task.progressPercent}% | Status: ${task.status}`}
                      >
                        <span className="truncate">{task.progressPercent}%</span>
                        {task.isDelayed && (
                          <AlertTriangle className="h-3 w-3 text-white ml-auto shrink-0 animate-bounce" />
                        )}
                      </div>

                      {/* Dependency Arrow representation if applicable */}
                      {task.dependsOn && task.dependsOn.length > 0 && (
                        <div
                          className="absolute -top-1 border-l-2 border-dashed border-indigo-400 h-7"
                          style={{ left: `${planStartPct}%` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Task Deep-Dive & Delay Reason Drawer */}
      {selectedTask && (
        <div className="rounded-xl border border-indigo-200 bg-white p-5 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <MilestoneIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {selectedTask.programCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Phase: {selectedTask.phase}
                  </span>
                  {selectedTask.criticalPath && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Critical Path Task
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedTask.title}</h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/60 space-y-1.5">
              <p className="text-slate-400 font-medium">Work Package Ownership</p>
              <p className="font-bold text-slate-800">{selectedTask.owner}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Progress:</span>
                <span className="font-bold text-indigo-600">{selectedTask.progressPercent}%</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/60 space-y-1.5">
              <p className="text-slate-400 font-medium">Schedule Timeline</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Planned Start:</span>
                <span className="font-bold text-slate-700">{selectedTask.plannedStartDate}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Planned End:</span>
                <span className="font-bold text-slate-700">{selectedTask.plannedEndDate}</span>
              </div>
              {selectedTask.actualEndDate && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Actual Completion:</span>
                  <span className="font-bold text-emerald-600">{selectedTask.actualEndDate}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/60 space-y-1.5">
              <p className="text-slate-400 font-medium">Precedents & Dependencies</p>
              {selectedTask.dependsOn && selectedTask.dependsOn.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {selectedTask.dependsOn.map((dep) => (
                    <span key={dep} className="font-mono text-[10px] font-bold text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded">
                      {dep}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-[11px]">Initial task / No predecessor dependencies</p>
              )}
            </div>
          </div>

          {/* If Task is Delayed: Highlight Delay Reason & Mitigation */}
          {selectedTask.isDelayed && (
            <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Delay Telemetry (+{selectedTask.delayDays} Days Variance)</span>
              </div>
              <div>
                <p className="font-bold text-slate-800">Root Cause for Delay:</p>
                <p className="text-slate-700 leading-relaxed mt-0.5">{selectedTask.delayReason}</p>
              </div>
              {selectedTask.mitigationPlan && (
                <div className="pt-2 border-t border-rose-200/60">
                  <p className="font-bold text-emerald-800">Corrective Action / Mitigation Plan:</p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">{selectedTask.mitigationPlan}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
