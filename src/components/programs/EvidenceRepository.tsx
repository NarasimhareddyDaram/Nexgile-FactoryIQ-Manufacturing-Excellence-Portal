import React, { useState } from 'react';
import { EvidenceFile, Program, Role, User } from '../../types';
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Image as ImageIcon,
  Layers,
  Plus,
  RotateCw,
  Search,
  ShieldCheck,
  Tag,
  Upload,
  UploadCloud,
  Video,
  X,
  XCircle,
  AlertCircle,
  FileIcon
} from 'lucide-react';

interface EvidenceRepositoryProps {
  evidenceFiles: EvidenceFile[];
  programs: Program[];
  selectedProgram?: Program | null;
  currentRole: Role | null;
  currentUser: User | null;
}

export function EvidenceRepository({
  evidenceFiles,
  programs,
  selectedProgram,
  currentRole,
  currentUser
}: EvidenceRepositoryProps) {
  const [localFiles, setLocalFiles] = useState<EvidenceFile[]>(evidenceFiles);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSignOffStatus, setSelectedSignOffStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewFile, setActivePreviewFile] = useState<EvidenceFile | null>(null);

  // Drag and drop upload state
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<EvidenceFile['category']>('test_results');
  const [newFileDesc, setNewFileDesc] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      setNewFileTitle(file.name.replace(/\.[^/.]+$/, ''));
      setShowUploadModal(true);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setNewFileTitle(file.name.replace(/\.[^/.]+$/, ''));
      setShowUploadModal(true);
    }
  };

  const handleSaveUploadedFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle) return;

    const ext = uploadedFileName.split('.').pop()?.toLowerCase() || 'pdf';
    const newFile: EvidenceFile = {
      id: `ev-${Date.now()}`,
      programId: selectedProgram?.id || 'prog-001',
      programCode: selectedProgram?.code || 'NX-VM-BMS-G3',
      title: newFileTitle,
      category: newFileCategory,
      fileType: ext === 'png' || ext === 'jpg' ? (ext as any) : ext === 'mp4' ? 'mp4' : ext === 'csv' ? 'csv' : 'pdf',
      fileName: uploadedFileName || `${newFileTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '4.5 MB',
      uploadDate: '2026-08-27',
      uploadedBy: currentUser?.name || 'Dr. Anita Joshi',
      uploadedByRole: currentRole?.name || 'Quality Engineering',
      signOffStatus: 'pending',
      description: newFileDesc || 'Uploaded quality verification artifact.',
      tags: ['New Upload', newFileCategory.toUpperCase(), '2026-Q3']
    };

    setLocalFiles([newFile, ...localFiles]);
    setShowUploadModal(false);
    setNewFileTitle('');
    setNewFileDesc('');
    setUploadedFileName('');
  };

  const handleSignOff = (fileId: string, newStatus: 'approved' | 'rejected') => {
    setLocalFiles(prev =>
      prev.map(f => {
        if (f.id !== fileId) return f;
        return {
          ...f,
          signOffStatus: newStatus,
          signedBy: currentUser?.name ? `${currentUser.name} (${currentRole?.name})` : 'Sarah Lin (Customer PM)',
          signOffDate: '2026-08-27'
        };
      })
    );

    if (activePreviewFile && activePreviewFile.id === fileId) {
      setActivePreviewFile({
        ...activePreviewFile,
        signOffStatus: newStatus,
        signedBy: currentUser?.name ? `${currentUser.name} (${currentRole?.name})` : 'Sarah Lin (Customer PM)',
        signOffDate: '2026-08-27'
      });
    }
  };

  const filteredFiles = localFiles.filter(f => {
    const matchSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchSign = selectedSignOffStatus === 'all' || f.signOffStatus === selectedSignOffStatus;
    return matchSearch && matchCat && matchSign;
  });

  const getSignOffBadge = (status: EvidenceFile['signOffStatus']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
            <Clock className="h-3.5 w-3.5" /> Under Review
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
            <Clock className="h-3.5 w-3.5" /> Pending Sign-off
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
    }
  };

  const getCategoryIcon = (category: EvidenceFile['category'], fileType: string) => {
    if (fileType === 'mp4') return <Video className="h-5 w-5 text-indigo-600" />;
    if (fileType === 'png' || fileType === 'jpg') return <ImageIcon className="h-5 w-5 text-emerald-600" />;
    if (fileType === 'csv' || fileType === 'xlsx') return <FileSpreadsheet className="h-5 w-5 text-teal-600" />;
    return <FileText className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/50'
        }`}
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <input
          id="file-upload-input"
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Upload Evidence Artifact or Inspection Dossier
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Drag & drop Test Plans, Telemetry CSVs, FAI/PPAP PDFs, or Microscopic Photos & Videos here, or{' '}
          <span className="font-bold text-indigo-600 underline">browse files</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          Supports: PDF, CSV, XLSX, PNG, JPG, MP4, STEP (Up to 250 MB per dossier)
        </p>
      </div>

      {/* Filter and Category Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search evidence by title, filename, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="test_plans">Test Plans & Protocols</option>
                <option value="test_results">Test Results & Telemetry</option>
                <option value="fai_ppap">FAI / PPAP Readiness</option>
                <option value="photos_videos">Photos & High-Speed Video</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Sign-Off:</span>
              <select
                value={selectedSignOffStatus}
                onChange={(e) => setSelectedSignOffStatus(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="all">All Sign-Off Statuses</option>
                <option value="approved">Approved</option>
                <option value="under_review">Under Review</option>
                <option value="pending">Pending Sign-off</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => {
          const isMedia = file.fileType === 'png' || file.fileType === 'jpg' || file.fileType === 'mp4';

          return (
            <div
              key={file.id}
              className="group rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Media Thumbnail preview if photo or video */}
                {isMedia && (file.thumbnailUrl || file.previewUrl) ? (
                  <div
                    onClick={() => setActivePreviewFile(file)}
                    className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={file.thumbnailUrl || file.previewUrl}
                      alt={file.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-semibold flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> Click to Inspect Full Resolution
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      {getSignOffBadge(file.signOffStatus)}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 pb-0 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                      {getCategoryIcon(file.category, file.fileType)}
                    </div>
                    {getSignOffBadge(file.signOffStatus)}
                  </div>
                )}

                {/* Content Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {file.programCode}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {file.fileType.toUpperCase()} • {file.fileSize}
                    </span>
                  </div>

                  <h4
                    onClick={() => setActivePreviewFile(file)}
                    className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                  >
                    {file.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {file.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {file.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                    <p>Uploaded by: <strong className="text-slate-700">{file.uploadedBy}</strong> ({file.uploadDate})</p>
                    {file.signedBy && (
                      <p className="text-emerald-700 font-semibold">
                        Signed: {file.signedBy} ({file.signOffDate})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActivePreviewFile(file)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspect & Sign-Off</span>
                </button>
                <button
                  onClick={() => alert(`Downloading artifact: ${file.fileName} (${file.fileSize})`)}
                  title="Download File"
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Preview & Digital Sign-Off Modal */}
      {activePreviewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {activePreviewFile.programCode}
                  </span>
                  {getSignOffBadge(activePreviewFile.signOffStatus)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {activePreviewFile.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Media Image / Scan viewer */}
            {(activePreviewFile.previewUrl || activePreviewFile.thumbnailUrl) && (
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-96">
                <img
                  src={activePreviewFile.previewUrl || activePreviewFile.thumbnailUrl}
                  alt={activePreviewFile.title}
                  referrerPolicy="no-referrer"
                  className="max-h-96 w-auto object-contain"
                />
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-200/60">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Filename</p>
                <p className="font-bold text-slate-800 truncate">{activePreviewFile.fileName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">File Size</p>
                <p className="font-bold text-slate-800">{activePreviewFile.fileSize}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Uploaded By</p>
                <p className="font-bold text-slate-800 truncate">{activePreviewFile.uploadedBy}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Upload Date</p>
                <p className="font-bold text-slate-800">{activePreviewFile.uploadDate}</p>
              </div>
            </div>

            {/* Description / Findings */}
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">Engineering Artifact Summary & Compliance Findings:</p>
              <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                {activePreviewFile.description}
              </p>
            </div>

            {/* Sign-off Actions Strip */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {activePreviewFile.signedBy ? (
                  <span className="font-semibold text-emerald-700">
                    Officially Signed Off by {activePreviewFile.signedBy} on {activePreviewFile.signOffDate}
                  </span>
                ) : (
                  <span>Awaiting formal customer / quality stakeholder sign-off review.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSignOff(activePreviewFile.id, 'rejected')}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleSignOff(activePreviewFile.id, 'approved')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approve & Sign-Off Artifact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload Evidence Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUploadedFile} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Document Title</label>
                <input
                  type="text"
                  required
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="test_plans">Test Plans & Protocols</option>
                  <option value="test_results">Test Results & Telemetry Logs</option>
                  <option value="fai_ppap">FAI / PPAP Readiness Dossier</option>
                  <option value="photos_videos">Inspection Photos & Videos</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description & Test Protocol Notes</label>
                <textarea
                  rows={2}
                  value={newFileDesc}
                  onChange={(e) => setNewFileDesc(e.target.value)}
                  placeholder="Summarize test conditions, sample count, or inspection standard..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload & Stage for Sign-Off</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
