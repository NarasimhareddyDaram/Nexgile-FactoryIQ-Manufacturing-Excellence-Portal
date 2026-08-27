import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  CheckCircle2,
  BookOpen,
  Filter,
  Sparkles
} from 'lucide-react';
import { FaqItem } from '../../types';
import { INITIAL_FAQ_ITEMS } from '../../data/collaborationData';

interface FaqAccordionProps {
  onSelectRelatedArticle?: (articleId: string) => void;
}

export function FaqAccordion({ onSelectRelatedArticle }: FaqAccordionProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQ_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'FAQ-01': true,
    'FAQ-02': true
  });

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter(item => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div id="faq-accordion-container" className="space-y-4 text-left">
      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. DFM turnaround, stencil apertures, FAI package, RMA SLAs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto text-xs">
          <select
            aria-label="Filter FAQs by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All FAQ Categories</option>
            <option value="DFM & Engineering">DFM & Engineering</option>
            <option value="Production & SMT">Production & SMT</option>
            <option value="Quality & PPAP">Quality & PPAP</option>
            <option value="RMA & Reverse Logistics">RMA & Reverse Logistics</option>
          </select>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
            No FAQ items matched your query.
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isOpen = !!openFaqIds[faq.id];

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {faq.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {faq.question}
                      </h4>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-700 leading-relaxed bg-slate-50/30 space-y-3">
                    <p>{faq.answer}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[11px] text-slate-400">
                      <span>Verified: {faq.lastVerified}</span>
                      {faq.relatedArticleId && onSelectRelatedArticle && (
                        <button
                          type="button"
                          onClick={() => onSelectRelatedArticle(faq.relatedArticleId!)}
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          View Detailed Technical Article &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
