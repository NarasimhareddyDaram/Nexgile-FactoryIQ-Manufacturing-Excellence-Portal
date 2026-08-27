import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Paperclip,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  AtSign,
  Smile,
  FileText,
  Download,
  Users,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { Role, User, ProjectThread, ThreadComment, ThreadAttachment } from '../../types';
import { INITIAL_PROJECT_THREADS } from '../../data/collaborationData';

interface ProjectThreadsTabProps {
  currentRole: Role | null;
  currentUser: User | null;
}

export function ProjectThreadsTab({ currentRole, currentUser }: ProjectThreadsTabProps) {
  const [threads, setThreads] = useState<ProjectThread[]>(INITIAL_PROJECT_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(INITIAL_PROJECT_THREADS[0].id);
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New Comment State
  const [commentText, setCommentText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ThreadAttachment[]>([]);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  // New Thread Form State
  const [newThreadProgram, setNewThreadProgram] = useState('PRG-AVN-401');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState<ProjectThread['category']>('DFM & Design');
  const [newThreadPriority, setNewThreadPriority] = useState<ProjectThread['priority']>('medium');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('DFM, Review');

  // Filtered Threads
  const filteredThreads = threads.filter(t => {
    if (selectedProgramFilter !== 'all' && t.programCode !== selectedProgramFilter) return false;
    if (selectedCategoryFilter !== 'all' && t.category !== selectedCategoryFilter) return false;
    if (selectedStatusFilter !== 'all' && t.status !== selectedStatusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchTags = t.tags.some(tag => tag.toLowerCase().includes(q));
      const matchProgram = t.programName.toLowerCase().includes(q) || t.programCode.toLowerCase().includes(q);
      const matchAuthor = t.createdBy.toLowerCase().includes(q);
      const matchComments = t.comments.some(c => c.content.toLowerCase().includes(q) || c.authorName.toLowerCase().includes(q));
      return matchTitle || matchTags || matchProgram || matchAuthor || matchComments;
    }
    return true;
  });

  const activeThread = threads.find(t => t.id === selectedThreadId) || filteredThreads[0] || threads[0];

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && pendingAttachments.length === 0) return;
    if (!activeThread) return;

    const newComment: ThreadComment = {
      id: `cmt-${Date.now()}`,
      threadId: activeThread.id,
      authorId: currentUser?.id || 'usr-me',
      authorName: currentUser?.name || 'Current User',
      authorRole: currentRole?.name || 'Customer Program Manager',
      authorCompany: currentUser?.company || 'AeroSys Defense',
      authorAvatar: currentUser?.avatar,
      content: commentText.trim(),
      mentions: ['David Kim', 'Sarah Chen'],
      attachments: [...pendingAttachments],
      reactions: [],
      createdAt: new Date().toISOString()
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastActivity: new Date().toISOString(),
          commentsCount: t.commentsCount + 1,
          comments: [...t.comments, newComment]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setCommentText('');
    setPendingAttachments([]);
  };

  const handleToggleReaction = (commentId: string, emoji: string) => {
    if (!activeThread) return;
    const currentUserName = currentUser?.name || 'You';

    const updatedThreads = threads.map(t => {
      if (t.id !== activeThread.id) return t;

      const updatedComments = t.comments.map(c => {
        if (c.id !== commentId) return c;

        const existingReaction = c.reactions.find(r => r.emoji === emoji);
        let newReactions;

        if (existingReaction) {
          if (existingReaction.users.includes(currentUserName)) {
            // Remove reaction
            newReactions = c.reactions
              .map(r => r.emoji === emoji ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== currentUserName) } : r)
              .filter(r => r.count > 0);
          } else {
            // Add to reaction
            newReactions = c.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, currentUserName] } : r);
          }
        } else {
          // Create new reaction
          newReactions = [...c.reactions, { emoji, count: 1, users: [currentUserName] }];
        }

        return { ...c, reactions: newReactions };
      });

      return { ...t, comments: updatedComments };
    });

    setThreads(updatedThreads);
  };

  const handleAddMockAttachment = () => {
    const mockAtt: ThreadAttachment = {
      id: `att-${Date.now()}`,
      fileName: `ECAD_Revision_Delta_${Math.floor(Math.random() * 899 + 100)}.pdf`,
      fileSize: `${(Math.random() * 3 + 0.8).toFixed(1)} MB`,
      fileType: 'PDF',
      uploadedBy: currentUser?.name || 'User',
      uploadedAt: new Date().toISOString()
    };
    setPendingAttachments(prev => [...prev, mockAtt]);
  };

  const handleCreateNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const programNameMap: Record<string, string> = {
      'PRG-AVN-401': 'Avionics Gen-4 Control Unit',
      'PRG-MED-202': 'CardioPulse Medical Monitor',
      'PRG-IOT-801': 'Industrial Edge IoT Gateway',
      'PRG-ROB-101': 'RoboArm Multi-Axis Servo Drive'
    };

    const newThread: ProjectThread = {
      id: `TH-${Date.now().toString().slice(-4)}`,
      programId: `prog-${newThreadProgram.toLowerCase()}`,
      programCode: newThreadProgram,
      programName: programNameMap[newThreadProgram] || 'Engineering Program',
      title: newThreadTitle,
      category: newThreadCategory,
      status: 'open',
      priority: newThreadPriority,
      createdBy: `${currentUser?.name || 'Current User'} (${currentRole?.name || 'Engineer'})`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      participants: [
        {
          id: currentUser?.id || 'usr-curr',
          name: currentUser?.name || 'Current User',
          role: currentRole?.name || 'Lead',
          avatar: currentUser?.avatar
        },
        {
          id: 'usr-lead-dfm',
          name: 'David Kim',
          role: 'Senior DFM Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        }
      ],
      commentsCount: 1,
      unread: false,
      tags: newThreadTags.split(',').map(t => t.trim()).filter(Boolean),
      comments: [
        {
          id: `cmt-init-${Date.now()}`,
          threadId: `TH-${Date.now().toString().slice(-4)}`,
          authorId: currentUser?.id || 'usr-curr',
          authorName: currentUser?.name || 'Current User',
          authorRole: currentRole?.name || 'Engineer',
          authorCompany: currentUser?.company || 'Nexgile Manufacturing',
          authorAvatar: currentUser?.avatar,
          content: newThreadContent,
          mentions: ['David Kim', 'Sarah Chen'],
          attachments: [],
          reactions: [],
          createdAt: new Date().toISOString()
        }
      ]
    };

    setThreads([newThread, ...threads]);
    setSelectedThreadId(newThread.id);
    setShowNewThreadModal(false);
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  const handleToggleThreadStatus = () => {
    if (!activeThread) return;
    const nextStatus: ProjectThread['status'] = activeThread.status === 'resolved' ? 'open' : 'resolved';
    const updated = threads.map(t => t.id === activeThread.id ? { ...t, status: nextStatus } : t);
    setThreads(updated);
  };

  return (
    <div id="project-threads-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Filter & Thread List (5 Cols on LG) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Controls Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Program Threads
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {filteredThreads.length}
              </span>
            </h3>
            <button
              onClick={() => setShowNewThreadModal(true)}
              id="new-thread-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Thread
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search comments, tags, authors, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <select
              aria-label="Filter by program"
              value={selectedProgramFilter}
              onChange={(e) => setSelectedProgramFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600 truncate"
            >
              <option value="all">All Programs</option>
              <option value="PRG-AVN-401">PRG-AVN-401 (Avionics)</option>
              <option value="PRG-MED-202">PRG-MED-202 (Medical)</option>
              <option value="PRG-IOT-801">PRG-IOT-801 (IoT)</option>
              <option value="PRG-ROB-101">PRG-ROB-101 (Robotics)</option>
            </select>

            <select
              aria-label="Filter by category"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600 truncate"
            >
              <option value="all">All Categories</option>
              <option value="DFM & Design">DFM & Design</option>
              <option value="Quality & CAPA">Quality & CAPA</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Assembly & NPI">Assembly & NPI</option>
              <option value="General">General</option>
            </select>

            <select
              aria-label="Filter by status"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600 truncate"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Thread List Items */}
        <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredThreads.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
              No threads found matching your filters.
            </div>
          ) : (
            filteredThreads.map(thread => {
              const isSelected = thread.id === activeThread?.id;
              const isHighOrUrgent = thread.priority === 'high' || thread.priority === 'urgent';

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {thread.programCode}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        thread.category === 'DFM & Design' ? 'bg-blue-100 text-blue-800' :
                        thread.category === 'Quality & CAPA' ? 'bg-amber-100 text-amber-800' :
                        thread.category === 'Supply Chain' ? 'bg-purple-100 text-purple-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {thread.category}
                      </span>
                      {isHighOrUrgent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 uppercase tracking-wider">
                          {thread.priority}
                        </span>
                      )}
                    </div>
                    
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      thread.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      thread.status === 'in_review' ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {thread.status === 'resolved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{thread.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
                    {thread.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {thread.comments[thread.comments.length - 1]?.content || 'No messages yet'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {thread.participants.slice(0, 3).map((p, idx) => (
                          <div
                            key={idx}
                            title={`${p.name} (${p.role})`}
                            className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-indigo-100 text-indigo-700 text-[9px] font-bold flex items-center justify-center overflow-hidden"
                          >
                            {p.avatar ? (
                              <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              p.name.charAt(0)
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-slate-500 font-medium">
                        {thread.commentsCount} {thread.commentsCount === 1 ? 'msg' : 'msgs'}
                      </span>
                    </div>

                    <span>{new Date(thread.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Thread Message History & Live Composer (7 Cols on LG) */}
      <div className="lg:col-span-7 space-y-4">
        {activeThread ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col h-[740px]">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200/80 bg-slate-50/60 rounded-t-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
                    {activeThread.programCode} &bull; {activeThread.programName}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {activeThread.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleThreadStatus}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      activeThread.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {activeThread.status === 'resolved' ? 'Resolved (Re-open)' : 'Mark Resolved'}
                  </button>
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {activeThread.title}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
                <span>Created by <strong className="text-slate-700">{activeThread.createdBy}</strong></span>
                <span>&bull;</span>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {activeThread.tags.map(t => (
                    <span key={t} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {activeThread.comments.map((comment) => {
                const isInternal = comment.authorCompany.includes('Nexgile');
                const isCurrentUser = comment.authorName === (currentUser?.name || 'Current User');

                return (
                  <div
                    key={comment.id}
                    className={`flex gap-3 text-left ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className="shrink-0">
                      {comment.authorAvatar ? (
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {comment.authorName.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Content Box */}
                    <div className={`max-w-[85%] space-y-1.5 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {/* Author Header */}
                      <div className={`flex items-center gap-2 text-[11px] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="font-bold text-slate-900">{comment.authorName}</span>
                        <span className="text-slate-500 font-medium">{comment.authorRole}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          isInternal ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {comment.authorCompany}
                        </span>
                        <span className="text-slate-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                        isCurrentUser
                          ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-xs shadow-xs'
                          : 'bg-white text-slate-800 border-slate-200 rounded-tl-xs shadow-2xs'
                      }`}>
                        <p className="whitespace-pre-wrap">{comment.content}</p>

                        {/* Attachments within Comment */}
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/40 space-y-1.5">
                            {comment.attachments.map(att => (
                              <div
                                key={att.id}
                                className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                                  isCurrentUser ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 shrink-0 text-indigo-300" />
                                  <span className="font-medium truncate">{att.fileName}</span>
                                  <span className="text-[10px] opacity-75">({att.fileSize})</span>
                                </div>
                                <button
                                  type="button"
                                  title="Download Attachment"
                                  className="p-1 hover:bg-white/20 rounded transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reactions Row */}
                      <div className={`flex items-center gap-1.5 flex-wrap ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {comment.reactions.map((rx, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleToggleReaction(comment.id, rx.emoji)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <span>{rx.emoji}</span>
                            <span className="font-semibold text-slate-700">{rx.count}</span>
                          </button>
                        ))}
                        
                        {/* Quick Reaction Triggers */}
                        <button
                          onClick={() => handleToggleReaction(comment.id, '👍')}
                          title="Like"
                          className="text-slate-400 hover:text-slate-700 text-xs px-1 hover:bg-slate-100 rounded"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleToggleReaction(comment.id, '🔍')}
                          title="Reviewing"
                          className="text-slate-400 hover:text-slate-700 text-xs px-1 hover:bg-slate-100 rounded"
                        >
                          🔍
                        </button>
                        <button
                          onClick={() => handleToggleReaction(comment.id, '🚀')}
                          title="Approved / Fast Track"
                          className="text-slate-400 hover:text-slate-700 text-xs px-1 hover:bg-slate-100 rounded"
                        >
                          🚀
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Composer Form */}
            <form onSubmit={handleSendComment} className="p-3 border-t border-slate-200 bg-white rounded-b-xl space-y-2">
              {pendingAttachments.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pb-1">
                  {pendingAttachments.map(att => (
                    <div key={att.id} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] px-2 py-1 rounded-md font-medium">
                      <Paperclip className="w-3 h-3 text-indigo-600" />
                      <span>{att.fileName}</span>
                      <button
                        type="button"
                        onClick={() => setPendingAttachments(pendingAttachments.filter(a => a.id !== att.id))}
                        className="text-indigo-400 hover:text-rose-600 font-bold ml-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Reply to ${activeThread.title}... (Use @name to notify engineering leads)`}
                  className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddMockAttachment}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-xs font-medium px-2 py-1 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    Attach File (ECAD / PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentText(prev => prev + ' @David Kim ')}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-xs font-medium px-2 py-1 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <AtSign className="w-3.5 h-3.5" />
                    Mention Lead
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim() && pendingAttachments.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
            Select a project thread from the left pane.
          </div>
        )}
      </div>

      {/* NEW THREAD MODAL */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Start New Program Thread</h3>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateNewThread} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Program</label>
                <select
                  value={newThreadProgram}
                  onChange={(e) => setNewThreadProgram(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="PRG-AVN-401">PRG-AVN-401 &bull; Avionics Gen-4 Control Unit</option>
                  <option value="PRG-MED-202">PRG-MED-202 &bull; CardioPulse Medical Monitor</option>
                  <option value="PRG-IOT-801">PRG-IOT-801 &bull; Industrial Edge IoT Gateway</option>
                  <option value="PRG-ROB-101">PRG-ROB-101 &bull; RoboArm Multi-Axis Servo Drive</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newThreadCategory}
                    onChange={(e) => setNewThreadCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="DFM & Design">DFM & Design</option>
                    <option value="Quality & CAPA">Quality & CAPA</option>
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Assembly & NPI">Assembly & NPI</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newThreadPriority}
                    onChange={(e) => setNewThreadPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Thread Title / Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stencil Aperture Ratio Revision on QFN Thermal Pad..."
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Comment / Technical Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide technical specifics, reference designators, or ECO notes..."
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="DFM, Stencil, SMT, Rev2.2"
                  value={newThreadTags}
                  onChange={(e) => setNewThreadTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
