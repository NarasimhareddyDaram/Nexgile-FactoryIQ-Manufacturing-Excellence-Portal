import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Tag,
  Clock,
  ThumbsUp,
  Eye,
  FileText,
  HelpCircle,
  Users,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowLeft,
  Sparkles,
  Edit3
} from 'lucide-react';
import { KnowledgeArticle, Role, User } from '../../types';
import { INITIAL_KNOWLEDGE_ARTICLES } from '../../data/collaborationData';
import { ArticleEditorModal } from './ArticleEditorModal';
import { FaqAccordion } from './FaqAccordion';
import { ContactSlaDirectory } from './ContactSlaDirectory';

interface KnowledgeBaseTabProps {
  currentRole: Role | null;
  currentUser: User | null;
}

type KbSection = 'articles' | 'faq' | 'contacts-sla';

export function KnowledgeBaseTab({ currentRole, currentUser }: KnowledgeBaseTabProps) {
  const [activeSection, setActiveSection] = useState<KbSection>('articles');
  const [articles, setArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Editor modal state
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = articles.filter(art => {
    if (categoryFilter !== 'all' && art.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchTag = art.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchTag;
    }
    return true;
  });

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const handleSaveArticle = (savedArticle: KnowledgeArticle) => {
    const exists = articles.some(a => a.id === savedArticle.id);
    if (exists) {
      setArticles(articles.map(a => a.id === savedArticle.id ? savedArticle : a));
    } else {
      setArticles([savedArticle, ...articles]);
    }
    setSelectedArticleId(savedArticle.id);
  };

  const handleHelpfulVote = (articleId: string) => {
    setArticles(articles.map(a => {
      if (a.id === articleId) {
        return { ...a, helpfulVotes: a.helpfulVotes + 1 };
      }
      return a;
    }));
  };

  return (
    <div id="knowledge-base-container" className="space-y-6 text-left">
      {/* Sub-navigation bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveSection('articles');
              setSelectedArticleId(null);
            }}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'articles'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Engineering Knowledge Articles
            <span className="bg-indigo-500/30 text-white text-[10px] px-1.5 py-0.2 rounded-full font-medium ml-1">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveSection('faq');
              setSelectedArticleId(null);
            }}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'faq'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Process & DFM FAQs
          </button>

          <button
            onClick={() => {
              setActiveSection('contacts-sla');
              setSelectedArticleId(null);
            }}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'contacts-sla'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Contact & SLA Directory
          </button>
        </div>

        {activeSection === 'articles' && !selectedArticle && (
          <button
            onClick={() => {
              setArticleToEdit(null);
              setShowEditorModal(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Publish New Article
          </button>
        )}
      </div>

      {/* SECTION 1: Articles Registry / Reader */}
      {activeSection === 'articles' && (
        <div>
          {selectedArticle ? (
            /* ARTICLE READER VIEW */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              {/* Back Button & Actions */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedArticleId(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Knowledge Library
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setArticleToEdit(selectedArticle);
                      setShowEditorModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Article
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(selectedArticle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    Helpful ({selectedArticle.helpfulVotes})
                  </button>
                </div>
              </div>

              {/* Article Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Rev {selectedArticle.version}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Updated: {selectedArticle.lastUpdated}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h1>

                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedArticle.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Author: <strong>{selectedArticle.authorName}</strong> ({selectedArticle.authorRole})</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {selectedArticle.readTimeMinutes} min read &bull; {selectedArticle.viewsCount} views
                  </span>
                </div>
              </div>

              {/* Markdown Content Viewer */}
              <div className="border-t border-slate-200 pt-6 prose prose-slate max-w-none text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedArticle.contentMarkdown}
              </div>

              {/* Article Tags */}
              <div className="border-t border-slate-200 pt-4 flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {selectedArticle.tags.map(t => (
                  <span key={t} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* ARTICLES BROWSER LIST */
            <div className="space-y-4">
              {/* Search & Category Filter Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search articles by process, keyword, SAC305, IPC-A-610, DFM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto text-xs">
                  <select
                    aria-label="Filter articles by category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="all">All Article Categories</option>
                    <option value="Manufacturing Processes">Manufacturing Processes</option>
                    <option value="EMS Capabilities">EMS Capabilities</option>
                    <option value="Test Procedures">Test Procedures</option>
                    <option value="Training & Certifications">Training & Certifications</option>
                    <option value="Quality Standards">Quality Standards</option>
                  </select>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map(article => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticleId(article.id)}
                    className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-3 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {article.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {article.version}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>{article.authorName}</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {article.readTimeMinutes} min
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-wrap">
                        {article.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Process & DFM FAQ Accordion */}
      {activeSection === 'faq' && (
        <FaqAccordion
          onSelectRelatedArticle={(artId) => {
            setActiveSection('articles');
            setSelectedArticleId(artId);
          }}
        />
      )}

      {/* SECTION 3: Contact & SLA Directory */}
      {activeSection === 'contacts-sla' && (
        <ContactSlaDirectory />
      )}

      {/* ARTICLE EDITOR MODAL */}
      {showEditorModal && (
        <ArticleEditorModal
          articleToEdit={articleToEdit}
          currentUser={currentUser}
          currentRole={currentRole}
          onClose={() => setShowEditorModal(false)}
          onSaveArticle={handleSaveArticle}
        />
      )}
    </div>
  );
}
