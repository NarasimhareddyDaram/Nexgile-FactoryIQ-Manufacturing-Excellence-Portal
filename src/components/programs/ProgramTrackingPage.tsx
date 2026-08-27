import React, { useState } from 'react';
import {
  Program,
  Role,
  User,
  StatusHistoryRecord,
  GanttTask,
  WorkOrder,
  StageGate,
  BOMItem,
  EngineeringDrawing,
  EngineeringSpec,
  ECO,
  EvidenceFile
} from '../../types';
import { PortfolioView } from './PortfolioView';
import { PlannedVsActualGantt } from './PlannedVsActualGantt';
import { WorkOrderDrilldown } from './WorkOrderDrilldown';
import { StageGatesStepper } from './StageGatesStepper';
import { EngineeringArtifacts } from './EngineeringArtifacts';
import { EvidenceRepository } from './EvidenceRepository';
import {
  INITIAL_GANTT_TASKS,
  INITIAL_WORK_ORDERS,
  INITIAL_STAGE_GATES,
  INITIAL_BOM_ITEMS,
  INITIAL_ENGINEERING_DRAWINGS,
  INITIAL_ENGINEERING_SPECS,
  INITIAL_ECO_LOG,
  INITIAL_EVIDENCE_FILES
} from '../../data/programTrackingData';
import {
  BarChart3,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  Cpu,
  Factory,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  GitBranch,
  History,
  Layers,
  ListTodo,
  Plus,
  RotateCw,
  Sparkles,
  Workflow
} from 'lucide-react';

export type ProgramTrackingTab =
  | 'portfolio'
  | 'gantt'
  | 'work_orders'
  | 'stage_gates'
  | 'engineering_artifacts'
  | 'evidence_repository';

interface ProgramTrackingPageProps {
  programs: Program[];
  statusHistory: StatusHistoryRecord[];
  currentRole: Role | null;
  currentUser: User | null;
  onSelectProgram: (program: Program) => void;
  onOpenStatusHistoryModal: (program?: Program) => void;
  onOpenNewProgramModal: () => void;
  initialTab?: ProgramTrackingTab;
}

export function ProgramTrackingPage({
  programs,
  statusHistory,
  currentRole,
  currentUser,
  onSelectProgram,
  onOpenStatusHistoryModal,
  onOpenNewProgramModal,
  initialTab = 'portfolio'
}: ProgramTrackingPageProps) {
  const [activeTab, setActiveTab] = useState<ProgramTrackingTab>(initialTab);
  const [activeProgramId, setActiveProgramId] = useState<string>(programs[0]?.id || 'prog-001');

  // Datasets
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>(INITIAL_GANTT_TASKS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [stageGates, setStageGates] = useState<StageGate[]>(INITIAL_STAGE_GATES);
  const [bomItems, setBomItems] = useState<BOMItem[]>(INITIAL_BOM_ITEMS);
  const [drawings, setDrawings] = useState<EngineeringDrawing[]>(INITIAL_ENGINEERING_DRAWINGS);
  const [specs, setSpecs] = useState<EngineeringSpec[]>(INITIAL_ENGINEERING_SPECS);
  const [ecoLog, setEcoLog] = useState<ECO[]>(INITIAL_ECO_LOG);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>(INITIAL_EVIDENCE_FILES);

  const selectedProgram = programs.find(p => p.id === activeProgramId) || programs[0];

  const delayedTasksCount = ganttTasks.filter(t => t.isDelayed).length;
  const pendingApprovalsCount = ecoLog.filter(e => e.status === 'Pending Customer Approval').length;

  const tabs = [
    {
      id: 'portfolio' as ProgramTrackingTab,
      label: '1. Portfolio View',
      icon: FolderKanban,
      badge: programs.length,
      description: 'Multi-site program health & status history'
    },
    {
      id: 'gantt' as ProgramTrackingTab,
      label: '2. Planned vs Actual',
      icon: Calendar,
      badge: delayedTasksCount > 0 ? `${delayedTasksCount} Delayed` : undefined,
      badgeColor: delayedTasksCount > 0 ? 'bg-amber-100 text-amber-800' : undefined,
      description: 'Gantt timeline, milestones & dependency links'
    },
    {
      id: 'work_orders' as ProgramTrackingTab,
      label: '3. Work-Order Drill-Down',
      icon: Factory,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Shopfloor stages, WIP %, throughput & bottleneck warnings'
    },
    {
      id: 'stage_gates' as ProgramTrackingTab,
      label: '4. R&D / NPI Stage Gates',
      icon: Workflow,
      badge: '5 Gates',
      description: 'Requirements traceability & qualification pass/fail'
    },
    {
      id: 'engineering_artifacts' as ProgramTrackingTab,
      label: '5. Engineering Artifacts & ECOs',
      icon: RotateCw,
      badge: `${ecoLog.length} ECOs`,
      description: 'BOM, CAD drawings, specs & auto-notified ECO log'
    },
    {
      id: 'evidence_repository' as ProgramTrackingTab,
      label: '6. Evidence Repository',
      icon: FileSpreadsheet,
      badge: `${evidenceFiles.length} Files`,
      description: 'Test plans, telemetry data, PPAP/FAI & inspection media'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              PROGRAM & PROJECT TRACKING
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Enterprise NPI & High-Volume Execution Hub
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Program Portfolio & Operational Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Manage multi-site automotive and medical electronics programs across stage gates, track real-time shopfloor work orders, review engineering change orders (ECOs), and verify qualification evidence dossiers.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenStatusHistoryModal(selectedProgram)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <History className="h-4 w-4 text-indigo-600" />
            <span>Update / View Status History</span>
          </button>

          {currentRole?.category === 'internal' && (
            <button
              onClick={onOpenNewProgramModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Program</span>
            </button>
          )}
        </div>
      </div>

      {/* 6 Tab Navigation Strip */}
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 min-w-[760px]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.badgeColor || 'bg-slate-100 text-slate-700'
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

      {/* Tab Content Panes */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'portfolio' && (
          <PortfolioView
            programs={programs}
            statusHistory={statusHistory}
            currentRole={currentRole}
            currentUser={currentUser}
            onSelectProgram={onSelectProgram}
            onOpenStatusHistory={onOpenStatusHistoryModal}
            onOpenNewProgram={onOpenNewProgramModal}
          />
        )}

        {activeTab === 'gantt' && (
          <PlannedVsActualGantt
            tasks={ganttTasks}
            programs={programs}
            selectedProgramId={activeProgramId}
            onSelectProgram={setActiveProgramId}
          />
        )}

        {activeTab === 'work_orders' && (
          <WorkOrderDrilldown
            workOrders={workOrders}
            programs={programs}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'stage_gates' && (
          <StageGatesStepper
            stageGates={stageGates}
            programs={programs}
            selectedProgram={selectedProgram}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'engineering_artifacts' && (
          <EngineeringArtifacts
            bomItems={bomItems}
            drawings={drawings}
            specs={specs}
            ecoLog={ecoLog}
            programs={programs}
            selectedProgram={selectedProgram}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'evidence_repository' && (
          <EvidenceRepository
            evidenceFiles={evidenceFiles}
            programs={programs}
            selectedProgram={selectedProgram}
            currentRole={currentRole}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}
