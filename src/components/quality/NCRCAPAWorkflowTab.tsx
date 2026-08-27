import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  Layers,
  Building2,
  User,
  Image as ImageIcon,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import {
  NCRCAPARecord,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';
import { EightDWizardModal } from './EightDWizardModal';

interface NCRCAPAWorkflowTabProps {
  records: NCRCAPARecord[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
  onSaveRecord?: (record: Partial<NCRCAPARecord>) => void;
}

export const NCRCAPAWorkflowTab: React.FC<NCRCAPAWorkflowTabProps> = ({
  records,
  selectedSite,
  currentRole,
  currentUser,
  onSaveRecord,
}) => {
  const [localRecords, setLocalRecords] = useState<NCRCAPARecord[]>(records);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<NCRCAPARecord | null>(records[0] || null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<NCRCAPARecord | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    return localRecords.filter((rec) => {
      if (selectedStatus !== 'all' && rec.status !== selectedStatus) return false;
      if (selectedSeverity !== 'all' && rec.severity !== selectedSeverity) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          rec.id.toLowerCase().includes(q) ||
          rec.title.toLowerCase().includes(q) ||
          rec.programCode.toLowerCase().includes(q) ||
          rec.defectCategory.toLowerCase().includes(q) ||
          rec.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [localRecords, selectedStatus, selectedSeverity, searchTerm]);

  // Handle Save from Wizard
  const handleSaveFromWizard = (payload: Partial<NCRCAPARecord>) => {
    if (editingRecord) {
      // Update existing
      const updated = localRecords.map(r => r.id === editingRecord.id ? { ...r, ...payload } as NCRCAPARecord : r);
      setLocalRecords(updated);
      setSelectedRecord(updated.find(r => r.id === editingRecord.id) || null);
    } else {
      // Create new
      const newRec = payload as NCRCAPARecord;
      setLocalRecords([newRec, ...localRecords]);
      setSelectedRecord(newRec);
    }
    setIsWizardOpen(false);
    setEditingRecord(null);
  };

  const getSeverityBadge = (sev: NCRCAPARecord['severity']) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Major':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Minor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status: NCRCAPARecord['status']) => {
    switch (status) {
      case 'Open':
        return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">Open</span>;
      case 'Containment Active':
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">Containment Active</span>;
      case 'RCA In Progress':
        return <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">RCA (D4) In Progress</span>;
      case 'Action Implemented':
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">Action Implemented</span>;
      case 'Verification Pending':
        return <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">Verification Pending</span>;
      case 'Closed':
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">Closed (Verified)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active CAPA / NCRs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {localRecords.filter(r => r.status !== 'Closed').length}
            </span>
            <span className="text-xs text-slate-400">active inquiries</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            1 Critical, 1 Major under active 8D containment
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Containment Quarantines</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">505 Units</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            100% sorting & screening complete
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg 8D Closure Time</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700">18.4 Days</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Automotive SLA target: &lt; 30 days
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Scrap & Cost Impact</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">$14,000</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            94% rework salvage success rate
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Record List & Right 8D Report Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filterable Record Cards (4 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Issue Registry</h3>
              <p className="text-xs text-slate-500">Non-Conformance & CAPA records</p>
            </div>

            <button
              onClick={() => {
                setEditingRecord(null);
                setIsWizardOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Issue / 8D</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, program, defect, owner..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label="Filter records by CAPA resolution status"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Containment Active">Containment Active</option>
                <option value="RCA In Progress">RCA In Progress</option>
                <option value="Action Implemented">Action Implemented</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                aria-label="Filter records by severity level"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredRecords.map((rec) => {
              const isSelected = selectedRecord?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`cursor-pointer rounded-2xl border p-4 transition text-left shadow-2xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {rec.id}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${getSeverityBadge(rec.severity)}`}>
                        {rec.severity}
                      </span>
                    </div>
                    <div>{getStatusBadge(rec.status)}</div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">
                    {rec.title}
                  </h4>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>{rec.programCode}</span>
                    <span>Owner: <strong className="text-slate-700">{rec.owner.split(' ')[0]}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected 8D Dossier Detail (7 cols on lg) */}
        <div className="lg:col-span-7">
          {selectedRecord ? (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-slate-200 p-5 bg-slate-50/50">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedRecord.id} ({selectedRecord.recordType})
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${getSeverityBadge(selectedRecord.severity)}`}>
                      {selectedRecord.severity} Severity
                    </span>
                    <div>{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedRecord.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Program: <strong className="text-slate-700">{selectedRecord.programName} ({selectedRecord.programCode})</strong> • Facility: <strong className="text-slate-700">{selectedRecord.facility}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingRecord(selectedRecord);
                      setIsWizardOpen(true);
                    }}
                    title="Edit in 8D Wizard"
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit 8D</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Exporting official 8D Root Cause & CAPA Dossier for ${selectedRecord.id} as audit PDF.`);
                    }}
                    title="Export complete 8D Report PDF"
                    className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* 8D Sections Tab View */}
              <div className="p-6 space-y-6 text-xs text-slate-700">
                {/* D1: TEAM */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      D1: 8D Problem Solving Team
                    </span>
                    <span className="text-[11px] text-slate-400">Cross-Functional Assembly</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Executive Champion</span>
                      <span className="font-bold text-slate-800">{selectedRecord.eightD.d1_team.champion}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Team Leader</span>
                      <span className="font-bold text-slate-800">{selectedRecord.eightD.d1_team.leader}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Core Members</span>
                      <span className="font-medium text-slate-700">{selectedRecord.eightD.d1_team.members.join(', ')}</span>
                    </div>
                    {selectedRecord.eightD.d1_team.customerRepresentative && (
                      <div className="sm:col-span-2 pt-1 border-t border-slate-200">
                        <span className="text-slate-400 block">Customer QA Representative</span>
                        <span className="font-semibold text-blue-700">{selectedRecord.eightD.d1_team.customerRepresentative}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* D2: PROBLEM DESCRIPTION & PHOTOS */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      D2: Problem Description (5W2H) & Physical Exhibits
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Lot: {selectedRecord.eightD.d2_problem.lotNumber}</span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-800 font-medium">
                    {selectedRecord.eightD.d2_problem.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">What:</span>
                      <span className="font-semibold text-slate-700">{selectedRecord.eightD.d2_problem.whatOccurred}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Where:</span>
                      <span className="font-semibold text-slate-700">{selectedRecord.eightD.d2_problem.whereDetected}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">When:</span>
                      <span className="font-semibold text-slate-700">{selectedRecord.eightD.d2_problem.whenDetected}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Defect Qty:</span>
                      <span className="font-bold text-rose-700">{selectedRecord.eightD.d2_problem.defectQuantity} units</span>
                    </div>
                  </div>

                  {/* Photo Exhibits */}
                  {selectedRecord.eightD.d2_problem.photos.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Optical & X-Ray Microscopy Images ({selectedRecord.eightD.d2_problem.photos.length}):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedRecord.eightD.d2_problem.photos.map((p, pidx) => (
                          <div key={pidx} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
                            <img
                              src={p.url}
                              alt={p.name}
                              className="h-16 w-16 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="space-y-0.5 text-[11px]">
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-slate-500 line-clamp-2">{p.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* D3: CONTAINMENT */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      D3: Immediate Containment Actions
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Quarantine: {selectedRecord.eightD.d3_containment.quarantineQty} Units
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong>Sorting Summary:</strong> {selectedRecord.eightD.d3_containment.sortingResults}
                  </p>

                  <div className="space-y-2">
                    {selectedRecord.eightD.d3_containment.actions.map((act) => (
                      <div key={act.id} className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-slate-200 text-[11px]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-medium text-slate-800">{act.action}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <span>Owner: <strong>{act.owner}</strong></span>
                          <span className="font-bold text-emerald-700 uppercase text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded">
                            {act.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* D4: ROOT CAUSE (5-Why & Fishbone) */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      D4: Root Cause Analysis (5-Why & Ishikawa Fishbone)
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      Empirically Verified
                    </span>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-purple-200 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                        Occurrence Root Cause:
                      </span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {selectedRecord.eightD.d4_rootCause.primaryRootCause}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                        Escape Point Root Cause:
                      </span>
                      <p className="font-medium text-slate-700 mt-0.5">
                        {selectedRecord.eightD.d4_rootCause.escapePointRootCause}
                      </p>
                    </div>
                  </div>

                  {/* 5-Why Iteration Cascade */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      5-Why Investigation Tree:
                    </span>
                    <div className="space-y-1.5 pl-2 border-l-2 border-purple-300">
                      {selectedRecord.eightD.d4_rootCause.fiveWhys.map((w) => (
                        <div key={w.step} className="text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                          <p className="font-bold text-slate-800">Why #{w.step}: {w.question}</p>
                          <p className="text-slate-600 mt-0.5 pl-2">↳ <strong>Answer:</strong> {w.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* D5 & D6: CORRECTIVE ACTIONS & VALIDATION */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      D5 & D6: Permanent Corrective Actions & Implementation
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      PPM: {selectedRecord.eightD.d6_implementation.measuredPPM}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedRecord.eightD.d5_correctiveActions.map((ca) => (
                      <div key={ca.id} className="rounded-lg bg-white p-3 border border-slate-200 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{ca.action}</span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-800 uppercase">
                            {ca.status}
                          </span>
                        </div>
                        <p className="text-slate-500">
                          Validation: <strong className="text-slate-700">{ca.validationPlan}</strong> • Owner: <strong className="text-slate-700">{ca.owner}</strong>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 rounded-lg bg-white p-3 border border-slate-200 text-[11px] space-y-1">
                    <p className="font-semibold text-slate-800">
                      <strong>Results:</strong> {selectedRecord.eightD.d6_implementation.resultsSummary}
                    </p>
                    <div className="flex gap-4 pt-1 text-emerald-700 font-semibold">
                      <span>✓ pFMEA Updated</span>
                      <span>✓ Control Plan Updated</span>
                    </div>
                  </div>
                </div>

                {/* D8: SIGN-OFF */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
                      D8: Final Approval & Effectiveness Verification
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {selectedRecord.eightD.d8_closure.verificationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 block">QA Lead Approval</span>
                      <span className="font-bold text-slate-900">{selectedRecord.eightD.d8_closure.qaManagerApproval}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Customer QA Sign-Off</span>
                      <span className="font-bold text-slate-900">{selectedRecord.eightD.d8_closure.customerApproval || 'Approved in Stage Gate'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              Select an issue from the left panel to inspect its full 8D dossier.
            </div>
          )}
        </div>
      </div>

      {/* 8D Wizard Modal */}
      {isWizardOpen && (
        <EightDWizardModal
          existingRecord={editingRecord}
          onClose={() => {
            setIsWizardOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveFromWizard}
        />
      )}
    </div>
  );
};
