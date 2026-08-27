import React, { useState } from 'react';
import {
  Clock,
  AlertOctagon,
  Layers,
  Building,
  CheckCircle2,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  Thermometer,
  Wind,
  Droplets,
  Plus,
  ArrowRight,
  Sparkles,
  GitBranch,
  Cpu,
  Boxes,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import {
  EOLNotice,
  LTBProgram,
  LongTermStorageItem,
  RedesignMigrationProject,
  Role,
  User,
  FactorySiteId
} from '../../types';
import {
  mockEOLNotices,
  mockLTBPrograms,
  mockLongTermStorageItems,
  mockRedesignProjects
} from '../../data/afterSalesData';

interface EOLSupportTabProps {
  currentRole: Role | null;
  currentUser: User | null;
}

export function EOLSupportTab({ currentRole, currentUser }: EOLSupportTabProps) {
  const [notices, setNotices] = useState<EOLNotice[]>(mockEOLNotices);
  const [ltbPrograms, setLtbPrograms] = useState<LTBProgram[]>(mockLTBPrograms);
  const [storageItems, setStorageItems] = useState<LongTermStorageItem[]>(mockLongTermStorageItems);
  const [redesignProjects, setRedesignProjects] = useState<RedesignMigrationProject[]>(mockRedesignProjects);
  const [selectedNotice, setSelectedNotice] = useState<EOLNotice | null>(null);
  const [showNewLTBModal, setShowNewLTBModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New LTB Program Form
  const [ltbProduct, setLtbProduct] = useState('Gen-1 Industrial Power Inverter Controller PCBA');
  const [ltbPartNumber, setLtbPartNumber] = useState('400-1002-02');
  const [ltbCustomer, setLtbCustomer] = useState(currentUser?.company || 'NexWave Energy Solutions');
  const [ltbYears, setLtbYears] = useState(5);
  const [ltbUnits, setLtbUnits] = useState(800);
  const [ltbUnitCost, setLtbUnitCost] = useState(185);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateLTB = (e: React.FormEvent) => {
    e.preventDefault();
    const newLTB: LTBProgram = {
      id: `ltb-${Date.now()}`,
      noticeId: 'eol-001',
      productName: ltbProduct,
      partNumber: ltbPartNumber,
      customerName: ltbCustomer,
      targetBufferYears: Number(ltbYears),
      forecastedSupportUnits: Number(ltbUnits),
      committedLTBUnits: Number(ltbUnits),
      unitCostUSD: Number(ltbUnitCost),
      totalCommitmentUSD: Number(ltbUnits) * Number(ltbUnitCost),
      productionBatchDate: '2026-11-15',
      status: 'Contract Signed'
    };

    setLtbPrograms([newLTB, ...ltbPrograms]);
    setShowNewLTBModal(false);
    showToast(`LTB Commitment contract created for ${ltbUnits} units!`);
  };

  const totalLTBValue = ltbPrograms.reduce((acc, l) => acc + l.totalCommitmentUSD, 0);
  const totalStoredUnits = storageItems.reduce((acc, s) => acc + s.storedUnits, 0);

  return (
    <div id="eol-support-container" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active EOL / PCN Notices</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{notices.length} Notices</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              LTB Open
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Silicon & optoelectronic obsolescence</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Committed LTB Reserves</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">${(totalLTBValue / 1000).toFixed(0)}k USD</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Multi-Year SLA
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Guaranteed long-term field support</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nitrogen Vault Consignment</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalStoredUnits.toLocaleString()} Units</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              &lt; 3% RH Purged
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Austin & Penang dry gas chambers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Redesign ECN Projects</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{redesignProjects.length} Active</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              100% Drop-In FFF
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Cortex-M4 & Digital Isolator updates</p>
        </div>
      </div>

      {/* 1. EOL Notices Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Product Obsolescence & EOL PCN Notices</h3>
              <p className="text-xs text-slate-500">Official supplier discontinuations, critical last-time-buy deadlines & migrations</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
            {notices.length} Managed Notices
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">PCN # & Product Family</th>
                <th className="p-3">Affected Assemblies</th>
                <th className="p-3">Affected Customers</th>
                <th className="p-3">LTB Deadline</th>
                <th className="p-3">Last Ship Date</th>
                <th className="p-3">End of Service</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notices.map(notice => (
                <tr
                  key={notice.id}
                  className="hover:bg-slate-50/60 cursor-pointer"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <td className="p-3">
                    <div className="font-bold text-indigo-600 font-mono">{notice.noticeNumber}</div>
                    <div className="text-slate-900 font-medium mt-0.5">{notice.productFamily}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {notice.affectedAssemblies.map((assy, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                          {assy}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-slate-700">{notice.affectedCustomers.join(', ')}</td>
                  <td className="p-3 font-mono font-bold text-red-600">{notice.lastTimeBuyDate}</td>
                  <td className="p-3 font-mono text-slate-600">{notice.lastTimeShipDate}</td>
                  <td className="p-3 font-mono text-slate-500">{notice.endOfServiceDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        notice.status === 'LTB Window Open'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {notice.status}
                    </span>
                  </td>
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedNotice(notice)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Last-Time-Buy (LTB) Programs & 3. Nitrogen Storage Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): LTB Commitment Programs */}
        <div className="lg:col-span-6 space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                <DollarSign className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Last-Time-Buy (LTB) Buffer Programs</h3>
                <p className="text-xs text-slate-500">Committed multi-year customer lifetime support batches</p>
              </div>
            </div>
            <button
              id="btn-new-ltb-program"
              onClick={() => setShowNewLTBModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create LTB</span>
            </button>
          </div>

          <div className="space-y-3">
            {ltbPrograms.map(ltb => (
              <div key={ltb.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{ltb.productName}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {ltb.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Customer: <strong className="text-slate-800">{ltb.customerName}</strong> | Part #{' '}
                  <span className="font-mono text-indigo-600">{ltb.partNumber}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block">Buffer Duration</span>
                    <span className="font-bold text-slate-900">{ltb.targetBufferYears} Years Support</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block">Committed Units</span>
                    <span className="font-bold font-mono text-indigo-600">{ltb.committedLTBUnits} Units</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block">Contract Value</span>
                    <span className="font-bold font-mono text-emerald-600">
                      ${ltb.totalCommitmentUSD.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (6 Cols): Nitrogen Purged Long-Term Storage */}
        <div className="lg:col-span-6 space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                <Wind className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Nitrogen Dry Vault Storage & Consignment</h3>
                <p className="text-xs text-slate-500">Ultra-dry N2 purged climate vaults (&lt; 3% Relative Humidity)</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">20.5°C Controlled</span>
          </div>

          <div className="space-y-3">
            {storageItems.map(item => (
              <div key={item.id} className="p-4 bg-slate-900 text-white rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-xs sm:text-sm text-white">{item.description}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {item.lotNumber}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  Vault Location: <strong className="text-amber-300">{item.vaultLocation}</strong> | Stored:{' '}
                  <strong className="text-emerald-400 font-mono">{item.storedUnits} Units</strong>
                </div>

                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-xs space-y-1">
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{item.storageEnvironment}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700">
                    <span>Next Desiccant Audit: {item.nextDesiccantInspection}</span>
                    <span className="font-mono text-emerald-400">${item.annualStorageFeeUSD}/yr Fee</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Redesign & Migration Coordination Tools */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
              <GitBranch className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Redesign & Migration Engineering Coordination</h3>
              <p className="text-xs text-slate-500">Next-generation hardware redesigns, Form-Fit-Function qualification, and ramp approval</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redesignProjects.map(proj => (
            <div key={proj.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600">{proj.ecnNumber}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{proj.nextGenProduct}</h4>
                  <div className="text-xs text-slate-500">
                    Replaces: <span className="font-medium text-slate-700">{proj.legacyProduct}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 shrink-0">
                  {proj.qualificationStatus}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">Qualification Progress</span>
                  <span className="font-bold text-slate-900">{proj.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <strong>FFF Compatibility:</strong>{' '}
                  <span className="text-emerald-700 font-semibold">{proj.compatibilityRating}</span>
                </div>
                <div>
                  <strong>Engineering Lead:</strong> {proj.engineeringLead}
                </div>
                <div>
                  <strong>Target Sample Date:</strong>{' '}
                  <span className="font-mono font-bold text-slate-900">{proj.targetSampleDate}</span>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Key Architectural Enhancements:</span>
                <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                  {proj.keyEnhancements.map((enh, i) => (
                    <li key={i}>{enh}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PCN Notice Details Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Product Change & Discontinuation Notice</h3>
                <p className="text-xs text-slate-400">{selectedNotice.noticeNumber}</p>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{selectedNotice.productFamily}</div>
                <div className="text-slate-600">
                  Affected Assemblies: <span className="font-mono">{selectedNotice.affectedAssemblies.join(', ')}</span>
                </div>
                <div className="text-slate-600">
                  Customers: <strong>{selectedNotice.affectedCustomers.join(', ')}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Announcement Date</span>
                  <span className="font-mono font-bold text-slate-800">{selectedNotice.announcementDate}</span>
                </div>
                <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-[10px] text-red-600 uppercase block font-bold">LTB Window Closes</span>
                  <span className="font-mono font-black text-red-700">{selectedNotice.lastTimeBuyDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Reason for Obsolescence:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                  {selectedNotice.reason}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Recommended Migration Path:</span>
                <p className="text-emerald-900 bg-emerald-50 p-2.5 rounded border border-emerald-200 font-medium leading-relaxed">
                  {selectedNotice.migrationPath}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New LTB Commitment Modal */}
      {showNewLTBModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Create Last-Time-Buy Buffer Commitment</h3>
                <p className="text-xs text-indigo-100">Multi-year contract lock & nitrogen vault allocation</p>
              </div>
              <button
                onClick={() => setShowNewLTBModal(false)}
                className="p-1 text-indigo-200 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLTB} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Description</label>
                <input
                  type="text"
                  required
                  value={ltbProduct}
                  onChange={e => setLtbProduct(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Part Number</label>
                  <input
                    type="text"
                    required
                    value={ltbPartNumber}
                    onChange={e => setLtbPartNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Buffer Years</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    required
                    value={ltbYears}
                    onChange={e => setLtbYears(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Commitment Units</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={ltbUnits}
                    onChange={e => setLtbUnits(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Unit Cost ($ USD)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={ltbUnitCost}
                    onChange={e => setLtbUnitCost(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                <span>Calculated Contract Commitment:</span>
                <span className="text-base font-mono font-black text-emerald-400">
                  ${(ltbUnits * ltbUnitCost).toLocaleString()} USD
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewLTBModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Authorize LTB Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
