import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Layers,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Eye,
  Download,
  Upload,
  PenTool,
  ShieldCheck,
  AlertTriangle,
  History,
  Tag,
  Plus,
  ArrowRight,
  FileCode,
  Box,
  FileCheck,
  FileSpreadsheet
} from 'lucide-react';
import {
  Role,
  User,
  CollaborationDocument,
  DocumentVersion,
  DocumentApprovalStep,
  DocumentAnnotation
} from '../../types';
import { INITIAL_COLLABORATION_DOCUMENTS } from '../../data/collaborationData';
import { DocumentAnnotationModal } from './DocumentAnnotationModal';
import { useLocalStorage, STORAGE_KEYS } from '../../lib/storage';

interface DocumentCollaborationTabProps {
  currentRole: Role | null;
  currentUser: User | null;
}

export function DocumentCollaborationTab({ currentRole, currentUser }: DocumentCollaborationTabProps) {
  const [documents, setDocuments] = useLocalStorage<CollaborationDocument[]>(
    STORAGE_KEYS.COLLAB_DOCUMENTS,
    INITIAL_COLLABORATION_DOCUMENTS
  );
  const [selectedDocId, setSelectedDocId] = useState<string>(INITIAL_COLLABORATION_DOCUMENTS[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Annotation & Modal state
  const [annotatingDoc, setAnnotatingDoc] = useState<CollaborationDocument | null>(null);
  const [showNewRevisionModal, setShowNewRevisionModal] = useState(false);
  const [newRevisionVersion, setNewRevisionVersion] = useState('v2.3');
  const [newRevisionSummary, setNewRevisionSummary] = useState('');

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (programFilter !== 'all' && doc.programCode !== programFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchDocNo = doc.documentNumber.toLowerCase().includes(q);
      const matchProgram = doc.programName.toLowerCase().includes(q) || doc.programCode.toLowerCase().includes(q);
      return matchTitle || matchDocNo || matchProgram;
    }
    return true;
  });

  const activeDoc = documents.find(d => d.id === selectedDocId) || filteredDocs[0] || documents[0];

  const handleToggleBaselineLock = () => {
    if (!activeDoc) return;
    const isCurrentlyLocked = activeDoc.isBaselineLocked;
    const updated = documents.map(d => {
      if (d.id === activeDoc.id) {
        return {
          ...d,
          isBaselineLocked: !isCurrentlyLocked,
          status: !isCurrentlyLocked ? ('Baseline Released' as const) : ('Under Review' as const)
        };
      }
      return d;
    });
    setDocuments(updated);
  };

  const handleApproveStep = (stepId: string) => {
    if (!activeDoc) return;
    const updated = documents.map(d => {
      if (d.id === activeDoc.id) {
        const updatedApprovals = d.approvals.map(step => {
          if (step.id === stepId) {
            return {
              ...step,
              status: 'approved' as const,
              signedAt: new Date().toISOString(),
              notes: `Digitally signed by ${currentUser?.name || 'Authorized Lead'}`
            };
          }
          return step;
        });
        return { ...d, approvals: updatedApprovals };
      }
      return d;
    });
    setDocuments(updated);
  };

  const handleSaveAnnotation = (newAnn: DocumentAnnotation) => {
    const updated = documents.map(d => {
      if (d.id === newAnn.documentId) {
        return {
          ...d,
          annotations: [newAnn, ...d.annotations]
        };
      }
      return d;
    });
    setDocuments(updated);
    if (annotatingDoc && annotatingDoc.id === newAnn.documentId) {
      setAnnotatingDoc({
        ...annotatingDoc,
        annotations: [newAnn, ...annotatingDoc.annotations]
      });
    }
  };

  const handleResolveAnnotation = (annId: string) => {
    const updated = documents.map(d => {
      if (d.annotations.some(a => a.id === annId)) {
        const updatedAnn = d.annotations.map(a => {
          if (a.id === annId) {
            return { ...a, status: a.status === 'resolved' ? ('open' as const) : ('resolved' as const) };
          }
          return a;
        });
        return { ...d, annotations: updatedAnn };
      }
      return d;
    });
    setDocuments(updated);
    if (annotatingDoc) {
      const updatedAnn = annotatingDoc.annotations.map(a => {
        if (a.id === annId) {
          return { ...a, status: a.status === 'resolved' ? ('open' as const) : ('resolved' as const) };
        }
        return a;
      });
      setAnnotatingDoc({ ...annotatingDoc, annotations: updatedAnn });
    }
  };

  const handleAddReplyToAnnotation = (annId: string, replyText: string) => {
    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: currentUser?.name || 'Current User',
      authorRole: currentRole?.name || 'Engineer',
      text: replyText,
      createdAt: new Date().toISOString()
    };

    const updated = documents.map(d => {
      if (d.annotations.some(a => a.id === annId)) {
        const updatedAnn = d.annotations.map(a => {
          if (a.id === annId) {
            return { ...a, replies: [...a.replies, newReply] };
          }
          return a;
        });
        return { ...d, annotations: updatedAnn };
      }
      return d;
    });
    setDocuments(updated);
    if (annotatingDoc) {
      const updatedAnn = annotatingDoc.annotations.map(a => {
        if (a.id === annId) {
          return { ...a, replies: [...a.replies, newReply] };
        }
        return a;
      });
      setAnnotatingDoc({ ...annotatingDoc, annotations: updatedAnn });
    }
  };

  const handleUploadNewRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoc || !newRevisionSummary.trim()) return;

    const newVer: DocumentVersion = {
      version: newRevisionVersion,
      releaseDate: new Date().toISOString(),
      authorName: currentUser?.name || 'Current User',
      authorRole: currentRole?.name || 'Engineer Lead',
      changeSummary: newRevisionSummary.trim(),
      fileSize: '49.1 MB',
      isBaseline: false
    };

    const updated = documents.map(d => {
      if (d.id === activeDoc.id) {
        return {
          ...d,
          currentVersion: newRevisionVersion,
          isBaselineLocked: false,
          status: 'Under Review' as const,
          lastModified: new Date().toISOString(),
          versions: [newVer, ...d.versions]
        };
      }
      return d;
    });

    setDocuments(updated);
    setShowNewRevisionModal(false);
    setNewRevisionSummary('');
  };

  const getFileIcon = (fileType: CollaborationDocument['fileType']) => {
    switch (fileType) {
      case 'STEP':
      case 'DWG':
        return <Box className="w-4 h-4 text-amber-600" />;
      case 'GERBER':
      case 'SCHEMATIC':
        return <FileCode className="w-4 h-4 text-emerald-600" />;
      case 'BOM_CSV':
        return <FileSpreadsheet className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div id="document-collaboration-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Document Repository Explorer (5 Cols on LG) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Filter Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Document Master Control
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {filteredDocs.length}
              </span>
            </h3>
            <button
              onClick={() => setShowNewRevisionModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Revision
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search document #, CAD name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              aria-label="Filter documents by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600 truncate"
            >
              <option value="all">All Categories</option>
              <option value="CAD & Mechanical">CAD & Mechanical</option>
              <option value="PCB & Gerber EDA">PCB & Gerber EDA</option>
              <option value="BOM & Schematics">BOM & Schematics</option>
              <option value="Work Instructions">Work Instructions</option>
              <option value="Quality & Test Plans">Quality & Test Plans</option>
            </select>

            <select
              aria-label="Filter documents by program"
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600 truncate"
            >
              <option value="all">All Programs</option>
              <option value="PRG-AVN-401">PRG-AVN-401 (Avionics)</option>
              <option value="PRG-MED-202">PRG-MED-202 (Medical)</option>
              <option value="PRG-IOT-801">PRG-IOT-801 (IoT)</option>
            </select>
          </div>
        </div>

        {/* Document Items List */}
        <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredDocs.map(doc => {
            const isSelected = doc.id === activeDoc?.id;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="p-1 bg-slate-100 rounded text-slate-700">
                      {getFileIcon(doc.fileType)}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-700">
                      {doc.documentNumber}
                    </span>
                    {doc.isBaselineLocked && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Lock className="w-2.5 h-2.5" />
                        Baseline Locked
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'Baseline Released' ? 'bg-emerald-100 text-emerald-800' :
                    doc.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                    doc.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                  {doc.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {doc.currentVersion}
                    </span>
                    <span>{doc.category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <PenTool className="w-3 h-3" />
                    <span>{doc.annotations.length} markups</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Document Detail, Versioning, Approval Workflow & Markup Triggers (7 Cols on LG) */}
      <div className="lg:col-span-7 space-y-4">
        {activeDoc ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-6 text-left">
            {/* Header with Badges & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {activeDoc.documentNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {activeDoc.programCode} &bull; {activeDoc.programName}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Classification: <strong className="text-slate-700">{activeDoc.securityClassification}</strong>
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {activeDoc.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeDoc.description}
                </p>
              </div>

              {/* Baseline Lock Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <button
                  onClick={() => setAnnotatingDoc(activeDoc)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  <PenTool className="w-4 h-4" />
                  Review & Markup ({activeDoc.annotations.length})
                </button>

                <button
                  onClick={handleToggleBaselineLock}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    activeDoc.isBaselineLocked
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {activeDoc.isBaselineLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  {activeDoc.isBaselineLocked ? 'Baseline Locked' : 'Mark as Baseline'}
                </button>
              </div>
            </div>

            {/* SECTION 1: Multi-Stage Approval Workflow */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Multi-Tier Engineering Approval Workflow
                </h4>
                <span className="text-xs text-slate-500">
                  {activeDoc.approvals.filter(a => a.status === 'approved').length} of {activeDoc.approvals.length} Signed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeDoc.approvals.map(step => {
                  const isApproved = step.status === 'approved';

                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        isApproved
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50/60 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] truncate">{step.roleTitle}</span>
                        {isApproved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px]">{step.approverName}</p>
                      {step.notes && <p className="text-[10px] text-slate-600 line-clamp-2 italic">"{step.notes}"</p>}
                      
                      {step.signedAt ? (
                        <p className="text-[10px] text-emerald-700 font-mono">
                          Signed: {new Date(step.signedAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <button
                          onClick={() => handleApproveStep(step.id)}
                          className="w-full mt-1 py-1 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[10px] shadow-2xs transition-colors"
                        >
                          Sign & Approve
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Document Versioning History & Baseline Registry */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                File Versioning & Revision History
              </h4>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {activeDoc.versions.map((ver, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/40 hover:bg-indigo-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                          {ver.version}
                        </span>
                        {ver.isBaseline && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Production Baseline
                          </span>
                        )}
                        <span className="text-slate-400 font-mono text-[11px]">
                          {new Date(ver.releaseDate).toLocaleDateString()} &bull; {ver.fileSize}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs font-medium">
                        {ver.changeSummary}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Released by: <strong>{ver.authorName}</strong> ({ver.authorRole})
                        {ver.baselineApprovedBy && <span> &bull; Baseline Signoff: {ver.baselineApprovedBy}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Review Annotations Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                  Active Markup & Review Callouts
                </span>
                <button
                  onClick={() => setAnnotatingDoc(activeDoc)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Open Visual Markup Canvas &rarr;
                </button>
              </div>
              <p className="text-xs text-slate-500">
                {activeDoc.annotations.length} annotations logged across Rev {activeDoc.currentVersion}. All pin notes and box highlights are indexed in the engineering audit history.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
            Select a document from the left explorer pane.
          </div>
        )}
      </div>

      {/* ANNOTATION MODAL */}
      {annotatingDoc && (
        <DocumentAnnotationModal
          document={annotatingDoc}
          currentUser={currentUser}
          currentRole={currentRole}
          onClose={() => setAnnotatingDoc(null)}
          onSaveAnnotation={handleSaveAnnotation}
          onResolveAnnotation={handleResolveAnnotation}
          onAddReply={handleAddReplyToAnnotation}
        />
      )}

      {/* NEW REVISION UPLOAD MODAL */}
      {showNewRevisionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Upload New Revision</h3>
              </div>
              <button
                onClick={() => setShowNewRevisionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUploadNewRevision} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Document</label>
                <p className="p-2 bg-slate-100 text-slate-800 rounded font-mono font-medium">
                  {activeDoc?.documentNumber} &bull; {activeDoc?.title}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Version Tag</label>
                <input
                  type="text"
                  required
                  value={newRevisionVersion}
                  onChange={(e) => setNewRevisionVersion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Engineering Change Summary (ECO)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe key routing deltas, component footprint replacements, or impedance tuning..."
                  value={newRevisionSummary}
                  onChange={(e) => setNewRevisionSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-slate-500">
                <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                <p className="font-semibold text-slate-700">Drag & drop STEP / Gerber / PDF package</p>
                <p className="text-[10px] text-slate-400">or click to browse local files (Max 250MB)</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewRevisionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Release Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
