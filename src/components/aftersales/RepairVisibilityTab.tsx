import React, { useState } from 'react';
import {
  Wrench,
  Cpu,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Truck,
  DollarSign,
  UserCheck,
  Shield,
  Activity,
  Layers,
  Thermometer,
  Eye,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Radio,
  FileText,
  X
} from 'lucide-react';
import {
  RepairRecord,
  RepairActionEntry,
  Role,
  User
} from '../../types';
import { mockRepairRecords } from '../../data/afterSalesData';

interface RepairVisibilityTabProps {
  currentRole: Role | null;
  currentUser: User | null;
  selectedRMANumber?: string | null;
}

const REPAIR_STAGES = [
  'Depot Intake',
  'Visual & Optical (AOI/X-Ray)',
  'Failure Analysis & Root Cause',
  'Quotation & Customer Approval',
  'Rework & Component Replacement',
  'Firmware & Calibration',
  'Final Functional & Safety Testing',
  'Packaging & Outbound Dispatch'
] as const;

export function RepairVisibilityTab({
  currentRole,
  currentUser,
  selectedRMANumber
}: RepairVisibilityTabProps) {
  const [repairs, setRepairs] = useState<RepairRecord[]>(mockRepairRecords);
  const [selectedRepairId, setSelectedRepairId] = useState<string>(() => {
    if (selectedRMANumber) {
      const match = mockRepairRecords.find(r => r.rmaNumber === selectedRMANumber);
      if (match) return match.id;
    }
    return mockRepairRecords[0].id;
  });

  const [showAddActionModal, setShowAddActionModal] = useState(false);
  const [showCoCModal, setShowCoCModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Action Form
  const [actionName, setActionName] = useState('');
  const [actionEquipment, setActionEquipment] = useState('JBC Nano Rework Station');
  const [actionParts, setActionParts] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeRepair = repairs.find(r => r.id === selectedRepairId) || repairs[0];

  const handleApproveQuote = (repairId: string) => {
    setRepairs(prev =>
      prev.map(r => {
        if (r.id !== repairId) return r;
        return {
          ...r,
          quoteApproval: {
            ...r.quoteApproval,
            approvalStatus: 'Approved by Customer',
            approvedBy: `${currentUser?.name || 'Customer Program Manager'} (PO #PO-APP-${Date.now().toString().slice(-4)})`,
            approvedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }
        };
      })
    );
    showToast(`Quotation approved for repair job ${activeRepair.rmaNumber}!`);
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionName.trim()) return;

    const newEntry: RepairActionEntry = {
      id: `act-${Date.now()}`,
      actionName,
      performedBy: currentUser?.name || activeRepair.technicianName,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      partsReplaced: actionParts ? actionParts.split(',').map(p => p.trim()) : [],
      equipmentUsed: actionEquipment,
      notes: actionNotes || 'Action verified under stereo microscope.'
    };

    setRepairs(prev =>
      prev.map(r => {
        if (r.id !== activeRepair.id) return r;
        return {
          ...r,
          repairActionsLog: [newEntry, ...r.repairActionsLog]
        };
      })
    );

    setShowAddActionModal(false);
    setActionName('');
    setActionParts('');
    setActionNotes('');
    showToast('New rework action logged into repair audit history.');
  };

  const getStageIndex = (stageName: string) => {
    return REPAIR_STAGES.findIndex(s => s === stageName);
  };

  const currentStageIdx = getStageIndex(activeRepair.stage);

  return (
    <div id="repair-visibility-container" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Job Selector Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Wrench className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Depot Repair Execution & Diagnostics Hub</h2>
                <p className="text-xs text-slate-500">
                  Real-time technician workstation status, root cause telemetry, quote approvals, and final QA certification
                </p>
              </div>
            </div>
          </div>

          {/* Quick Switch Repair Jobs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {repairs.map(rep => {
              const isSelected = rep.id === activeRepair.id;
              return (
                <button
                  key={rep.id}
                  id={`btn-select-repair-${rep.id}`}
                  onClick={() => setSelectedRepairId(rep.id)}
                  className={`px-3.5 py-2 rounded-xl text-left border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                    <span>{rep.rmaNumber}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-emerald-400' : 'bg-indigo-500'
                      }`}
                    />
                  </div>
                  <div
                    className={`text-[11px] truncate max-w-[150px] ${
                      isSelected ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {rep.productName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Job Overview Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-mono font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{activeRepair.productName}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                  {activeRepair.serialNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer: <span className="text-slate-200 font-medium">{activeRepair.customerName}</span> | Station:{' '}
                <span className="text-indigo-300 font-medium">{activeRepair.repairBay}</span> | Tech:{' '}
                <span className="text-slate-200 font-medium">{activeRepair.technicianName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Current Progress</div>
              <div className="text-lg font-black text-emerald-400">{activeRepair.progressPercent}%</div>
            </div>
            <button
              onClick={() => setShowCoCModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>QA Certificate (CoC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8-Stage Step-Based Repair Progress Stepper */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Depot Lifecycle & Rework Stage Stepper
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {REPAIR_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div
                key={stage}
                className={`p-2.5 rounded-xl border text-center relative flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : isCurrent
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md ring-2 ring-indigo-200'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                  )}
                </div>
                <div
                  className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
                    isCurrent ? 'text-white font-bold' : isCompleted ? 'text-emerald-900' : 'text-slate-600'
                  }`}
                >
                  {stage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Diagnostics & Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Diagnostics, Faulty Parts & Quote Approval */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diagnostics & Root Cause Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                  <Activity className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Failure Analysis & Diagnostics Teardown</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                {activeRepair.diagnostics.failureCategory}
              </span>
            </div>

            {/* Root Cause Narrative */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Confirmed Root Cause Analysis:</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeRepair.diagnostics.rootCauseSummary}
              </p>
            </div>

            {/* Faulty Components Table */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Identified Defective Components (BOM Teardown)
              </span>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">RefDes</th>
                      <th className="p-2.5">Part Number / MPN</th>
                      <th className="p-2.5">Defect Classification</th>
                      <th className="p-2.5">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeRepair.diagnostics.faultyComponents.map((comp, i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-mono font-bold text-indigo-600">{comp.refDes}</td>
                        <td className="p-2.5">
                          <div className="font-medium text-slate-900">{comp.mpn}</div>
                          <div className="text-[11px] font-mono text-slate-500">{comp.partNumber}</div>
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {comp.defectType}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold ${
                              comp.severity === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {comp.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Optical & Thermal Deep Dive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3D X-Ray & Optical Inspection</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {activeRepair.diagnostics.opticalXrayNotes}
                </p>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  <span>FLIR Thermal Imaging Analysis</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {activeRepair.diagnostics.thermalImagingResult}
                </p>
              </div>
            </div>

            {/* NVRAM Crash Dump Logs */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">NVRAM JTAG Diagnostics Dump:</span>
              <pre className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto border border-slate-800">
                {activeRepair.diagnostics.logsAnalyzed}
              </pre>
            </div>
          </div>

          {/* Quotation & Customer Approval Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                  <DollarSign className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Repair Cost Quotation & Customer PO Authorization</h3>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  activeRepair.quoteApproval.approvalStatus.includes('Under Warranty')
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeRepair.quoteApproval.approvalStatus.includes('Approved')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeRepair.quoteApproval.approvalStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500">Labor Required</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {activeRepair.quoteApproval.laborHours} hrs @ ${activeRepair.quoteApproval.laborRateUSD}/hr
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500">Parts & Consumables</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  ${activeRepair.quoteApproval.partsCostUSD}.00 USD
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500">Total Quote Amount</span>
                <div className="text-sm font-extrabold text-indigo-600 mt-0.5">
                  ${activeRepair.quoteApproval.totalQuoteUSD}.00 USD
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500">Warranty Coverage</span>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">
                  {activeRepair.quoteApproval.isBillable ? 'Billable T&M' : '100% Covered'}
                </div>
              </div>
            </div>

            {activeRepair.quoteApproval.approvalStatus === 'Pending Customer Approval' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Awaiting customer authorization to proceed with out-of-warranty rework.</span>
                </div>
                <button
                  id="btn-approve-quote"
                  onClick={() => handleApproveQuote(activeRepair.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  Approve Quotation & Authorize
                </button>
              </div>
            )}

            {activeRepair.quoteApproval.approvedBy && (
              <div className="text-xs text-slate-500">
                Authorized By: <strong className="text-slate-800">{activeRepair.quoteApproval.approvedBy}</strong> on{' '}
                {activeRepair.quoteApproval.approvedAt}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 Cols): Repair Actions Log, Final Tests & Outbound Shipment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Repair Actions & Rework Log */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <Wrench className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Rework Actions & Audit Log</h3>
              </div>
              <button
                id="btn-add-rework-action"
                onClick={() => setShowAddActionModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Action</span>
              </button>
            </div>

            {activeRepair.repairActionsLog.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                No rework steps recorded yet. Unit is awaiting authorization or parts.
              </div>
            ) : (
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeRepair.repairActionsLog.map((action, idx) => (
                  <div key={action.id || idx} className="relative flex items-start gap-2.5">
                    <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-4 ring-indigo-50">
                      <Zap className="w-2.5 h-2.5" />
                    </div>
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{action.actionName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{action.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Tech: <span className="font-medium text-slate-700">{action.performedBy}</span> | Equip:{' '}
                        <span className="text-indigo-600 font-medium">{action.equipmentUsed}</span>
                      </div>
                      {action.partsReplaced.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {action.partsReplaced.map((p, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-600 italic mt-0.5">"{action.notes}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Test Results & QA Sign-Off */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                  <FileCheck className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Final Functional & Safety Sign-off</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {activeRepair.finalTestResults.qaInspectorBadge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">ICT Bed-of-Nails</span>
                <span
                  className={`text-xs font-bold ${
                    activeRepair.finalTestResults.ictTest === 'Passed'
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {activeRepair.finalTestResults.ictTest}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Functional System Test</span>
                <span
                  className={`text-xs font-bold ${
                    activeRepair.finalTestResults.functionalTest === 'Passed'
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {activeRepair.finalTestResults.functionalTest}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  Burn-In ({activeRepair.finalTestResults.burnInDurationHours}h Chamber)
                </span>
                <span
                  className={`text-xs font-bold ${
                    activeRepair.finalTestResults.burnInResult === 'Passed'
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {activeRepair.finalTestResults.burnInResult}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Hi-Pot High Voltage</span>
                <span className="text-xs font-bold text-emerald-600">
                  {activeRepair.finalTestResults.hiPotSafetyTest}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Calibration Records:</span>
              <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                {activeRepair.finalTestResults.calibrationLog}
              </p>
            </div>
          </div>

          {/* Outbound Shipment Tracking */}
          {activeRepair.outboundShipment && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                    <Truck className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">Outbound Return Shipment</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {activeRepair.outboundShipment.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <strong>Carrier & Tracking:</strong>{' '}
                  <span className="font-mono font-bold text-indigo-600">
                    {activeRepair.outboundShipment.carrier} ({activeRepair.outboundShipment.trackingNumber})
                  </span>
                </div>
                <div>
                  <strong>Destination:</strong> {activeRepair.outboundShipment.recipientAddress}
                </div>
                <div>
                  <strong>Estimated Delivery:</strong>{' '}
                  <span className="font-semibold text-emerald-600">
                    {activeRepair.outboundShipment.estimatedArrival}
                  </span>
                </div>
                <div>
                  <strong>Packing Slip:</strong> {activeRepair.outboundShipment.packingSlipNumber}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Log Rework Action Modal */}
      {showAddActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Log Rework / Repair Action</h3>
              <button
                onClick={() => setShowAddActionModal(false)}
                className="p-1 text-indigo-200 hover:text-white rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAction} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Action Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SMT BGA Reballing / Replaced Power IC"
                  value={actionName}
                  onChange={e => setActionName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Equipment Used</label>
                <select
                  value={actionEquipment}
                  onChange={e => setActionEquipment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="JBC Nano Rework Station">JBC Nano Rework Station</option>
                  <option value="Finetech Fineplacer Core SMD">Finetech Fineplacer Core SMD</option>
                  <option value="Hakko Hot Air Pre-heater & BGA Rework">Hakko Hot Air Pre-heater & BGA Rework</option>
                  <option value="Humiseal UV Spray Conformal Booth">Humiseal UV Spray Conformal Booth</option>
                  <option value="Mantis Elite Stereo Microscope">Mantis Elite Stereo Microscope</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Replaced Parts (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Q14 (MOSFET), C102 (47uF Cap)"
                  value={actionParts}
                  onChange={e => setActionParts(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Technician Notes & Verification</label>
                <textarea
                  rows={2}
                  placeholder="Optical inspection passed, zero solder bridging..."
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddActionModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate of Conformance (CoC) Modal */}
      {showCoCModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Certificate of Conformance (CoC / FAA 8130-3 Equivalent)</h3>
              </div>
              <button
                onClick={() => setShowCoCModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-2 border-slate-300 p-5 rounded-lg text-slate-800 font-sans space-y-4 text-xs bg-slate-50/50">
                <div className="text-center border-b pb-3 border-slate-300">
                  <h4 className="text-base font-extrabold tracking-wider uppercase text-slate-900">
                    NEXGILE EMS QUALITY ASSURANCE & DEPOT REPAIR
                  </h4>
                  <p className="text-[11px] text-slate-500">ISO 9001:2015 / AS9100D / ISO 13485 Certified Facility</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong>Product:</strong> {activeRepair.productName}
                  </div>
                  <div>
                    <strong>Serial Number:</strong> <span className="font-mono">{activeRepair.serialNumber}</span>
                  </div>
                  <div>
                    <strong>RMA Authorization:</strong> {activeRepair.rmaNumber}
                  </div>
                  <div>
                    <strong>QA Inspector ID:</strong> {activeRepair.finalTestResults.qaInspectorBadge}
                  </div>
                  <div>
                    <strong>Hi-Pot Isolation:</strong> {activeRepair.finalTestResults.hiPotSafetyTest}
                  </div>
                  <div>
                    <strong>Burn-In Completed:</strong> {activeRepair.finalTestResults.burnInDurationHours} Hours (Pass)
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    "This is to certify that the articles enumerated above were repaired, reworked, and tested in accordance
                    with standard IPC-7711/7721 and OEM engineering specifications and are approved for return to service."
                  </p>
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-slate-300">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Authorized Signature:</div>
                    <div className="font-serif italic font-bold text-slate-900 text-sm">
                      Dr. Warren Hastings, VP Quality
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase">Issue Date:</div>
                    <div className="font-mono text-xs">{new Date().toISOString().split('T')[0]}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Print Official Certificate
                </button>
                <button
                  onClick={() => setShowCoCModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
