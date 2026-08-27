import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  Calendar,
  Building,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Activity,
  Award,
  Layers,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  WarrantyLookupRecord,
  WarrantyClaim,
  FailureTrendDataPoint,
  Role,
  User
} from '../../types';
import {
  mockWarrantyLookupDatabase,
  mockWarrantyClaims,
  mockFailureTrendData
} from '../../data/afterSalesData';

interface WarrantyHandlingTabProps {
  currentRole: Role | null;
  currentUser: User | null;
  onInitiateRMA?: (serialNumber: string) => void;
}

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export function WarrantyHandlingTab({
  currentRole,
  currentUser,
  onInitiateRMA
}: WarrantyHandlingTabProps) {
  const [lookupSerial, setLookupSerial] = useState('SN-AV-2024-8891');
  const [matchedRecord, setMatchedRecord] = useState<WarrantyLookupRecord | null>(
    mockWarrantyLookupDatabase['SN-AV-2024-8891'] || null
  );
  const [claims, setClaims] = useState<WarrantyClaim[]>(mockWarrantyClaims);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Claim Form
  const [claimSerial, setClaimSerial] = useState('SN-MED-9921');
  const [claimType, setClaimType] = useState<WarrantyClaim['claimType']>('Warranty Depot Repair');
  const [claimJustification, setClaimJustification] = useState('');
  const [claimAmount, setClaimAmount] = useState(450);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLookup = (serialToFind: string) => {
    const cleaned = serialToFind.trim();
    setLookupSerial(cleaned);
    const result = mockWarrantyLookupDatabase[cleaned];
    if (result) {
      setMatchedRecord(result);
      showToast(`Found coverage for ${result.serialNumber} (${result.warrantyStatus})`);
    } else {
      setMatchedRecord(null);
      showToast(`No warranty record found for serial: ${cleaned}`);
    }
  };

  const handleApproveClaim = (claimId: string) => {
    setClaims(prev =>
      prev.map(c => {
        if (c.id !== claimId) return c;
        const newApproval = {
          role: 'Service Operations Manager',
          approver: currentUser?.name || 'Authorized Quality Lead',
          status: 'Approved' as const,
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          comment: 'Approved under active warranty entitlement.'
        };
        return {
          ...c,
          status: 'Approved - RMA Issued',
          approvalHistory: [...c.approvalHistory, newApproval]
        };
      })
    );
    showToast(`Claim ${claimId} approved and authorized for RMA!`);
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = mockWarrantyLookupDatabase[claimSerial];
    const newClaim: WarrantyClaim = {
      id: `clm-00${claims.length + 1}`,
      claimNumber: `CLM-2026-0${145 + claims.length}`,
      serialNumber: claimSerial,
      productName: matched ? matched.productName : 'Custom Assembly Component',
      customerName: matched ? matched.customerName : (currentUser?.company || 'Customer Corp'),
      claimType,
      status: 'Claim Submitted',
      claimAmountUSD: Number(claimAmount),
      submittedDate: new Date().toISOString().split('T')[0],
      reviewerName: 'Service Operations Lead',
      justification: claimJustification || 'Hardware malfunction during warranty coverage window.',
      approvalHistory: [
        {
          role: 'Customer Service Representative',
          approver: currentUser?.name || 'Customer Eng',
          status: 'Pending',
          comment: 'Claim submitted with diagnostic failure log.'
        }
      ]
    };

    setClaims([newClaim, ...claims]);
    setShowNewClaimModal(false);
    showToast(`Warranty Claim ${newClaim.claimNumber} logged successfully!`);
  };

  return (
    <div id="warranty-handling-container" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Section: Serial Number Coverage Checker */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Warranty Entitlement & Serial Coverage Engine</h2>
              <p className="text-xs text-slate-500">
                Instant digital pedigree check, birth factory records, contract SLAs, and claim eligibility
              </p>
            </div>
          </div>
          <button
            id="btn-open-new-claim"
            onClick={() => setShowNewClaimModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Warranty Claim</span>
          </button>
        </div>

        {/* Search & Quick Chips */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="warranty-serial-input"
              type="text"
              placeholder="Enter unit Serial Number (e.g. SN-AV-2024-8891)..."
              value={lookupSerial}
              onChange={e => setLookupSerial(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup(lookupSerial)}
              className="w-full pl-9 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              onClick={() => handleLookup(lookupSerial)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Quick Click Serial Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500">Sample Units:</span>
          {Object.keys(mockWarrantyLookupDatabase).map(sn => (
            <button
              key={sn}
              onClick={() => handleLookup(sn)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                lookupSerial === sn
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {sn}
            </button>
          ))}
        </div>

        {/* Coverage Verification Card Result */}
        {matchedRecord ? (
          <div className="p-5 bg-slate-900 text-white rounded-xl space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{matchedRecord.productName}</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      matchedRecord.warrantyStatus === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : matchedRecord.warrantyStatus.includes('Expiring')
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {matchedRecord.warrantyStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Part #{matchedRecord.partNumber} | Serial: {matchedRecord.serialNumber} | Customer:{' '}
                  {matchedRecord.customerName}
                </div>
              </div>

              {onInitiateRMA && (
                <button
                  onClick={() => onInitiateRMA(matchedRecord.serialNumber)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>Initiate RMA with this Serial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Warranty Tier</span>
                <span className="font-bold text-amber-400 mt-0.5 block">{matchedRecord.warrantyTier}</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Birth Facility</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{matchedRecord.facilityBorn}</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Shipment Date</span>
                <span className="font-mono text-slate-200 mt-0.5 block">{matchedRecord.shipDate}</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Coverage Window</span>
                <span className="font-mono text-emerald-400 mt-0.5 block">
                  {matchedRecord.warrantyStartDate} → {matchedRecord.warrantyEndDate}
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-800/50 flex items-start gap-2.5 text-xs text-indigo-200">
              <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Service Level Agreement (SLA Contract #{matchedRecord.contractId}):</strong>{' '}
                <span className="text-slate-300">{matchedRecord.serviceAgreementLevel}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Enter a serial number or click a sample chip above to query real-time warranty coverage.
          </div>
        )}
      </div>

      {/* Claims Management Table & Approval Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-slate-900">Active Warranty Claims & Approval Workflow</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {claims.length} Claims Logged
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Claim # & Serial</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Claim Type</th>
                <th className="p-3">Claim Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map(claim => (
                <tr
                  key={claim.id}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <td className="p-3">
                    <div className="font-bold text-indigo-600 font-mono">{claim.claimNumber}</div>
                    <div className="text-[11px] font-mono text-slate-500">{claim.serialNumber}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-900 max-w-[200px] truncate">{claim.productName}</td>
                  <td className="p-3 text-slate-700">{claim.customerName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {claim.claimType}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">${claim.claimAmountUSD}.00 USD</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        claim.status.includes('Approved')
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status.includes('Rejected')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    {claim.status === 'Claim Submitted' || claim.status === 'Under Technical Evaluation' ? (
                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 font-semibold rounded text-xs border border-indigo-200"
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failure Trend Analytics Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Failure Mode Distribution & Field Reliability Analytics</h3>
              <p className="text-xs text-slate-500">Root-cause Pareto analysis and Mean Time Between Failures (MTBF)</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full">
            122 Total RMA Samples Analyzed
          </span>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bar Chart: Failure Mode Frequency */}
          <div className="lg:col-span-7 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Failure Category Occurrence (Pareto Count)
            </h4>
            <div className="h-64 w-full bg-slate-50/50 p-2 rounded-xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockFailureTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" name="Failure Count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Percentage Share */}
          <div className="lg:col-span-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Share of Total Defect Modes (%)
            </h4>
            <div className="h-64 w-full bg-slate-50/50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockFailureTrendData}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {mockFailureTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    layout="horizontal"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Failure Pareto Breakdown Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Defect Category</th>
                <th className="p-3">Incident Count</th>
                <th className="p-3">% of Total</th>
                <th className="p-3">Avg Repair Labor</th>
                <th className="p-3">Top Vulnerable Component</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockFailureTrendData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900">{item.category}</td>
                  <td className="p-3 font-mono font-bold text-indigo-600">{item.count} units</td>
                  <td className="p-3 font-mono font-semibold text-slate-700">{item.percentage}%</td>
                  <td className="p-3 text-slate-600">{item.avgLaborHours} hrs</td>
                  <td className="p-3 font-mono text-slate-800 font-medium">{item.topComp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail & Approval Stepper Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Warranty Claim Detail & Audit History</h3>
                <p className="text-xs text-slate-400">{selectedClaim.claimNumber}</p>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div>
                  <strong>Product:</strong> {selectedClaim.productName}
                </div>
                <div>
                  <strong>Serial:</strong> <span className="font-mono">{selectedClaim.serialNumber}</span>
                </div>
                <div>
                  <strong>Customer:</strong> {selectedClaim.customerName}
                </div>
                <div>
                  <strong>Requested Claim Type:</strong> {selectedClaim.claimType}
                </div>
                <div>
                  <strong>Claim Value:</strong> ${selectedClaim.claimAmountUSD}.00 USD
                </div>
                <div className="mt-2 text-slate-700 bg-white p-2.5 rounded border border-slate-200 italic">
                  "{selectedClaim.justification}"
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Multi-Tier Authorization Steps
                </h4>
                <div className="space-y-2">
                  {selectedClaim.approvalHistory.map((step, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{step.role}</span>
                          <span className="text-[10px] text-slate-400">{step.date}</span>
                        </div>
                        <div className="text-slate-600">
                          {step.approver}: <span className="italic">{step.comment}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Warranty Claim Modal */}
      {showNewClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Submit New Warranty Claim</h3>
              <button
                onClick={() => setShowNewClaimModal(false)}
                className="p-1 text-indigo-200 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  value={claimSerial}
                  onChange={e => setClaimSerial(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Claim Settlement Type</label>
                <select
                  value={claimType}
                  onChange={e => setClaimType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Warranty Depot Repair">Warranty Depot Repair</option>
                  <option value="Full Replacement Unit">Full Replacement Unit</option>
                  <option value="Advance Hardware Replacement">Advance Hardware Replacement</option>
                  <option value="Credit Memo / Refund">Credit Memo / Refund</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Claim Cost ($ USD)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={e => setClaimAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Failure Justification & Logs</label>
                <textarea
                  rows={2}
                  required
                  value={claimJustification}
                  onChange={e => setClaimJustification(e.target.value)}
                  placeholder="Describe failure during operational window..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewClaimModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                >
                  Submit for Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
