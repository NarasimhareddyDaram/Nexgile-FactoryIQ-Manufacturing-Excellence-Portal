import React, { useState } from 'react';
import {
  X,
  History,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { Program, StatusHistoryRecord, Role, User, HealthStatus } from '../types';

interface StatusHistoryModalProps {
  programs: Program[];
  selectedProgram?: Program | null;
  statusHistory: StatusHistoryRecord[];
  currentRole: Role;
  currentUser: User;
  onClose: () => void;
  onSubmitStatusUpdate: (payload: {
    programId: string;
    category: StatusHistoryRecord['category'];
    newStatus: string;
    reason: string;
    health?: HealthStatus;
    stage?: string;
    currentYieldPercent?: number;
    customerSummary?: string;
    internalNotes?: string;
    isInternalOnly?: boolean;
  }) => void;
}

export const StatusHistoryModal: React.FC<StatusHistoryModalProps> = ({
  programs,
  selectedProgram,
  statusHistory,
  currentRole,
  currentUser,
  onClose,
  onSubmitStatusUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'view'>(selectedProgram ? 'log' : 'view');
  const [programId, setProgramId] = useState<string>(selectedProgram?.id || (programs[0]?.id ?? ''));
  const [category, setCategory] = useState<StatusHistoryRecord['category']>('health');
  const [health, setHealth] = useState<HealthStatus>('green');
  const [newStatus, setNewStatus] = useState<string>('Green (On Track)');
  const [reason, setReason] = useState<string>('');
  const [currentYieldPercent, setCurrentYieldPercent] = useState<string>('98.5');
  const [customerSummary, setCustomerSummary] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isInternalOnly, setIsInternalOnly] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    onSubmitStatusUpdate({
      programId,
      category,
      newStatus: newStatus || health,
      reason,
      health: category === 'health' ? health : undefined,
      currentYieldPercent: category === 'yield' ? Number(currentYieldPercent) : undefined,
      customerSummary: customerSummary.trim() ? customerSummary : undefined,
      internalNotes: internalNotes.trim() ? internalNotes : undefined,
      isInternalOnly
    });

    onClose();
  };

  const isInternal = currentRole.category === 'internal';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-2xs">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Manufacturing Status History & Audit Log
              </h2>
              <p className="text-xs text-slate-500">
                Log status changes directly to the <code className="text-indigo-600 font-mono">status_history</code> table
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('log')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'log'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            + Log New Status Update
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'view'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            View All History Records ({statusHistory.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'log' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Program / Project</label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Update Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="health">Overall Health (Green/Yellow/Red)</option>
                    <option value="stage">Stage Gate Progression</option>
                    <option value="yield">First-Pass Yield / Scrap Update</option>
                    <option value="schedule">Schedule / Buffer Adjustment</option>
                    <option value="risk">Technical / Component Risk</option>
                    <option value="general">General Program Milestone</option>
                  </select>
                </div>
              </div>

              {category === 'health' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">New Health Status</label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        health === 'green'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="health"
                        value="green"
                        checked={health === 'green'}
                        onChange={() => {
                          setHealth('green');
                          setNewStatus('Green (On Track)');
                        }}
                        className="sr-only"
                      />
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Green (On Track)
                    </label>

                    <label
                      className={`flex-1 p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        health === 'yellow'
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="health"
                        value="yellow"
                        checked={health === 'yellow'}
                        onChange={() => {
                          setHealth('yellow');
                          setNewStatus('Yellow (At Risk)');
                        }}
                        className="sr-only"
                      />
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Yellow (At Risk)
                    </label>

                    <label
                      className={`flex-1 p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        health === 'red'
                          ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="health"
                        value="red"
                        checked={health === 'red'}
                        onChange={() => {
                          setHealth('red');
                          setNewStatus('Red (Critical)');
                        }}
                        className="sr-only"
                      />
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Red (Critical)
                    </label>
                  </div>
                </div>
              )}

              {category === 'yield' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">New First-Pass Yield %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={currentYieldPercent}
                    onChange={(e) => {
                      setCurrentYieldPercent(e.target.value);
                      setNewStatus(`Yield: ${e.target.value}%`);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason & Engineering Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why the status changed, including root cause, test results, or recovery actions..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Executive Summary (Optional)</label>
                <input
                  type="text"
                  placeholder="Sanitized high-level summary visible to customer-side roles..."
                  value={customerSummary}
                  onChange={(e) => setCustomerSummary(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {isInternal && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="internal-only-check"
                    checked={isInternalOnly}
                    onChange={(e) => setIsInternalOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="internal-only-check" className="text-xs text-slate-700 font-medium">
                    Mark this audit record as <strong className="text-indigo-700">Internal-Only</strong> (hidden from customer portal view)
                  </label>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Author: <strong className="text-slate-700">{currentUser.name}</strong> ({currentRole.name})
                </span>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Commit Status Record
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {statusHistory.map((sh) => (
                <div
                  key={sh.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600">{sh.programName}</span>
                      <span className="inline-flex items-center rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-700">
                        {sh.category}
                      </span>
                      {sh.isInternalOnly && (
                        <span className="inline-flex items-center rounded bg-indigo-100 text-indigo-800 px-1.5 py-0.5 text-[9px] font-bold">
                          Internal Only
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sh.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                    {sh.oldStatus && <span className="text-slate-400 line-through">{sh.oldStatus}</span>}
                    <span>→</span>
                    <span className="text-emerald-700">{sh.newStatus}</span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">{sh.reason}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Logged by: {sh.changedByName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
