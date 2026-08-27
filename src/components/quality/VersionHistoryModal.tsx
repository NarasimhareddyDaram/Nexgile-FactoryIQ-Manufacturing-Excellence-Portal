import React from 'react';
import { X, FileText, Download, Clock, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ComplianceDocument } from '../../types';

interface VersionHistoryModalProps {
  document: ComplianceDocument;
  onClose: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                  {document.standard}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {document.certNumber}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Version History & Audit Trail
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Document Info Banner */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">{document.title}</p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Facility</span>
              <span className="font-semibold text-slate-700">{document.facility}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Registrar Body</span>
              <span className="font-semibold text-slate-700">{document.issuingBody}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Current Version</span>
              <span className="font-bold text-blue-700">{document.currentVersion}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Audit Readiness</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                {document.auditReadiness}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline of Revisions */}
        <div className="mt-5 space-y-4 max-h-80 overflow-y-auto pr-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Revision Records ({document.versionHistory.length})
          </h3>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {document.versionHistory.map((ver, idx) => (
              <div key={idx} className="relative">
                {/* Node icon */}
                <div className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  idx === 0 ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-500'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {ver.version}
                      </span>
                      {idx === 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Active Release
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{ver.changeDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 font-medium">
                    {ver.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>Authorized by: <strong className="text-slate-700">{ver.changedBy}</strong></span>
                    </div>

                    <a
                      href={ver.downloadUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading revision ${ver.version} of ${document.title} (${ver.fileSize})`);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download ({ver.fileSize})</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
          <a
            href={document.downloadUrl}
            onClick={(e) => {
              e.preventDefault();
              alert(`Downloading active certified document: ${document.title} (${document.fileSize})`);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Active Certificate ({document.fileSize})</span>
          </a>
        </div>
      </div>
    </div>
  );
};
