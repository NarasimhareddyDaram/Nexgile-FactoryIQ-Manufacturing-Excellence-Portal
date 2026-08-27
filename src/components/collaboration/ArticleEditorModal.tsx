import React, { useState } from 'react';
import {
  BookOpen,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Quote,
  Eye,
  Edit3,
  Save,
  Tag,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { KnowledgeArticle, Role, User } from '../../types';

interface ArticleEditorModalProps {
  articleToEdit?: KnowledgeArticle | null;
  currentUser: User | null;
  currentRole: Role | null;
  onClose: () => void;
  onSaveArticle: (article: KnowledgeArticle) => void;
}

export function ArticleEditorModal({
  articleToEdit,
  currentUser,
  currentRole,
  onClose,
  onSaveArticle
}: ArticleEditorModalProps) {
  const isEditing = !!articleToEdit;

  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [category, setCategory] = useState<KnowledgeArticle['category']>(
    articleToEdit?.category || 'Manufacturing Processes'
  );
  const [summary, setSummary] = useState(articleToEdit?.summary || '');
  const [contentMarkdown, setContentMarkdown] = useState(articleToEdit?.contentMarkdown || '');
  const [tagsInput, setTagsInput] = useState(articleToEdit?.tags.join(', ') || 'SMT, Process, ISO');
  const [readTime, setReadTime] = useState(articleToEdit?.readTimeMinutes || 5);
  const [previewMode, setPreviewMode] = useState<'write' | 'preview' | 'split'>('split');

  const handleInsertFormat = (prefix: string, suffix: string = '') => {
    setContentMarkdown(prev => prev + `\n${prefix}Text${suffix}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentMarkdown.trim()) return;

    const savedArticle: KnowledgeArticle = {
      id: articleToEdit?.id || `KB-ART-${Date.now().toString().slice(-4)}`,
      slug: (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'kb-article',
      title: title.trim(),
      category,
      authorName: articleToEdit?.authorName || (currentUser?.name || 'Current User'),
      authorRole: articleToEdit?.authorRole || (currentRole?.name || 'Engineer'),
      lastUpdated: new Date().toISOString().split('T')[0],
      version: isEditing ? `v${(parseFloat(articleToEdit.version.replace('v', '')) + 0.1).toFixed(1)}` : 'v1.0',
      readTimeMinutes: Number(readTime),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      summary: summary.trim(),
      contentMarkdown: contentMarkdown.trim(),
      isFeatured: articleToEdit?.isFeatured || false,
      viewsCount: articleToEdit?.viewsCount || 1,
      helpfulVotes: articleToEdit?.helpfulVotes || 0
    };

    onSaveArticle(savedArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isEditing ? `Edit Article: ${articleToEdit?.title}` : 'Publish New Technical Knowledge Article'}
              </h3>
              <p className="text-xs text-slate-500">
                Author: <strong>{currentUser?.name || 'User'}</strong> &bull; Role: {currentRole?.name || 'Engineer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setPreviewMode('write')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  previewMode === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('split')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  previewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('preview')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  previewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold px-2"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata Controls */}
          <div className="p-4 border-b border-slate-200 bg-white grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. SMT Reflow Profiling & Thermal Soak Optimization..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
              >
                <option value="Manufacturing Processes">Manufacturing Processes</option>
                <option value="EMS Capabilities">EMS Capabilities</option>
                <option value="Test Procedures">Test Procedures</option>
                <option value="Training & Certifications">Training & Certifications</option>
                <option value="Quality Standards">Quality Standards</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="SMT, Reflow, SAC305, IPC"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-slate-700 font-semibold mb-1">Summary / Abstract</label>
              <input
                type="text"
                placeholder="Brief single-sentence executive summary of the standard operating guideline..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          <div className="p-2 border-b border-slate-200 bg-slate-50/70 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleInsertFormat('### ', '')}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded font-bold"
              title="Heading 3"
            >
              <Heading className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertFormat('**', '**')}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded font-bold"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertFormat('*', '*')}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded italic"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertFormat('* ', '')}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded"
              title="Bullet Item"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertFormat('```\n', '\n```')}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded font-mono"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertFormat('> ', '')}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded"
              title="Callout Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Editor / Live Preview Panes */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* WRITE PANE */}
            {(previewMode === 'write' || previewMode === 'split') && (
              <div className={`p-4 overflow-y-auto bg-slate-900 text-slate-100 font-mono text-xs ${previewMode === 'write' ? 'md:col-span-2' : ''}`}>
                <textarea
                  rows={20}
                  required
                  value={contentMarkdown}
                  onChange={(e) => setContentMarkdown(e.target.value)}
                  placeholder="Type Markdown content here (Headers ###, lists *, bold **, tables | ...)..."
                  className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-100 leading-relaxed font-mono"
                />
              </div>
            )}

            {/* PREVIEW PANE */}
            {(previewMode === 'preview' || previewMode === 'split') && (
              <div className={`p-6 overflow-y-auto bg-white text-slate-900 border-l border-slate-200 prose prose-slate max-w-none text-xs leading-relaxed ${previewMode === 'preview' ? 'md:col-span-2' : ''}`}>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      {category}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2 mb-1">{title || 'Untitled Article'}</h2>
                    <p className="text-slate-500 text-xs italic">{summary}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 whitespace-pre-wrap font-sans text-xs text-slate-800 space-y-2">
                    {contentMarkdown || 'Markdown preview will appear here as you type...'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Revision: <strong className="font-mono text-slate-800">{isEditing ? articleToEdit.version : 'v1.0 (New)'}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isEditing ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
