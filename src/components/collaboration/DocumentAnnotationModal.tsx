import React, { useState, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  Square,
  MapPin,
  Highlighter,
  Check,
  CheckCircle2,
  Trash2,
  Send,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  PenTool
} from 'lucide-react';
import { CollaborationDocument, DocumentAnnotation, AnnotationReply, User, Role } from '../../types';

interface DocumentAnnotationModalProps {
  document: CollaborationDocument;
  currentUser: User | null;
  currentRole: Role | null;
  onClose: () => void;
  onSaveAnnotation: (annotation: DocumentAnnotation) => void;
  onResolveAnnotation: (annotationId: string) => void;
  onAddReply: (annotationId: string, replyText: string) => void;
}

export function DocumentAnnotationModal({
  document,
  currentUser,
  currentRole,
  onClose,
  onSaveAnnotation,
  onResolveAnnotation,
  onAddReply
}: DocumentAnnotationModalProps) {
  const [activeTool, setActiveTool] = useState<'pin' | 'box' | 'highlight' | 'view'>('pin');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(
    document.annotations[0]?.id || null
  );
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Temporary markup drawing state
  const [isPlacing, setIsPlacing] = useState(false);
  const [tempCoords, setTempCoords] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'view') return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setTempCoords({ x, y });
    setIsPlacing(true);
  };

  const handleCreateAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempCoords || !newCommentText.trim()) return;

    const newAnn: DocumentAnnotation = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      documentId: document.id,
      version: document.currentVersion,
      authorName: currentUser?.name || 'Current User',
      authorRole: currentRole?.name || 'Engineer',
      authorAvatar: currentUser?.avatar,
      xPercent: parseFloat(tempCoords.x.toFixed(2)),
      yPercent: parseFloat(tempCoords.y.toFixed(2)),
      pageNumber: 1,
      type: activeTool === 'view' ? 'pin' : activeTool,
      widthPercent: activeTool === 'box' ? 15 : undefined,
      heightPercent: activeTool === 'box' ? 10 : undefined,
      comment: newCommentText.trim(),
      createdAt: new Date().toISOString(),
      status: 'open',
      replies: []
    };

    onSaveAnnotation(newAnn);
    setSelectedAnnotationId(newAnn.id);
    setNewCommentText('');
    setTempCoords(null);
    setIsPlacing(false);
    setActiveTool('view');
  };

  const handlePostReply = (annId: string) => {
    const text = replyInputs[annId];
    if (!text || !text.trim()) return;
    onAddReply(annId, text.trim());
    setReplyInputs(prev => ({ ...prev, [annId]: '' }));
  };

  const selectedAnnotation = document.annotations.find(a => a.id === selectedAnnotationId);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{document.title}</h3>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {document.currentVersion}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {document.documentNumber} &bull; Classification: {document.securityClassification}
              </p>
            </div>
          </div>

          {/* Canvas Markup Tools */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              onClick={() => setActiveTool('view')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTool === 'view' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Inspect & Select Annotations"
            >
              <Eye className="w-4 h-4" />
              Select
            </button>
            <button
              onClick={() => setActiveTool('pin')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTool === 'pin' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Place Comment Pin"
            >
              <MapPin className="w-4 h-4" />
              Pin Note
            </button>
            <button
              onClick={() => setActiveTool('box')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTool === 'box' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Box Region"
            >
              <Square className="w-4 h-4" />
              Box Area
            </button>
            <button
              onClick={() => setActiveTool('highlight')}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTool === 'highlight' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Highlighter"
            >
              <Highlighter className="w-4 h-4" />
              Highlight
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button
              onClick={() => setZoomLevel(prev => Math.max(60, prev - 15))}
              className="p-1 text-slate-500 hover:text-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-slate-600 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
              className="p-1 text-slate-500 hover:text-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl font-bold px-2"
          >
            &times;
          </button>
        </div>

        {/* Modal Body: Left Canvas / Right Annotation Threads */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT: Drawing Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900 p-4 overflow-auto flex items-center justify-center relative select-none">
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              className={`relative bg-slate-950 border border-slate-700 rounded-xl shadow-2xl transition-transform duration-150 overflow-hidden w-[720px] h-[520px] ${
                activeTool !== 'view' ? 'cursor-crosshair' : 'cursor-default'
              }`}
            >
              {/* Simulated Engineering CAD / Schematic Blueprint Background */}
              <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
              
              {/* Blueprint Vectors & Graphics */}
              <div className="absolute inset-4 border border-cyan-500/30 rounded-lg p-6 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start text-cyan-400/80 font-mono text-[10px]">
                  <div>
                    <p className="font-bold text-cyan-300">NEXGILE-CAD-LAYER: 12-LAYER RIGID FLEX</p>
                    <p>SCALE: 1:1.0 &bull; UNITS: mm &bull; TOLERANCE: &plusmn;0.05mm</p>
                  </div>
                  <div className="text-right">
                    <p>REV: 2.2 BASELINE</p>
                    <p>DWG NO: {document.documentNumber}</p>
                  </div>
                </div>

                {/* PCBA Schematics / Outline Overlay SVG */}
                <div className="my-auto flex items-center justify-center">
                  <svg className="w-full h-64 text-cyan-400/70" viewBox="0 0 500 240" fill="none" stroke="currentColor">
                    {/* Board Outline */}
                    <rect x="20" y="20" width="460" height="200" rx="8" strokeWidth="2" strokeDasharray="6 2" className="text-emerald-400/60" />
                    {/* BGA FPGA SoC */}
                    <rect x="180" y="70" width="90" height="90" rx="4" strokeWidth="1.5" className="text-amber-400/80" fill="rgba(245, 158, 11, 0.08)" />
                    <text x="225" y="120" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace">U102 FPGA</text>
                    {/* Decoupling Caps Around BGA */}
                    <circle cx="165" cy="80" r="4" fill="#38bdf8" />
                    <circle cx="165" cy="100" r="4" fill="#38bdf8" />
                    <circle cx="165" cy="120" r="4" fill="#38bdf8" />
                    <circle cx="165" cy="140" r="4" fill="#38bdf8" />
                    <text x="145" y="115" textAnchor="end" fill="#38bdf8" fontSize="8" fontFamily="monospace">C104-C112</text>
                    {/* Mil-Spec Connectors */}
                    <rect x="420" y="50" width="50" height="60" rx="4" strokeWidth="1.5" className="text-purple-400/80" fill="rgba(168, 85, 247, 0.08)" />
                    <text x="445" y="85" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace">J1 MIL</text>
                    {/* High-Speed Bus Traces */}
                    <path d="M 270 100 L 340 100 L 360 70 L 420 70" strokeWidth="1.2" stroke="#38bdf8" strokeDasharray="3 1" />
                    <path d="M 270 115 L 340 115 L 360 85 L 420 85" strokeWidth="1.2" stroke="#38bdf8" strokeDasharray="3 1" />
                    {/* Heatsink Mounting Holes */}
                    <circle cx="50" cy="45" r="7" strokeWidth="1.5" className="text-rose-400" />
                    <circle cx="50" cy="195" r="7" strokeWidth="1.5" className="text-rose-400" />
                    <circle cx="450" cy="195" r="7" strokeWidth="1.5" className="text-rose-400" />
                  </svg>
                </div>

                <div className="flex justify-between items-end text-cyan-400/60 font-mono text-[9px]">
                  <span>CONFIDENTIAL: DO-254 / AS9100 COMPLIANT</span>
                  <span>CAD VIEWER ENGINE V3.4</span>
                </div>
              </div>

              {/* Render Existing Annotations */}
              {document.annotations.map(ann => {
                const isSelected = ann.id === selectedAnnotationId;
                const isResolved = ann.status === 'resolved';

                return (
                  <div
                    key={ann.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnnotationId(ann.id);
                    }}
                    style={{
                      left: `${ann.xPercent}%`,
                      top: `${ann.yPercent}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute cursor-pointer transition-all z-20 group ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {ann.type === 'box' ? (
                      <div
                        style={{
                          width: `${ann.widthPercent || 15 * 6.5}px`,
                          height: `${ann.heightPercent || 10 * 5}px`
                        }}
                        className={`border-2 rounded flex items-start p-1 ${
                          isResolved
                            ? 'border-emerald-400 bg-emerald-500/20'
                            : 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/40'
                        }`}
                      >
                        <span className="bg-amber-400 text-slate-950 font-bold text-[9px] px-1 rounded shadow-xs">
                          {ann.id}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 ${
                          isResolved
                            ? 'bg-emerald-600 border-emerald-300'
                            : 'bg-rose-600 border-white ring-4 ring-rose-500/30 animate-pulse'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Tooltip on Hover */}
                    <div className="hidden group-hover:block absolute left-1/2 -top-8 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md pointer-events-none border border-slate-700">
                      {ann.authorName}: {ann.comment.slice(0, 30)}...
                    </div>
                  </div>
                );
              })}

              {/* Temporary Placement Marker */}
              {tempCoords && (
                <div
                  style={{
                    left: `${tempCoords.x}%`,
                    top: `${tempCoords.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute w-8 h-8 rounded-full bg-indigo-500/80 border-2 border-white ring-4 ring-indigo-300 animate-bounce flex items-center justify-center text-white text-xs z-30"
                >
                  <MapPin className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Annotation Thread List & Review Comments (4 Cols) */}
          <div className="lg:col-span-4 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Markup Annotations ({document.annotations.length})
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {document.annotations.filter(a => a.status === 'open').length} Open
              </span>
            </div>

            {/* If user clicked canvas to add new annotation */}
            {isPlacing && tempCoords && (
              <div className="p-3 bg-indigo-50 border-b border-indigo-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    New Pin at ({tempCoords.x.toFixed(1)}%, {tempCoords.y.toFixed(1)}%)
                  </span>
                  <button
                    onClick={() => {
                      setIsPlacing(false);
                      setTempCoords(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleCreateAnnotation} className="space-y-2">
                  <textarea
                    rows={2}
                    required
                    autoFocus
                    placeholder="Enter review feedback, DFM clearance requirement, or ECO markup..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-md shadow-xs hover:bg-indigo-700"
                    >
                      Attach Markup Note
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Annotation Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {document.annotations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No annotations on this document yet. Click 'Pin Note' or 'Box Area' to review specific coordinates.
                </div>
              ) : (
                document.annotations.map(ann => {
                  const isSelected = ann.id === selectedAnnotationId;
                  const isResolved = ann.status === 'resolved';

                  return (
                    <div
                      key={ann.id}
                      onClick={() => setSelectedAnnotationId(ann.id)}
                      className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-indigo-200 bg-white'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isResolved ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="font-bold text-slate-900">{ann.authorName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">({ann.authorRole})</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveAnnotation(ann.id);
                          }}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          {isResolved ? 'Resolved' : 'Resolve'}
                        </button>
                      </div>

                      {/* Comment text */}
                      <p className="text-slate-800 text-xs mb-2 leading-relaxed">{ann.comment}</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                        <span>Coord: ({ann.xPercent}%, {ann.yPercent}%)</span>
                        <span>{new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Replies */}
                      {ann.replies && ann.replies.length > 0 && (
                        <div className="mt-2 pl-2 border-l-2 border-indigo-200 space-y-1.5 pt-1">
                          {ann.replies.map(rep => (
                            <div key={rep.id} className="text-[11px] bg-white p-2 rounded border border-slate-100 shadow-2xs">
                              <span className="font-bold text-slate-800">{rep.authorName}: </span>
                              <span className="text-slate-600">{rep.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input */}
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            placeholder="Reply to this annotation..."
                            value={replyInputs[ann.id] || ''}
                            onChange={(e) => setReplyInputs({ ...replyInputs, [ann.id]: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostReply(ann.id)}
                            className="flex-1 text-[11px] px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none focus:border-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostReply(ann.id)}
                            className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
