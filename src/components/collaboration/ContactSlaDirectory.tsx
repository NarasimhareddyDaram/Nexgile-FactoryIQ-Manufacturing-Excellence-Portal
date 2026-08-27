import React, { useState } from 'react';
import {
  Users,
  Clock,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  Shield,
  Send,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { ContactSla } from '../../types';
import { INITIAL_CONTACT_SLAS } from '../../data/collaborationData';

export function ContactSlaDirectory() {
  const [contacts, setContacts] = useState<ContactSla[]>(INITIAL_CONTACT_SLAS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactForMessage, setSelectedContactForMessage] = useState<ContactSla | null>(null);
  const [messageText, setMessageText] = useState('');

  const filteredContacts = contacts.filter(c => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTeam = c.teamName.toLowerCase().includes(q);
      const matchDept = c.department.toLowerCase().includes(q);
      const matchLead = c.primaryContact.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      return matchTeam || matchDept || matchLead || matchEmail;
    }
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContactForMessage) return;
    alert(`Priority dispatch sent to ${selectedContactForMessage.primaryContact} (${selectedContactForMessage.teamName}) under SLA commitment (${selectedContactForMessage.responseSlaHours}h).`);
    setSelectedContactForMessage(null);
    setMessageText('');
  };

  return (
    <div id="contact-sla-directory-container" className="space-y-4 text-left">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search teams, engineering leads, SLAs, or email handles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Active SLA Guarantees
          </span>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4 flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            {/* Top Team Header */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {contact.department}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  {contact.responseSlaHours}h SLA ({contact.urgentEscalationSlaHours}h Urgent)
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {contact.teamName}
              </h4>
            </div>

            {/* Lead & Contact Specs */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 text-xs">
              <div>
                <p className="font-bold text-slate-900">{contact.primaryContact}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                    contact.availabilityStatus === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    contact.availabilityStatus === 'On Shift' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {contact.availabilityStatus}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {contact.activeTicketsCount} active tickets
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-indigo-600 truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-700">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.location} &bull; {contact.timeZone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[10px] text-slate-500">{contact.coverageWindow}</span>
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="pt-2 border-t border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Scope of Coverage</span>
                <ul className="text-[10px] text-slate-600 space-y-0.5">
                  {contact.responsibilities.slice(0, 2).map((r, i) => (
                    <li key={i} className="flex items-center gap-1 truncate">
                      <span className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />
                      <span className="truncate">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedContactForMessage(contact)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Dispatch Query
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DISPATCH QUERY MODAL */}
      {selectedContactForMessage && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Direct SLA Dispatch</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedContactForMessage.teamName} &bull; {selectedContactForMessage.responseSlaHours}h SLA
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContactForMessage(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">To Team Lead</label>
                <p className="p-2 bg-slate-100 text-slate-800 rounded font-medium">
                  {selectedContactForMessage.primaryContact} ({selectedContactForMessage.email})
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Inquiry / Escalation Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify component ref, drawing number, or test anomaly..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px]">
                <strong className="block font-bold">Guaranteed Response Window:</strong>
                Under our EMS Master Service Agreement, your ticket will be triaged within <strong>{selectedContactForMessage.responseSlaHours} business hours</strong>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedContactForMessage(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Send Urgent Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
