import React, { useState } from 'react';
import {
  MessageSquare,
  FileText,
  Box,
  BookOpen,
  Sparkles,
  Layers,
  Shield,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Role, User } from '../../types';
import { ProjectThreadsTab } from './ProjectThreadsTab';
import { DocumentCollaborationTab } from './DocumentCollaborationTab';
import { EngineeringViewersTab } from './EngineeringViewersTab';
import { KnowledgeBaseTab } from './KnowledgeBaseTab';

interface CollaborationPageProps {
  currentRole: Role | null;
  currentUser: User | null;
}

type CollaborationTabId = 'threads' | 'documents' | 'viewers' | 'knowledge';

export function CollaborationPage({ currentRole, currentUser }: CollaborationPageProps) {
  const [activeTab, setActiveTab] = useState<CollaborationTabId>('threads');

  return (
    <div id="collaboration-page-root" className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Collaboration, Documents & Knowledge Base
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 max-w-3xl leading-relaxed">
            Centralized engineering collaboration hub: project-scoped communication threads, baseline document version control, embedded 3D CAD / Gerber EDA viewers, interactive BOM availability signals, and technical standard operating procedures.
          </p>
        </div>

        {/* Global Hub Telemetry */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl shrink-0 text-xs">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Docs</span>
            <span className="font-bold text-slate-900 font-mono">14 Active</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA Commitment</span>
            <span className="font-bold text-emerald-700 font-mono">99.8% On-Time</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('threads')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'threads'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          1. Project Communication Threads
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          2. Document Versioning & Approvals
        </button>

        <button
          onClick={() => setActiveTab('viewers')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'viewers'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Box className="w-4 h-4" />
          3. 3D CAD, Gerber & Interactive BOM
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'knowledge'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          4. Knowledge Base, FAQs & Contact SLAs
        </button>
      </div>

      {/* Tab View Container */}
      <div className="pt-2">
        {activeTab === 'threads' && (
          <ProjectThreadsTab currentRole={currentRole} currentUser={currentUser} />
        )}
        {activeTab === 'documents' && (
          <DocumentCollaborationTab currentRole={currentRole} currentUser={currentUser} />
        )}
        {activeTab === 'viewers' && (
          <EngineeringViewersTab currentRole={currentRole} currentUser={currentUser} />
        )}
        {activeTab === 'knowledge' && (
          <KnowledgeBaseTab currentRole={currentRole} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}
