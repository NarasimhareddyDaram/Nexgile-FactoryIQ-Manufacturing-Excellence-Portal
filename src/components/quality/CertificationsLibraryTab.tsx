import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  History,
  FileCheck,
  Shield,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ComplianceDocument,
  ComplianceCategory,
  ComplianceStandard,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';
import { VersionHistoryModal } from './VersionHistoryModal';

interface CertificationsLibraryTabProps {
  documents: ComplianceDocument[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const CertificationsLibraryTab: React.FC<CertificationsLibraryTabProps> = ({
  documents,
  selectedSite,
  currentRole,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocForHistory, setSelectedDocForHistory] = useState<ComplianceDocument | null>(null);

  // Available categories
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Standards' },
    { id: 'Automotive', label: 'Automotive (IATF 16949)' },
    { id: 'Medical Devices', label: 'Medical (ISO 13485 / FDA)' },
    { id: 'Aerospace/Defense', label: 'Aerospace (AS9100D)' },
    { id: 'Special Process (NADCAP)', label: 'NADCAP & IPC Class 3' },
    { id: 'Quality Management', label: 'General Quality (ISO 9001)' },
    { id: 'Environmental/Safety', label: 'RoHS / REACH / ISO 14001' }
  ];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Site filter
      if (selectedSite !== 'all' && doc.facilitySiteId !== 'all' && doc.facilitySiteId !== selectedSite) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && doc.status !== statusFilter) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesStandard = doc.standard.toLowerCase().includes(query);
        const matchesCertNum = doc.certNumber.toLowerCase().includes(query);
        const matchesScope = doc.scope.toLowerCase().includes(query);
        const matchesFacility = doc.facility.toLowerCase().includes(query);
        const matchesOwner = doc.owner.toLowerCase().includes(query);
        if (!matchesTitle && !matchesStandard && !matchesCertNum && !matchesScope && !matchesFacility && !matchesOwner) {
          return false;
        }
      }

      return true;
    });
  }, [documents, selectedSite, selectedCategory, statusFilter, searchTerm]);

  // Quick stats
  const stats = useMemo(() => {
    const total = documents.length;
    const validCount = documents.filter(d => d.status === 'valid').length;
    const expiringSoon = documents.filter(d => d.status === 'expiring_soon').length;
    const auditReady = documents.filter(d => d.auditReadiness === 'Audit Ready').length;
    return { total, validCount, expiringSoon, auditReady };
  }, [documents]);

  const getStandardBadgeStyle = (category: ComplianceCategory) => {
    switch (category) {
      case 'Automotive':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Medical Devices':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Aerospace/Defense':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Special Process (NADCAP)':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Regulatory (FDA)':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Railway (IRIS)':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: ComplianceDocument['status']) => {
    switch (status) {
      case 'valid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Valid & Certified
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            Expiring &lt;60 Days
          </span>
        );
      case 'in_renewal':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3 text-blue-600" />
            In Renewal Process
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            Expired
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Certifications</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.validCount}</span>
            <span className="text-xs text-slate-400">/ {stats.total} total standards</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            100% plant operational coverage
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Audit-Ready Packages</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{stats.auditReady}</span>
            <span className="text-xs text-slate-400">dossiers prepared</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Pre-assembled registrar submission bundles
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Renewals</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{stats.expiringSoon}</span>
            <span className="text-xs text-slate-400">within 60 days</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium">
            Stage 2 surveillance audits scheduled
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Special Processes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">NADCAP + IPC-3</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Full AC7119 QML space-grade certified
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by standard, cert #, facility, scope, owner..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition shadow-2xs"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by certificate validity status"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="valid">Valid Only</option>
              <option value="expiring_soon">Expiring Soon (&lt;60d)</option>
              <option value="in_renewal">In Renewal</option>
            </select>

            {/* Export All Action */}
            <button
              onClick={() => {
                alert(`Exporting compliance index (${filteredDocuments.length} certificates) as audit manifest.`);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Index</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Document Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Registered Compliance Documents & Accredited Standards
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredDocuments.length} of {documents.length} verified compliance records
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Last registrar synchronization: 2 hours ago
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Standard & Certification</th>
                <th className="px-4 py-3.5">Facility & Registrar</th>
                <th className="px-4 py-3.5">Scope of Certification</th>
                <th className="px-4 py-3.5">Issue / Expiry Dates</th>
                <th className="px-4 py-3.5">Document Owner</th>
                <th className="px-4 py-3.5">Status & Readiness</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <Shield className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No compliance documents match your filters</p>
                    <p className="text-xs mt-1">Try resetting your search query or selecting "All Standards".</p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition group">
                    {/* Standard & Title */}
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${getStandardBadgeStyle(doc.category)}`}>
                            {doc.standard}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-slate-400">
                            {doc.currentVersion}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition">
                          {doc.title}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          Cert #: <span className="text-slate-600 font-semibold">{doc.certNumber}</span>
                        </p>
                      </div>
                    </td>

                    {/* Facility & Issuing Body */}
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{doc.facility}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Body: <strong className="text-slate-700">{doc.issuingBody}</strong>
                        </p>
                      </div>
                    </td>

                    {/* Scope */}
                    <td className="px-4 py-4 align-top max-w-xs">
                      <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                        {doc.scope}
                      </p>
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-500">
                          <span className="text-slate-400">Issued:</span>
                          <span className="font-semibold text-slate-700">{doc.issueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">Expires:</span>
                          <span className={`font-bold ${
                            doc.status === 'expiring_soon' ? 'text-amber-700' : 'text-slate-900'
                          }`}>
                            {doc.expiryDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>{doc.owner}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 pl-5">
                          {doc.ownerEmail}
                        </p>
                      </div>
                    </td>

                    {/* Status & Readiness */}
                    <td className="px-4 py-4 align-top space-y-1.5 whitespace-nowrap">
                      <div>{getStatusBadge(doc.status)}</div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{doc.auditReadiness}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Version History Button */}
                        <button
                          onClick={() => setSelectedDocForHistory(doc)}
                          title="View revision audit trail & change log"
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs"
                        >
                          <History className="h-3.5 w-3.5 text-slate-500" />
                          <span className="hidden xl:inline">History</span>
                        </button>

                        {/* Download Certificate */}
                        <button
                          onClick={() => {
                            alert(`Downloading official certified document: ${doc.title} (${doc.fileSize})`);
                          }}
                          title={`Download ${doc.fileSize} official PDF`}
                          className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-2xs"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
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

      {/* Version History Modal */}
      {selectedDocForHistory && (
        <VersionHistoryModal
          document={selectedDocForHistory}
          onClose={() => setSelectedDocForHistory(null)}
        />
      )}
    </div>
  );
};
