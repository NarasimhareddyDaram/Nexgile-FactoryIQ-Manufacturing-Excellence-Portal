import React, { useState } from 'react';
import {
  X,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { QualityAuditSchedule, AuditChecklistItem } from '../../types';

interface AuditChecklistModalProps {
  audit: QualityAuditSchedule;
  onClose: () => void;
}

export const AuditChecklistModal: React.FC<AuditChecklistModalProps> = ({
  audit,
  onClose,
}) => {
  const [items, setItems] = useState<AuditChecklistItem[]>(audit.checklists);

  const handleResultChange = (itemId: string, newResult: AuditChecklistItem['result']) => {
    setItems(items.map(it => it.id === itemId ? { ...it, result: newResult } : it));
  };

  const passCount = items.filter(i => i.result === 'Conforming').length;
  const failCount = items.filter(i => i.result === 'Minor NC' || i.result === 'Major NC').length;
  const ofiCount = items.filter(i => i.result === 'OFI').length;
  const score = items.length > 0 ? Math.round((passCount / items.length) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 p-5 bg-slate-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                {audit.standard}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {audit.auditType}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {audit.auditTitle} — Audit Checklist
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{audit.facility}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Lead Auditor: <strong>{audit.leadAuditor}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Score Summary Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">Conforming Score: <strong className="text-blue-700 text-sm">{score}%</strong></span>
            <span className="text-emerald-700 font-semibold">{passCount} Conforming</span>
            <span className="text-rose-700 font-semibold">{failCount} NCs</span>
            <span className="text-amber-700 font-semibold">{ofiCount} OFI</span>
          </div>

          <span className="text-[11px] text-slate-400">
            Total Checkpoints: {items.length}
          </span>
        </div>

        {/* Clauses List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition ${
                item.result === 'Conforming'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : item.result === 'Major NC' || item.result === 'Minor NC'
                  ? 'border-rose-200 bg-rose-50/30'
                  : item.result === 'OFI'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.clause}
                    </span>
                    <span className="font-bold text-xs text-slate-800">
                      {item.question}
                    </span>
                  </div>

                  {item.evidence && (
                    <p className="text-[11px] text-slate-600 pl-2 border-l-2 border-slate-300 mt-1">
                      <strong>Audit Evidence:</strong> {item.evidence}
                    </p>
                  )}
                  {item.auditorNotes && (
                    <p className="text-[11px] text-blue-800 pl-2 border-l-2 border-blue-400 mt-1">
                      <strong>Auditor Notes:</strong> {item.auditorNotes}
                    </p>
                  )}
                </div>

                {/* Result Toggle Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleResultChange(item.id, 'Conforming')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      item.result === 'Conforming'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Conforming
                  </button>

                  <button
                    onClick={() => handleResultChange(item.id, 'Minor NC')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      item.result === 'Minor NC'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Minor NC
                  </button>

                  <button
                    onClick={() => handleResultChange(item.id, 'OFI')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      item.result === 'OFI'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    OFI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <span className="text-xs text-slate-500">
            Checklist evaluations synchronized with electronic QMS registrar pack
          </span>

          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
          >
            Close & Save Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

