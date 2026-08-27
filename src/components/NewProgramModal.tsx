import React, { useState } from 'react';
import { X, Plus, GitMerge, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { Program, ProgramStage, HealthStatus, Role, User } from '../types';

interface NewProgramModalProps {
  currentRole: Role;
  currentUser: User;
  onClose: () => void;
  onCreateProgram: (programData: Partial<Program>) => void;
}

export const NewProgramModal: React.FC<NewProgramModalProps> = ({
  currentRole,
  currentUser,
  onClose,
  onCreateProgram
}) => {
  const [code, setCode] = useState(`NX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('');
  const [customerName, setCustomerName] = useState('VoltMobility EV');
  const [productCategory, setProductCategory] = useState('Automotive Electronics');
  const [facility, setFacility] = useState('Plant 1 (Austin High-Tech Campus)');
  const [stage, setStage] = useState<ProgramStage>('EVT (Engineering Validation)');
  const [health, setHealth] = useState<HealthStatus>('green');
  const [targetVolume, setTargetVolume] = useState('50000');
  const [targetLaunchDate, setTargetLaunchDate] = useState('2027-03-31');
  const [customerSummary, setCustomerSummary] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProgram({
      code,
      name,
      customerName,
      productCategory,
      facility,
      stage,
      health,
      targetVolume: Number(targetVolume) || 10000,
      targetLaunchDate,
      customerSummary: customerSummary.trim() || 'New program initiated in portal.',
      internalNotes: internalNotes.trim() || 'Initial capacity and tooling planning active.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-2xs">
              <GitMerge className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Register New Manufacturing Program
              </h2>
              <p className="text-xs text-slate-500">
                Create new NPI project in the <code className="text-indigo-600 font-mono">programs</code> table
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Program Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-indigo-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Program / Product Name</label>
              <input
                type="text"
                required
                placeholder="e.g. NextGen Micro-Inverter Gen-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer / OEM Partner</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Category</label>
              <input
                type="text"
                required
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="R&D Concept">R&D Concept</option>
                <option value="EVT (Engineering Validation)">EVT (Eng Validation)</option>
                <option value="DVT (Design Validation)">DVT (Design Validation)</option>
                <option value="PVT (Production Validation)">PVT (Prod Validation)</option>
                <option value="Mass Production (Ramp)">Mass Production</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Health Status</label>
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="green">Green (On Track)</option>
                <option value="yellow">Yellow (At Risk)</option>
                <option value="red">Red (Critical)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Launch</label>
              <input
                type="date"
                value={targetLaunchDate}
                onChange={(e) => setTargetLaunchDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer Executive Summary</label>
            <textarea
              rows={2}
              placeholder="High-level milestones and customer-visible delivery summary..."
              value={customerSummary}
              onChange={(e) => setCustomerSummary(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Internal Engineering Notes</label>
            <textarea
              rows={2}
              placeholder="Internal shopfloor notes, line allocation, tooling readiness..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
