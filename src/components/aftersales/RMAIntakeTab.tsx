import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Barcode,
  Building,
  User as UserIcon,
  Shield,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import {
  RMARequest,
  RMAReasonCode,
  RMATriageStatus,
  Role,
  User,
  FactorySiteId
} from '../../types';
import { mockRMARequests, mockWarrantyLookupDatabase } from '../../data/afterSalesData';

interface RMAIntakeTabProps {
  currentRole: Role | null;
  currentUser: User | null;
  onNavigateToRepair?: (rmaNumber: string) => void;
}

export function RMAIntakeTab({
  currentRole,
  currentUser,
  onNavigateToRepair
}: RMAIntakeTabProps) {
  const [rmas, setRmas] = useState<RMARequest[]>(mockRMARequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedRMA, setSelectedRMA] = useState<RMARequest | null>(null);
  const [showNewRMAModal, setShowNewRMAModal] = useState(false);
  const [showShippingLabelModal, setShowShippingLabelModal] = useState<RMARequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New RMA Form State
  const [formCustomer, setFormCustomer] = useState(currentUser?.company || 'AeroDynamics Global Corp');
  const [formProgram, setFormProgram] = useState('PRG-AVIONIC-09');
  const [formProductName, setFormProductName] = useState('Flight Navigation Controller Mainboard (Rev D)');
  const [formPartNumber, setFormPartNumber] = useState('700-0921-04');
  const [formSerialNumber, setFormSerialNumber] = useState('SN-AV-2024-8891');
  const [formLotCode, setFormLotCode] = useState('LOT-2025-W10');
  const [formReasonCode, setFormReasonCode] = useState<RMAReasonCode>('Field Operational Failure');
  const [formCustomerNotes, setFormCustomerNotes] = useState('');
  const [formFailureSymptoms, setFormFailureSymptoms] = useState('');
  const [formOperatingHours, setFormOperatingHours] = useState(1200);
  const [formEnvironment, setFormEnvironment] = useState('Pressurized avionics equipment chassis, 40°C');
  const [formDepotFacility, setFormDepotFacility] = useState<FactorySiteId>('austin');
  const [formPriority, setFormPriority] = useState<'Critical (AOG / Line Stop)' | 'High' | 'Standard' | 'Low'>('High');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-fill product info when serial number matches known warranty record
  const handleSerialLookup = (serial: string) => {
    setFormSerialNumber(serial);
    const matched = mockWarrantyLookupDatabase[serial];
    if (matched) {
      setFormProductName(matched.productName);
      setFormPartNumber(matched.partNumber);
      setFormCustomer(matched.customerName);
      showToast(`Verified Serial #${serial}: ${matched.warrantyTier} (${matched.warrantyStatus})`);
    }
  };

  const handleCreateRMA = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `rma-${Date.now().toString().slice(-4)}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRMANumber = `RMA-2026-${randomNum}`;
    const newTracking = `7946 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

    const newRMA: RMARequest = {
      id: newId,
      rmaNumber: newRMANumber,
      customerName: formCustomer,
      programCode: formProgram,
      productName: formProductName,
      partNumber: formPartNumber,
      serialNumber: formSerialNumber || `SN-CUSTOM-${randomNum}`,
      lotCode: formLotCode,
      requestDate: new Date().toISOString().split('T')[0],
      reasonCode: formReasonCode,
      customerNotes: formCustomerNotes || 'Customer logged unit failure requiring factory RMA diagnostic and repair.',
      failureSymptoms: formFailureSymptoms || 'Unit exhibits intermittent power / sensor signal anomaly during operation.',
      operatingHours: Number(formOperatingHours),
      environmentCondition: formEnvironment,
      warrantyStatus: 'Under Standard Warranty',
      triageStatus: 'RMA Approved & Label Issued',
      triageAssignedTo: 'Depot Intake Coordinator',
      depotFacility: formDepotFacility,
      priority: formPriority,
      estimatedRepairDays: formPriority.includes('Critical') ? 2 : 4,
      shippingLabel: {
        trackingNumber: newTracking,
        carrier: 'FedEx Priority',
        serviceSpeed: formPriority.includes('Critical') ? 'First Overnight AOG' : 'Priority 2-Day Air',
        shipFrom: {
          name: currentUser?.name || 'Authorized Field Engineer',
          company: formCustomer,
          address: '400 Innovation Way, Hangar 2',
          city: 'San Jose, CA 95134',
          country: 'USA',
          contactPhone: '+1 (408) 555-0149'
        },
        shipTo: {
          facilityName: `${formDepotFacility.toUpperCase()} Giga-EMS Service Hub`,
          address: '10800 Tech Center Blvd, Dock 4A',
          dockCode: 'DOCK-RMA-FASTTRACK',
          attention: `Attn: Depot Triage (${newRMANumber})`
        },
        barcodeValue: `${newRMANumber}*${newTracking.replace(/\s/g, '')}*${formProgram}`,
        labelCreatedDate: new Date().toISOString().split('T')[0],
        packageWeightKg: 1.5,
        customsDeclarationValueUSD: 3500
      },
      workflowSteps: [
        {
          stepName: 'RMA Request Submitted',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          completedBy: `${currentUser?.name || 'Customer Engineer'} (${formCustomer})`,
          status: 'completed'
        },
        {
          stepName: 'Technical Triage & Authorization',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          completedBy: 'Automated FactoryIQ Warranty & SLA Engine',
          notes: 'Contract validated. Return authorized.',
          status: 'completed'
        },
        {
          stepName: 'Prepaid Logistics Waybill Issued',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          completedBy: 'Depot Logistics Dispatch',
          status: 'completed'
        },
        {
          stepName: 'Awaiting Inbound Shipment Pickup',
          status: 'in_progress'
        },
        {
          stepName: 'Depot Intake & Visual Inspection',
          status: 'pending'
        },
        {
          stepName: 'Diagnostic Bench & Failure Analysis',
          status: 'pending'
        },
        {
          stepName: 'Component Rework & Assembly Repair',
          status: 'pending'
        },
        {
          stepName: 'Final QA Test & Certification',
          status: 'pending'
        },
        {
          stepName: 'Outbound Return Dispatch',
          status: 'pending'
        }
      ]
    };

    setRmas([newRMA, ...rmas]);
    setShowNewRMAModal(false);
    setSelectedRMA(newRMA);
    showToast(`RMA #${newRMANumber} successfully generated with prepaid shipping label!`);
  };

  const handleUpdateStatus = (rmaId: string, nextStatus: RMATriageStatus) => {
    setRmas(prev =>
      prev.map(r => {
        if (r.id !== rmaId) return r;
        const updatedSteps = [...r.workflowSteps];
        const nextPendingIdx = updatedSteps.findIndex(s => s.status === 'in_progress');
        if (nextPendingIdx >= 0) {
          updatedSteps[nextPendingIdx] = {
            ...updatedSteps[nextPendingIdx],
            status: 'completed',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            completedBy: currentUser?.name || 'Depot Specialist'
          };
          if (nextPendingIdx + 1 < updatedSteps.length) {
            updatedSteps[nextPendingIdx + 1] = {
              ...updatedSteps[nextPendingIdx + 1],
              status: 'in_progress'
            };
          }
        }
        return {
          ...r,
          triageStatus: nextStatus,
          workflowSteps: updatedSteps
        };
      })
    );
    if (selectedRMA && selectedRMA.id === rmaId) {
      setSelectedRMA(prev => (prev ? { ...prev, triageStatus: nextStatus } : null));
    }
    showToast(`RMA triage status updated to: ${nextStatus}`);
  };

  const filteredRMAs = rmas.filter(r => {
    const matchesSearch =
      r.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.partNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.triageStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeCount = rmas.filter(r => r.triageStatus !== 'Closed / Credit Issued').length;
  const aogCount = rmas.filter(r => r.priority.includes('Critical') && r.triageStatus !== 'Closed / Credit Issued').length;

  return (
    <div id="rma-intake-container" className="space-y-6">
      {/* Toast Banner */}
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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active RMA Queue</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeCount}</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {aogCount} AOG / Critical
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Across Austin, GDL & Penang repair hubs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Turnaround (TAT)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">2.8 Days</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              -44% vs 5.0d SLA
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Depot dock intake to return shipment</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First-Time Fix Yield</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">98.4%</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Zero Repeat Returns
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">IPC-7711/7721 certified rework bays</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Billable Recovery</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">$4,850</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Out-of-Warranty T&M
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Recovered from non-warranty customer repairs</p>
        </div>
      </div>

      {/* Control Bar & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="rma-search-input"
              type="text"
              placeholder="Search by RMA #, Serial #, Part #, Customer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="rma-status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Triage Statuses</option>
              <option value="RMA Approved & Label Issued">Approved & Label Issued</option>
              <option value="Received at Depot">Received at Depot</option>
              <option value="Bench Testing / Diagnostics">In Diagnostics</option>
              <option value="In Repair / Rework Bay">In Repair Bay</option>
              <option value="Final QA Testing">Final QA Testing</option>
              <option value="Outbound Shipped">Outbound Shipped</option>
            </select>

            <select
              id="rma-priority-filter"
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="Critical (AOG / Line Stop)">Critical AOG</option>
              <option value="High">High</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>

        <button
          id="btn-open-new-rma"
          onClick={() => setShowNewRMAModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New RMA Request</span>
        </button>
      </div>

      {/* RMA Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">RMA & Serial</th>
                <th className="py-3 px-4">Product & Program</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Reason Code</th>
                <th className="py-3 px-4">Warranty</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Triage Status</th>
                <th className="py-3 px-4">Depot</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRMAs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No RMA requests match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredRMAs.map(rma => (
                  <tr
                    key={rma.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRMA(rma)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-indigo-600 flex items-center gap-1.5">
                        <span>{rma.rmaNumber}</span>
                        {rma.shippingLabel && (
                          <Truck className="w-3.5 h-3.5 text-slate-400" title="Prepaid Label Active" />
                        )}
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{rma.serialNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 line-clamp-1 max-w-[220px]" title={rma.productName}>
                        {rma.productName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{rma.partNumber} ({rma.programCode})</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {rma.customerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {rma.reasonCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          rma.warrantyStatus.includes('Gold')
                            ? 'bg-amber-100 text-amber-800'
                            : rma.warrantyStatus.includes('Standard')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rma.warrantyStatus.split(' ')[1] || 'Warranty'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          rma.priority.includes('Critical')
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : rma.priority === 'High'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rma.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            rma.triageStatus.includes('Repair') || rma.triageStatus.includes('Diagnostics')
                              ? 'bg-indigo-500 animate-pulse'
                              : rma.triageStatus.includes('Shipped')
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-xs font-medium text-slate-700">{rma.triageStatus}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-xs font-semibold text-slate-500">
                      {rma.depotFacility}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        {rma.shippingLabel && (
                          <button
                            id={`btn-label-${rma.id}`}
                            onClick={() => setShowShippingLabelModal(rma)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="View / Print Shipping Label"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          id={`btn-view-${rma.id}`}
                          onClick={() => setSelectedRMA(rma)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded border border-indigo-200 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected RMA Drawer / Detail Modal with Stepper */}
      {selectedRMA && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-mono">
                    {selectedRMA.rmaNumber}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      selectedRMA.priority.includes('Critical')
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {selectedRMA.priority}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedRMA.productName}</h3>
                <p className="text-xs text-slate-300">
                  Customer: <span className="text-white font-medium">{selectedRMA.customerName}</span> | SN:{' '}
                  <span className="font-mono text-indigo-300">{selectedRMA.serialNumber}</span> | Depot:{' '}
                  <span className="uppercase font-semibold text-white">{selectedRMA.depotFacility}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedRMA(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Quick Actions & Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Current Triage Status</div>
                  <div className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                    {selectedRMA.triageStatus}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedRMA.shippingLabel && (
                    <button
                      onClick={() => setShowShippingLabelModal(selectedRMA)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                    >
                      <Barcode className="w-4 h-4 text-indigo-600" />
                      <span>View Carrier Waybill</span>
                    </button>
                  )}

                  {onNavigateToRepair && (
                    <button
                      onClick={() => {
                        setSelectedRMA(null);
                        onNavigateToRepair(selectedRMA.rmaNumber);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                    >
                      <span>Open Repair Bay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step-by-Step Status Workflow Stepper */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  RMA End-to-End Triage & Fulfillment Stepper
                </h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedRMA.workflowSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.status === 'completed'
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                            : step.status === 'in_progress'
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80 flex-1 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm">{step.stepName}</span>
                          {step.timestamp && (
                            <span className="text-[11px] font-mono text-slate-500">{step.timestamp}</span>
                          )}
                        </div>
                        {step.completedBy && (
                          <div className="text-xs text-slate-600 mt-0.5">
                            Handled by: <span className="font-medium text-slate-800">{step.completedBy}</span>
                          </div>
                        )}
                        {step.notes && (
                          <div className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                            "{step.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Diagnostics & Customer Failure Symptoms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Customer Symptoms & Error Codes</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-2.5 rounded border border-slate-200">
                    {selectedRMA.failureSymptoms}
                  </p>
                  <div className="text-xs text-slate-600">
                    <strong>Reason Code:</strong> {selectedRMA.reasonCode}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Operating Hours:</strong> {selectedRMA.operatingHours} hrs
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Environment:</strong> {selectedRMA.environmentCondition}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Triage & Warranty Classification</span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <strong>Assigned Specialist:</strong> {selectedRMA.triageAssignedTo}
                    </div>
                    <div>
                      <strong>Coverage Tier:</strong> {selectedRMA.warrantyStatus}
                    </div>
                    <div>
                      <strong>Target Turnaround:</strong> {selectedRMA.estimatedRepairDays} Days
                    </div>
                    <div>
                      <strong>Lot / Production Code:</strong> {selectedRMA.lotCode}
                    </div>
                  </div>

                  {/* Advance Triage Action */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                      Quick Advance Triage Status
                    </label>
                    <select
                      value={selectedRMA.triageStatus}
                      onChange={e => handleUpdateStatus(selectedRMA.id, e.target.value as RMATriageStatus)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="RMA Approved & Label Issued">RMA Approved & Label Issued</option>
                      <option value="In-Transit to Depot">In-Transit to Depot</option>
                      <option value="Received at Depot">Received at Depot</option>
                      <option value="Visual & Quarantine Inspection">Visual & Quarantine Inspection</option>
                      <option value="Bench Testing / Diagnostics">Bench Testing / Diagnostics</option>
                      <option value="In Repair / Rework Bay">In Repair / Rework Bay</option>
                      <option value="Final QA Testing">Final QA Testing</option>
                      <option value="Outbound Shipped">Outbound Shipped</option>
                      <option value="Closed / Credit Issued">Closed / Credit Issued</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Created on {selectedRMA.requestDate} | FactoryIQ Reverse Logistics
              </span>
              <button
                onClick={() => setSelectedRMA(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Shipping Label Modal */}
      {showShippingLabelModal && showShippingLabelModal.shippingLabel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-sm">Generated Inbound RMA Air Waybill</h3>
              </div>
              <button
                onClick={() => setShowShippingLabelModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Realistic Shipping Label Card */}
              <div className="border-2 border-dashed border-slate-400 bg-white p-5 rounded-lg text-slate-900 font-sans space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <span className="text-xl font-extrabold tracking-tight uppercase">
                      {showShippingLabelModal.shippingLabel.carrier}
                    </span>
                    <div className="text-xs font-bold text-slate-600">
                      {showShippingLabelModal.shippingLabel.serviceSpeed}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      RMA #{showShippingLabelModal.rmaNumber}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Wt: {showShippingLabelModal.shippingLabel.packageWeightKg} KG
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold uppercase text-[10px] text-slate-500 block">SHIP FROM:</span>
                    <p className="font-semibold text-slate-900">{showShippingLabelModal.shippingLabel.shipFrom.name}</p>
                    <p>{showShippingLabelModal.shippingLabel.shipFrom.company}</p>
                    <p>{showShippingLabelModal.shippingLabel.shipFrom.address}</p>
                    <p>{showShippingLabelModal.shippingLabel.shipFrom.city}</p>
                  </div>
                  <div>
                    <span className="font-bold uppercase text-[10px] text-slate-500 block">SHIP TO DEPOT:</span>
                    <p className="font-semibold text-slate-900">{showShippingLabelModal.shippingLabel.shipTo.facilityName}</p>
                    <p>{showShippingLabelModal.shippingLabel.shipTo.address}</p>
                    <p className="font-bold text-indigo-700">{showShippingLabelModal.shippingLabel.shipTo.dockCode}</p>
                    <p className="text-[10px] text-slate-500">{showShippingLabelModal.shippingLabel.shipTo.attention}</p>
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 pt-3 text-center space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    AIR WAYBILL TRACKING NUMBER
                  </div>
                  <div className="text-lg font-mono font-black tracking-wider text-slate-900">
                    {showShippingLabelModal.shippingLabel.trackingNumber}
                  </div>
                  {/* Visual Barcode simulation */}
                  <div className="flex justify-center items-center py-2">
                    <div className="h-12 bg-slate-900 w-full max-w-[280px] flex items-center justify-around px-2 rounded-xs">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <div
                          key={i}
                          className={`bg-white h-10 ${i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-0.5' : 'w-1'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    *{showShippingLabelModal.shippingLabel.barcodeValue}*
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Air Label</span>
                </button>
                <button
                  onClick={() => {
                    showToast('Packing slip downloaded (PDF)');
                    setShowShippingLabelModal(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New RMA Request Self-Service Modal */}
      {showNewRMAModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Initiate Self-Service RMA Intake Request</h3>
                <p className="text-xs text-indigo-100">
                  Instant serial lookup, warranty check, and automated return shipping label generation
                </p>
              </div>
              <button
                onClick={() => setShowNewRMAModal(false)}
                className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRMA} className="p-6 overflow-y-auto space-y-4">
              {/* Quick Serial Lookup Suggestion */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-indigo-900">
                  Quick-Fill from Active Production Units:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['SN-AV-2024-8891', 'SN-MED-9921', 'SN-LDR-7731', 'SN-IOT-4410'].map(sn => (
                    <button
                      type="button"
                      key={sn}
                      onClick={() => handleSerialLookup(sn)}
                      className="px-2.5 py-1 text-xs font-mono bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 rounded border border-indigo-200 transition-colors"
                    >
                      {sn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSerialNumber}
                    onChange={e => handleSerialLookup(e.target.value)}
                    placeholder="e.g. SN-AV-2024-8891"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Customer / Organization</label>
                  <input
                    type="text"
                    required
                    value={formCustomer}
                    onChange={e => setFormCustomer(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Product Description</label>
                  <input
                    type="text"
                    required
                    value={formProductName}
                    onChange={e => setFormProductName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Part Number (MPN)</label>
                  <input
                    type="text"
                    required
                    value={formPartNumber}
                    onChange={e => setFormPartNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Reason Code</label>
                  <select
                    value={formReasonCode}
                    onChange={e => setFormReasonCode(e.target.value as RMAReasonCode)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                  >
                    <option value="DOA (Dead on Arrival)">DOA (Dead on Arrival)</option>
                    <option value="Field Operational Failure">Field Operational Failure</option>
                    <option value="Intermittent Signal Fault">Intermittent Signal Fault</option>
                    <option value="Physical / Connector Damage">Physical / Connector Damage</option>
                    <option value="Firmware / Boot Error">Firmware / Boot Error</option>
                    <option value="Calibration / Sensor Drift">Calibration / Sensor Drift</option>
                    <option value="Incompatible Hardware Rev">Incompatible Hardware Rev</option>
                    <option value="Other Defect">Other Defect</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Depot</label>
                  <select
                    value={formDepotFacility}
                    onChange={e => setFormDepotFacility(e.target.value as FactorySiteId)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                  >
                    <option value="austin">Austin Giga-1 Depot (USA)</option>
                    <option value="guadalajara">Guadalajara Tech-3 (MX)</option>
                    <option value="penang">Penang Plant-4 (MY)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority SLA</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                  >
                    <option value="Critical (AOG / Line Stop)">Critical (AOG Fast-Track)</option>
                    <option value="High">High Priority</option>
                    <option value="Standard">Standard (5-Day Turnaround)</option>
                    <option value="Low">Low / Bulk Batch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Detailed Failure Symptoms & Error Codes <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formFailureSymptoms}
                  onChange={e => setFormFailureSymptoms(e.target.value)}
                  placeholder="Describe observed behavior, voltage droop, LED error codes, or crash dump logs..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Operating Hours</label>
                  <input
                    type="number"
                    value={formOperatingHours}
                    onChange={e => setFormOperatingHours(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Operating Environment</label>
                  <input
                    type="text"
                    value={formEnvironment}
                    onChange={e => setFormEnvironment(e.target.value)}
                    placeholder="e.g. Temperature, vibration, enclosure type..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setShowNewRMAModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Generate RMA & Prepaid Label</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
