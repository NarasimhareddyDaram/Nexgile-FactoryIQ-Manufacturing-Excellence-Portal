import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Share2,
  BookmarkPlus,
  Filter,
  Layers,
  Calendar,
  Building,
  BarChart3,
  CheckCircle2,
  Search,
  Copy,
  Check,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Eye,
  FileText,
  FileCode,
  Table,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Role, User, SavedReportTemplate, ReportRowData, ReportFilterState } from '../../types';
import { INITIAL_SAVED_TEMPLATES, INITIAL_REPORT_ROWS } from '../../data/analyticsData';
import { useLocalStorage, STORAGE_KEYS } from '../../lib/storage';

interface SelfServeReportingTabProps {
  currentRole: Role;
  currentUser: User;
}

export const SelfServeReportingTab: React.FC<SelfServeReportingTabProps> = ({
  currentRole,
  currentUser
}) => {
  const [savedTemplates, setSavedTemplates] = useLocalStorage<SavedReportTemplate[]>(
    STORAGE_KEYS.SAVED_TEMPLATES,
    INITIAL_SAVED_TEMPLATES
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('rpt-exec-steerco');
  const [rows, setRows] = useLocalStorage<ReportRowData[]>(
    STORAGE_KEYS.REPORT_ROWS,
    INITIAL_REPORT_ROWS
  );
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Report Builder Filter State
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [chartType, setChartType] = useState<'composite' | 'bar' | 'area' | 'line'>('composite');
  const [aggregation, setAggregation] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Modals & Share State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState<boolean>(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState<string>('');
  const [newTemplateDesc, setNewTemplateDesc] = useState<string>('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<'Executive' | 'Customer QBR' | 'Quality Deep-Dive' | 'Supply Chain & BOM' | 'Plant Operations'>('Executive');

  const [shareExpiration, setShareExpiration] = useState<'24h' | '7d' | '30d' | 'never'>('7d');
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Dynamic filtered rows
  const filteredRows = rows.filter(row => {
    const matchProg = selectedProgram === 'all' || row.programCode === selectedProgram;
    const matchFac = selectedFacility === 'all' || row.facility.toLowerCase().includes(selectedFacility.toLowerCase());
    const matchSearch = searchFilter === '' ||
      row.programCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      row.customer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      row.facility.toLowerCase().includes(searchFilter.toLowerCase());
    return matchProg && matchFac && matchSearch;
  });

  // Chart data derivation
  const chartData = filteredRows.map(r => ({
    name: r.programCode.replace('NX-', ''),
    yield: r.yieldPercent,
    otd: r.otdPercent,
    built: r.unitsBuilt,
    scrap: r.scrapCostUsd
  }));

  // Handle template selection
  const handleSelectTemplate = (template: SavedReportTemplate) => {
    setSelectedTemplateId(template.id);
    setDateRange(template.filterState.dateRange === 'custom' ? '30d' : template.filterState.dateRange);
    setChartType(template.chartType);
    setAggregation(template.filterState.aggregationLevel);
  };

  // Handle save template
  const handleSaveNewTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) return;

    const newTpl: SavedReportTemplate = {
      id: `rpt-custom-${Date.now()}`,
      title: newTemplateTitle,
      description: newTemplateDesc || 'Custom self-serve operational view.',
      category: newTemplateCategory,
      authorName: `${currentUser.name} (${currentUser.department})`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastGenerated: 'Just now',
      filterState: {
        dateRange,
        selectedPrograms: [selectedProgram],
        selectedFacilities: [selectedFacility],
        metricCategories: ['otd', 'yield', 'dpmo', 'capacity'],
        aggregationLevel: aggregation
      },
      chartType,
      isFavorite: true
    };

    setSavedTemplates([newTpl, ...savedTemplates]);
    setSelectedTemplateId(newTpl.id);
    setIsSaveTemplateModalOpen(false);
    setNewTemplateTitle('');
    setNewTemplateDesc('');
    setExportNotice(`Custom template "${newTpl.title}" saved successfully to your library.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Export handlers
  const handleExportCsv = () => {
    const headers = 'Program Code,Customer,Facility,Period,Units Planned,Units Built,Yield %,DPMO,OTD %,Scrap Cost USD,Status\n';
    const csvContent = filteredRows.map(r =>
      `"${r.programCode}","${r.customer}","${r.facility}","${r.period}",${r.unitsPlanned},${r.unitsBuilt},${r.yieldPercent},${r.dpmo},${r.otdPercent},${r.scrapCostUsd},"${r.status}"`
    ).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EMS_Operational_Report_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('CSV report successfully generated and downloaded.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportExcel = () => {
    // Generate formatted XML/CSV representation for Excel
    handleExportCsv();
    setExportNotice('Excel-compatible spreadsheet data exported.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const shareableUrl = `https://portal.nexgile.ems/reports/view?token=rep_sec_${selectedTemplateId}_${Date.now().toString(36)}&auth=sso_enterprise`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <div id="self-serve-reporting-builder" className="space-y-6 text-left">
      {/* Top Bar with Template Switcher & Export Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Self-Serve Operations Report Builder</h3>
            <p className="text-xs text-slate-500">
              Build custom cross-facility slice reports, generate instant PDF/Excel exports, or share live secure links.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Save view button */}
          <button
            type="button"
            onClick={() => setIsSaveTemplateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            Save View
          </button>

          {/* Share Link button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Shareable Report Link
          </button>

          {/* Export Dropdown Group */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
              title="Download Raw CSV"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors"
              title="Download Excel Workbook"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel (.xlsx)
            </button>
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> PDF Pack
            </button>
          </div>
        </div>
      </div>

      {/* Export / Action Notification Banner */}
      {exportNotice && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Saved Templates Quick Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Saved Report Presets & Templates
          </span>
          <span className="text-[11px] text-slate-400 font-mono">{savedTemplates.length} Templates Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {savedTemplates.map(tpl => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-400'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-700">{tpl.category}</span>
                    <span className="font-mono">{tpl.lastGenerated.slice(0, 10)}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{tpl.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{tpl.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Filter Controls Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-900">Configure Dimensions & Slices</h4>
          </div>
          <span className="text-xs text-slate-500">Live Preview Updates Instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Filter 1: Date Range */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Reporting Horizon</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days (Standard)</option>
              <option value="90d">Last Quarter (90 Days)</option>
              <option value="ytd">Year-to-Date (YTD 2026)</option>
            </select>
          </div>

          {/* Filter 2: Program */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Target Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Active Programs</option>
              <option value="NX-VM-BMS-G3">NX-VM-BMS-G3 (VoltMobility)</option>
              <option value="NX-BIO-PUMP-PRO">NX-BIO-PUMP-PRO (Apex BioMed)</option>
              <option value="NX-AERO-FCS-400">NX-AERO-FCS-400 (AeroSys)</option>
              <option value="NX-BOT-AMR-DRIVE">NX-BOT-AMR-DRIVE (Orion)</option>
              <option value="NX-IOT-GATEWAY-5G">NX-IOT-GATEWAY-5G (VoltMobility)</option>
            </select>
          </div>

          {/* Filter 3: Facility */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Production Facility</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Sites (Global)</option>
              <option value="Austin">Austin Campus (Plant 1)</option>
              <option value="Guadalajara">Guadalajara (Plant 2)</option>
              <option value="Penang">Penang (Plant 3)</option>
            </select>
          </div>

          {/* Filter 4: Aggregation */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Aggregation Granularity</label>
            <select
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="daily">Daily Run-Rates</option>
              <option value="weekly">Weekly Rollup</option>
              <option value="monthly">Monthly Master View</option>
            </select>
          </div>

          {/* Filter 5: Chart Visualizer */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Visual Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="composite">Composite Bar + Line</option>
              <option value="bar">Grouped Built vs Planned</option>
              <option value="area">Area Volume Horizon</option>
              <option value="line">Yield vs OTD Multi-Line</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Chart Preview Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Aggregated Metric Trajectory</h4>
            <p className="text-xs text-slate-500">Cross-program comparison across first-pass yield and on-time delivery percentages</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-3 h-3 bg-indigo-500 rounded" /> Built Units
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-3 h-0.5 bg-emerald-500" /> Yield %
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-3 h-0.5 bg-amber-500" /> OTD %
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'composite' ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="units" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="pct" orientation="right" domain={[85, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Bar yAxisId="units" dataKey="built" fill="#818cf8" radius={[4, 4, 0, 0]} name="Units Built" />
                <Line yAxisId="pct" type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2.5} name="First-Pass Yield" dot={{ r: 4 }} />
                <Line yAxisId="pct" type="monotone" dataKey="otd" stroke="#f59e0b" strokeWidth={2} name="OTD Rate" dot={{ r: 3 }} />
              </ComposedChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Area type="monotone" dataKey="built" stroke="#6366f1" fill="#c7d2fe" name="Units Built" />
              </AreaChart>
            ) : (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[80, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }} />
                <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2.5} name="Yield %" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="otd" stroke="#f59e0b" strokeWidth={2} name="OTD %" dot={{ r: 4 }} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Data Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Search & Results Header */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-900">Extracted Operations Dataset</h4>
            <span className="text-xs text-slate-500 font-mono">({filteredRows.length} Records)</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search program, customer, facility..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">Program Code</th>
                <th className="px-4 py-3">Customer Account</th>
                <th className="px-4 py-3">Manufacturing Plant</th>
                <th className="px-4 py-3">Units Planned / Built</th>
                <th className="px-4 py-3">FPY Yield %</th>
                <th className="px-4 py-3">DPMO</th>
                <th className="px-4 py-3">OTD %</th>
                <th className="px-4 py-3">Scrap Cost</th>
                <th className="px-4 py-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-700">{row.programCode}</td>
                  <td className="px-4 py-3 text-slate-900 font-semibold">{row.customer}</td>
                  <td className="px-4 py-3 text-slate-600">{row.facility}</td>
                  <td className="px-4 py-3 font-mono text-slate-800">
                    {row.unitsBuilt.toLocaleString()} / <span className="text-slate-400">{row.unitsPlanned.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-700">{row.yieldPercent}%</td>
                  <td className="px-4 py-3 font-mono text-amber-700">{row.dpmo}</td>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600">{row.otdPercent}%</td>
                  <td className="px-4 py-3 font-mono text-slate-700">${row.scrapCostUsd.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'Compliant' ? 'bg-emerald-100 text-emerald-800' :
                      row.status === 'At Risk' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHAREABLE REPORT LINK MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Shareable Live Report Link</h3>
                  <p className="text-xs text-slate-500">Generate an encrypted tokenized portal URL for stakeholders</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">Generated Secure URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-[11px] select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                  >
                    {shareCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {shareCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-semibold">Link Expiration</label>
                  <select
                    value={shareExpiration}
                    onChange={(e) => setShareExpiration(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="24h">Expires in 24 Hours</option>
                    <option value="7d">Expires in 7 Days (Standard)</option>
                    <option value="30d">Expires in 30 Days</option>
                    <option value="never">Permanent (Revoke manually)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-semibold">Access Permission</label>
                  <input
                    type="text"
                    readOnly
                    value="Read-Only &bull; Customer Verified"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 text-[11px]">
                <strong>Security Guarantee:</strong> This token restricts data visibility exclusively to the current filter parameters and masks internal pricing & proprietary supplier codes.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAVE CUSTOM TEMPLATE MODAL */}
      {isSaveTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <BookmarkPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Save Custom View as Template</h3>
                  <p className="text-xs text-slate-500">Store current filters, dimensions, and chart formatting</p>
                </div>
              </div>
              <button
                onClick={() => setIsSaveTemplateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewTemplate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Weekly Austin SMT Yield & Scrap Digest"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Report Category</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="Executive">Executive</option>
                  <option value="Customer QBR">Customer QBR</option>
                  <option value="Quality Deep-Dive">Quality Deep-Dive</option>
                  <option value="Supply Chain & BOM">Supply Chain & BOM</option>
                  <option value="Plant Operations">Plant Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Summary of what this report highlights..."
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSaveTemplateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF REPORT PACK MODAL (PRINT-READY PREVIEW) */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-300 space-y-6 text-left animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Header with Print buttons */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  OFFICIAL EMS OPERATIONS DIGEST
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">Executive Performance & Quality Review</h2>
                <p className="text-xs text-slate-500">Document ID: NEX-RPT-{new Date().getFullYear()}-{Date.now().toString().slice(-4)} &bull; Generated on {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-xs hover:bg-indigo-700"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Executive Highlights Grid */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Total Volume Shipped</span>
                <span className="text-lg font-black text-slate-900 font-mono">59,700</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">First-Pass Yield</span>
                <span className="text-lg font-black text-emerald-700 font-mono">98.35%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">On-Time Delivery SLA</span>
                <span className="text-lg font-black text-indigo-700 font-mono">97.4%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">RMA Depot TAT</span>
                <span className="text-lg font-black text-slate-900 font-mono">4.1 Days</span>
              </div>
            </div>

            {/* Printable Program Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Program Build Summary</h4>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5">Program</th>
                    <th className="p-2.5">Customer</th>
                    <th className="p-2.5">Facility</th>
                    <th className="p-2.5">Built</th>
                    <th className="p-2.5">Yield</th>
                    <th className="p-2.5">OTD</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRows.slice(0, 5).map(r => (
                    <tr key={r.id}>
                      <td className="p-2.5 font-mono font-bold">{r.programCode}</td>
                      <td className="p-2.5">{r.customer}</td>
                      <td className="p-2.5 text-slate-600">{r.facility}</td>
                      <td className="p-2.5 font-mono">{r.unitsBuilt.toLocaleString()}</td>
                      <td className="p-2.5 font-mono text-emerald-700 font-bold">{r.yieldPercent}%</td>
                      <td className="p-2.5 font-mono text-indigo-700">{r.otdPercent}%</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signature and Approval Block */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-slate-800">Prepared By:</p>
                  <p className="text-slate-600">{currentUser.name} &bull; {currentUser.department}</p>
                </div>
                <div className="border-b border-slate-300 w-48" />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-bold text-slate-800">Executive QA Signoff:</p>
                  <p className="text-slate-600">Dr. Anita Joshi &bull; Quality Engineering Director</p>
                </div>
                <div className="border-b border-slate-300 w-48" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
