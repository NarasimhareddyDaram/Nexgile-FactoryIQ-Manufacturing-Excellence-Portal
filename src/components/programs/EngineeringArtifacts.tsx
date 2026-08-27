import React, { useState } from 'react';
import {
  BOMItem,
  EngineeringDrawing,
  EngineeringSpec,
  ECO,
  Program,
  Role,
  User
} from '../../types';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Cpu,
  Download,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Layers,
  Mail,
  Plus,
  RotateCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Truck,
  X
} from 'lucide-react';

interface EngineeringArtifactsProps {
  bomItems: BOMItem[];
  drawings: EngineeringDrawing[];
  specs: EngineeringSpec[];
  ecoLog: ECO[];
  programs: Program[];
  selectedProgram?: Program | null;
  currentRole: Role | null;
  currentUser: User | null;
}

export function EngineeringArtifacts({
  bomItems,
  drawings,
  specs,
  ecoLog,
  programs,
  selectedProgram,
  currentRole,
  currentUser
}: EngineeringArtifactsProps) {
  const [activeTab, setActiveTab] = useState<'bom' | 'drawings' | 'specs' | 'eco_log'>('eco_log');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEco, setSelectedEco] = useState<ECO | null>(ecoLog[0] || null);

  // ECO State for live simulation
  const [localEcos, setLocalEcos] = useState<ECO[]>(ecoLog);
  const [showNewEcoModal, setShowNewEcoModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // New ECO Form State
  const [newEcoTitle, setNewEcoTitle] = useState('');
  const [newEcoReason, setNewEcoReason] = useState('');
  const [newEcoBefore, setNewEcoBefore] = useState('');
  const [newEcoAfter, setNewEcoAfter] = useState('');
  const [newEcoPriority, setNewEcoPriority] = useState<'Immediate / Stop Ship' | 'Routine / Next Batch' | 'Phase-In'>('Immediate / Stop Ship');

  const handleCreateEco = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEcoTitle || !newEcoReason) return;

    const newEcoNumber = `ECO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const createdEco: ECO = {
      id: `eco-${Date.now()}`,
      ecoNumber: newEcoNumber,
      programId: selectedProgram?.id || 'prog-001',
      programCode: selectedProgram?.code || 'NX-VM-BMS-G3',
      title: newEcoTitle,
      dateCreated: '2026-08-27',
      effectiveDate: '2026-08-30',
      priority: newEcoPriority,
      status: 'Under Engineering Review',
      author: currentUser?.name ? `${currentUser.name} (${currentRole?.name || 'Engineer'})` : 'David Chen (Customer Lead Eng)',
      reasonForChange: newEcoReason,
      whatChangedBefore: newEcoBefore || 'Initial configuration',
      whatChangedAfter: newEcoAfter || 'Updated engineering design',
      affectedPartNumbers: ['NX-PCB-8L-TG180', 'NX-RES-SHUNT-001'],
      approvals: [
        { roleName: 'Customer R&D Lead', approverName: 'David Chen', approved: true, timestamp: '2026-08-27T10:00:00Z' },
        { roleName: 'Internal Quality Lead', approverName: 'Dr. Anita Joshi', approved: false },
        { roleName: 'Customer PM Lead', approverName: 'Sarah Lin', approved: false }
      ],
      notificationSent: true,
      notificationRecipients: [
        'sarah.lin@voltmobility.com',
        'david.chen@voltmobility.com',
        'a.joshi@nexgile.com',
        'c.mendez@nexgile.com'
      ]
    };

    setLocalEcos([createdEco, ...localEcos]);
    setSelectedEco(createdEco);
    setShowNewEcoModal(false);
    setNewEcoTitle('');
    setNewEcoReason('');
    setNewEcoBefore('');
    setNewEcoAfter('');

    // Trigger notification toast
    setNotificationToast(`Automated Notification Dispatched for ${newEcoNumber}: Sent to 4 engineering & PM leads.`);
    setTimeout(() => setNotificationToast(null), 6000);
  };

  const filteredBom = bomItems.filter((item) => {
    const matchSearch =
      item.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mpn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const getPriorityBadge = (priority: ECO['priority']) => {
    switch (priority) {
      case 'Immediate / Stop Ship':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
            <AlertTriangle className="h-3 w-3 text-rose-600" /> Immediate / Stop Ship
          </span>
        );
      case 'Routine / Next Batch':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
            <RotateCw className="h-3 w-3 text-indigo-600" /> Next Batch Run
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
            Phase-In
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Automated Notification Banner Toast */}
      {notificationToast && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 shadow-md flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <Bell className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Automated Webhook & Email Notification</h4>
              <p className="text-xs text-emerald-800 mt-0.5">{notificationToast}</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('eco_log')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'eco_log'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>ECO Revision Log ({localEcos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bom')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bom'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Bill of Materials (BOM)</span>
          </button>

          <button
            onClick={() => setActiveTab('drawings')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drawings'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Drawings & CAD ({drawings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Specs & Guidelines ({specs.length})</span>
          </button>
        </div>

        {activeTab === 'eco_log' && (
          <button
            onClick={() => setShowNewEcoModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Engineering Change (ECO)</span>
          </button>
        )}
      </div>

      {/* 1. ECO LOG TAB */}
      {activeTab === 'eco_log' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ECO Left List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Change Order History & Approvals
            </h3>

            <div className="space-y-2.5">
              {localEcos.map((eco) => {
                const isSelected = selectedEco?.id === eco.id;
                const approvedCount = eco.approvals.filter(a => a.approved).length;

                return (
                  <div
                    key={eco.id}
                    onClick={() => setSelectedEco(eco)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {eco.ecoNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                          {eco.title}
                        </h4>
                      </div>
                      {getPriorityBadge(eco.priority)}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Author: {eco.author.split('(')[0].trim()}</span>
                      <span>Effective: {eco.effectiveDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                        Approvals: {approvedCount} / {eco.approvals.length}
                      </span>
                      {eco.notificationSent && (
                        <span className="flex items-center gap-1 text-emerald-700 font-medium text-[10px]">
                          <Bell className="h-3 w-3" /> Auto-Notified
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ECO Right Deep-Dive Diff & Notification Viewer */}
          <div className="lg:col-span-7">
            {selectedEco ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {selectedEco.ecoNumber}
                      </span>
                      {getPriorityBadge(selectedEco.priority)}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {selectedEco.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">
                      {selectedEco.title}
                    </h3>
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    <p>Created: <strong className="text-slate-800">{selectedEco.dateCreated}</strong></p>
                    <p>Effective: <strong className="text-slate-800">{selectedEco.effectiveDate}</strong></p>
                  </div>
                </div>

                {/* Reason for Change */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-800">Engineering Justification & Root Cause:</h4>
                  <p className="rounded-lg bg-slate-50 p-3 text-slate-700 leading-relaxed border border-slate-200/70">
                    {selectedEco.reasonForChange}
                  </p>
                </div>

                {/* Before vs After Delta Diff Box */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">
                    Engineering Change Delta (Before vs. After Specification):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Before */}
                    <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span>Previous Release (Before):</span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-800 bg-white/90 p-2.5 rounded border border-rose-200 leading-relaxed">
                        {selectedEco.whatChangedBefore}
                      </p>
                    </div>

                    {/* After */}
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>ECO Revision (After):</span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-800 bg-white/90 p-2.5 rounded border border-emerald-200 leading-relaxed">
                        {selectedEco.whatChangedAfter}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Multi-Stakeholder Approval Matrix */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800">
                    Stakeholder Sign-Off Approval Matrix:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedEco.approvals.map((appr, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-lg border ${
                          appr.approved
                            ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-900">{appr.roleName}</p>
                          <p className="text-[11px] text-slate-500">{appr.approverName}</p>
                        </div>
                        {appr.approved ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                            <Clock className="h-4 w-4" /> Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automated Notification Trigger Status */}
                <div className="rounded-lg bg-indigo-50/60 border border-indigo-200 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-indigo-600" />
                      Automated Notification Delivery Status:
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      Delivered (4/4 Recipients)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedEco.notificationRecipients.map((recip, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] bg-white border border-indigo-200 px-2 py-0.5 rounded text-indigo-800"
                      >
                        {recip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-xs">
                Select an Engineering Change Order to inspect the before/after delta and notifications.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. BOM TAB */}
      {activeTab === 'bom' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search BOM by part #, MPN, description, mfr..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="Active IC">Active IC</option>
                <option value="Passive">Passive</option>
                <option value="PCB">PCB</option>
                <option value="Enclosure">Enclosure</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Part Number & MPN</th>
                  <th className="py-3 px-4">Component Description</th>
                  <th className="py-3 px-4">Category & Mfr</th>
                  <th className="py-3 px-4">Qty / Unit</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Supply Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBom.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{item.partNumber}</div>
                      <div className="font-mono text-[11px] text-indigo-600 mt-0.5">{item.mpn}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium max-w-xs">{item.description}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700">{item.category}</div>
                      <div className="text-[11px] text-slate-500">{item.manufacturer}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.quantityPerUnit}x</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{item.leadTimeWeeks} wks</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${item.unitCostUSD.toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.currentStock.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {item.supplierRisk === 'low' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Low Risk
                        </span>
                      ) : item.supplierRisk === 'medium' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Med Risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          High Risk
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DRAWINGS & CAD TAB */}
      {activeTab === 'drawings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drawings.map((dwg) => (
            <div
              key={dwg.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                    {dwg.docNumber}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {dwg.revision}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{dwg.title}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">{dwg.docType}</p>
                <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                  <p>Author: {dwg.author}</p>
                  <p>Updated: {dwg.lastUpdated} • {dwg.fileSize}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Released
                </span>
                <button
                  onClick={() => alert(`Downloading drawing archive: ${dwg.docNumber} (${dwg.fileSize})`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. SPECS TAB */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  {spec.specCode}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {spec.version} ({spec.status})
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{spec.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {spec.summary}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Author: {spec.author}</span>
                <span>Effective: {spec.effectiveDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New ECO Modal */}
      {showNewEcoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCw className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Create Engineering Change Order (ECO)
                </h3>
              </div>
              <button
                onClick={() => setShowNewEcoModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEco} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">ECO Title / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optimize thermal snubber capacitor on high-voltage driver"
                  value={newEcoTitle}
                  onChange={(e) => setNewEcoTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Change Priority</label>
                <select
                  value={newEcoPriority}
                  onChange={(e) => setNewEcoPriority(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Immediate / Stop Ship">Immediate / Stop Ship (Critical)</option>
                  <option value="Routine / Next Batch">Routine / Next Batch (Normal)</option>
                  <option value="Phase-In">Phase-In (Continuous improvement)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Reason for Change & Root Cause</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide technical justification, test results, or supply lead-time reason..."
                  value={newEcoReason}
                  onChange={(e) => setNewEcoReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-rose-700">Before (Current Spec)</label>
                  <input
                    type="text"
                    placeholder="e.g. C42: 100nF 500V 0805"
                    value={newEcoBefore}
                    onChange={(e) => setNewEcoBefore(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-emerald-700">After (New ECO Spec)</label>
                  <input
                    type="text"
                    placeholder="e.g. C42: 220nF 630V 1210"
                    value={newEcoAfter}
                    onChange={(e) => setNewEcoAfter(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3 text-slate-600 space-y-1">
                <p className="font-bold text-indigo-900 flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5" /> Automated Notification Preview:
                </p>
                <p className="text-[11px]">
                  Submitting this ECO will immediately dispatch automated webhook alerts and email dossiers to Customer Lead PM, Customer R&D, and Nexgile Quality Director.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewEcoModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Release & Dispatch Notifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
