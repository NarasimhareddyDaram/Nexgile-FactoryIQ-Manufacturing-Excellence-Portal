import React, { useState } from 'react';
import {
  Layout,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  ShieldCheck,
  Cpu,
  FolderGit2,
  Wrench,
  DollarSign,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Filter,
  Eye,
  EyeOff,
  GitMerge,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Role, User, CustomerDashboardWidget } from '../../types';
import { INITIAL_CUSTOMER_WIDGETS } from '../../data/analyticsData';
import { INITIAL_PROGRAMS } from '../../data/initialData';

interface CustomerDashboardTabProps {
  currentRole: Role;
  currentUser: User;
}

export const CustomerDashboardTab: React.FC<CustomerDashboardTabProps> = ({
  currentRole,
  currentUser
}) => {
  const [widgets, setWidgets] = useState<CustomerDashboardWidget[]>(INITIAL_CUSTOMER_WIDGETS);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('VoltMobility EV');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'default' | 'engineering' | 'procurement' | 'quality'>('default');

  // Filter programs for the selected customer
  const customerPrograms = INITIAL_PROGRAMS.filter(p => p.customerName === selectedCustomer);

  // Widget management handlers
  const handleToggleVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isVisible: !w.isVisible } : w));
  };

  const handleToggleWidth = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, width: w.width === 'half' ? 'full' : 'half' } : w));
  };

  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;
    setWidgets(newWidgets);
  };

  const handleResetLayout = () => {
    setWidgets(INITIAL_CUSTOMER_WIDGETS);
    setActivePreset('default');
  };

  const handleApplyPreset = (preset: 'default' | 'engineering' | 'procurement' | 'quality') => {
    setActivePreset(preset);
    if (preset === 'engineering') {
      setWidgets([
        { ...INITIAL_CUSTOMER_WIDGETS[0], isVisible: true, width: 'full' }, // project status
        { ...INITIAL_CUSTOMER_WIDGETS[1], isVisible: true, width: 'half' }, // quality
        { ...INITIAL_CUSTOMER_WIDGETS[4], isVisible: true, width: 'half' }, // documents
        { ...INITIAL_CUSTOMER_WIDGETS[3], isVisible: true, width: 'full' }, // smt pace
        { ...INITIAL_CUSTOMER_WIDGETS[2], isVisible: false, width: 'half' },
        { ...INITIAL_CUSTOMER_WIDGETS[5], isVisible: false, width: 'half' }
      ]);
    } else if (preset === 'procurement') {
      setWidgets([
        { ...INITIAL_CUSTOMER_WIDGETS[2], isVisible: true, width: 'full' }, // shipments
        { ...INITIAL_CUSTOMER_WIDGETS[0], isVisible: true, width: 'half' }, // project status
        { ...INITIAL_CUSTOMER_WIDGETS[3], isVisible: true, width: 'half' }, // smt pace
        { ...INITIAL_CUSTOMER_WIDGETS[1], isVisible: false, width: 'half' },
        { ...INITIAL_CUSTOMER_WIDGETS[4], isVisible: true, width: 'full' }, // documents
        { ...INITIAL_CUSTOMER_WIDGETS[5], isVisible: false, width: 'half' }
      ]);
    } else if (preset === 'quality') {
      setWidgets([
        { ...INITIAL_CUSTOMER_WIDGETS[1], isVisible: true, width: 'full' }, // quality
        { ...INITIAL_CUSTOMER_WIDGETS[0], isVisible: true, width: 'half' }, // project status
        { ...INITIAL_CUSTOMER_WIDGETS[5], isVisible: true, width: 'half' }, // rma status
        { ...INITIAL_CUSTOMER_WIDGETS[4], isVisible: true, width: 'half' }, // documents
        { ...INITIAL_CUSTOMER_WIDGETS[3], isVisible: true, width: 'half' }, // smt pace
        { ...INITIAL_CUSTOMER_WIDGETS[2], isVisible: false, width: 'half' }
      ]);
    } else {
      setWidgets(INITIAL_CUSTOMER_WIDGETS);
    }
  };

  // Mock data for widget charts
  const weeklyYieldData = [
    { week: 'Wk 31', yield: 97.8, target: 98.0 },
    { week: 'Wk 32', yield: 98.1, target: 98.0 },
    { week: 'Wk 33', yield: 97.9, target: 98.0 },
    { week: 'Wk 34', yield: 98.6, target: 98.0 },
    { week: 'Wk 35', yield: 98.4, target: 98.0 }
  ];

  const defectCategories = [
    { name: 'Solder Bridge', value: 38, color: '#6366f1' },
    { name: 'Tombstoning', value: 24, color: '#06b6d4' },
    { name: 'BGA Void', value: 18, color: '#f59e0b' },
    { name: 'Component Skew', value: 12, color: '#10b981' },
    { name: 'Insufficient Solder', value: 8, color: '#ec4899' }
  ];

  const smtBuildPace = [
    { day: 'Mon', planned: 2400, actual: 2450 },
    { day: 'Tue', planned: 2400, actual: 2380 },
    { day: 'Wed', planned: 2400, actual: 2510 },
    { day: 'Thu', planned: 2400, actual: 2420 },
    { day: 'Fri', planned: 2400, actual: 2600 }
  ];

  return (
    <div id="customer-configurable-dashboard" className="space-y-6 text-left">
      {/* Top Customer Filter & Customize Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Customized Customer Program Cockpit</h3>
            <p className="text-xs text-slate-500">
              Personalized workspace showing live production, test telemetry, shipments, and controlled drawings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Customer account selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Customer View:</span>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="VoltMobility EV">VoltMobility EV (Automotive)</option>
              <option value="Apex BioMedical Devices">Apex BioMedical Devices (MedTech)</option>
              <option value="AeroSys Avionics">AeroSys Avionics (Aerospace)</option>
              <option value="Orion Warehouse Robotics">Orion Warehouse Robotics (Industrial)</option>
            </select>
          </div>

          {/* Customize Layout button */}
          <button
            type="button"
            onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isCustomizeOpen
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isCustomizeOpen ? 'Close Customizer' : 'Customize Widgets'}
          </button>
        </div>
      </div>

      {/* Customizer Drawer / Control Panel */}
      {isCustomizeOpen && (
        <div className="bg-indigo-950 text-white p-5 rounded-2xl shadow-lg border border-indigo-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm">Widget Layout Manager & Persona Presets</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetLayout}
                className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white px-2 py-1 rounded bg-indigo-900/60 border border-indigo-700"
              >
                <RotateCcw className="w-3 h-3" /> Reset Default
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-indigo-300 font-semibold">Quick Role Presets:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('default')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${activePreset === 'default' ? 'bg-indigo-500 text-white font-bold' : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'}`}
            >
              Standard Overview
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('engineering')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${activePreset === 'engineering' ? 'bg-indigo-500 text-white font-bold' : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'}`}
            >
              Engineering & DFM Focus
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('procurement')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${activePreset === 'procurement' ? 'bg-indigo-500 text-white font-bold' : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'}`}
            >
              Procurement & Logistics
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('quality')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${activePreset === 'quality' ? 'bg-indigo-500 text-white font-bold' : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'}`}
            >
              Quality & RMA Assurance
            </button>
          </div>

          {/* Reorder & Visibility List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {widgets.map((widget, idx) => (
              <div
                key={widget.id}
                className="bg-indigo-900/50 p-3 rounded-xl border border-indigo-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-indigo-800 flex items-center justify-center font-mono font-bold text-[10px] text-indigo-300">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white truncate">{widget.title}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleWidth(widget.id)}
                    title={widget.width === 'half' ? 'Make Full Width' : 'Make Half Width'}
                    className="p-1 text-indigo-300 hover:text-white bg-indigo-800/80 rounded"
                  >
                    {widget.width === 'half' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveWidget(idx, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1 text-indigo-300 hover:text-white bg-indigo-800/80 rounded disabled:opacity-30"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveWidget(idx, 'down')}
                    disabled={idx === widgets.length - 1}
                    title="Move Down"
                    className="p-1 text-indigo-300 hover:text-white bg-indigo-800/80 rounded disabled:opacity-30"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(widget.id)}
                    title={widget.isVisible ? 'Hide Widget' : 'Show Widget'}
                    className={`p-1 rounded ${widget.isVisible ? 'text-emerald-400 bg-emerald-950/80' : 'text-slate-400 bg-indigo-950'}`}
                  >
                    {widget.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Active Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.filter(w => w.isVisible).map((widget, idx) => {
          const isFull = widget.width === 'full';

          return (
            <div
              key={widget.id}
              className={`bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all ${
                isFull ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              {/* Widget Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    {widget.type === 'project_status' && <GitMerge className="w-4 h-4" />}
                    {widget.type === 'quality_summary' && <ShieldCheck className="w-4 h-4" />}
                    {widget.type === 'shipments' && <Truck className="w-4 h-4" />}
                    {widget.type === 'smt_progress' && <Cpu className="w-4 h-4" />}
                    {widget.type === 'documents' && <FolderGit2 className="w-4 h-4" />}
                    {widget.type === 'rma_status' && <Wrench className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{widget.title}</h4>
                    <p className="text-xs text-slate-500">{widget.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {widget.width === 'full' ? 'Full Width' : 'Standard'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleWidth(widget.id)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Toggle Width"
                  >
                    {widget.width === 'half' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Widget Specific Body */}
              <div className="flex-1">
                {/* WIDGET 1: Project Status & Milestones */}
                {widget.type === 'project_status' && (
                  <div className="space-y-3 text-xs">
                    {customerPrograms.length > 0 ? (
                      customerPrograms.map(prog => (
                        <div key={prog.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-mono font-bold text-indigo-700 mr-2">{prog.code}</span>
                              <span className="font-bold text-slate-900">{prog.name}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prog.health === 'green' ? 'bg-emerald-100 text-emerald-800' :
                              prog.health === 'yellow' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {prog.health.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-slate-600 text-[11px]">
                            <span>Stage: <strong>{prog.stage}</strong></span>
                            <span>Target Launch: <strong>{prog.targetLaunchDate}</strong></span>
                            <span>Yield: <strong className="text-emerald-700">{prog.currentYieldPercent}%</strong></span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>Phase Completion</span>
                              <span className="font-mono font-bold">{prog.progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all"
                                style={{ width: `${prog.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-lg">
                        No active programs registered for {selectedCustomer}.
                      </div>
                    )}
                  </div>
                )}

                {/* WIDGET 2: Quality & Yield Summary */}
                {widget.type === 'quality_summary' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weeklyYieldData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                            <YAxis domain={[96, 100]} unit="%" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: '11px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px' }} />
                            <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2} name="First-Pass Yield" dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center font-mono">5-Week First-Pass Yield: 98.4% Avg</p>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Top Defect Pareto (Past 30 Days)</span>
                      {defectCategories.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                          <span className="text-slate-700 font-medium">{item.name}</span>
                          <span className="font-mono font-bold text-slate-900">{item.value}%</span>
                        </div>
                      ))}
                      <div className="pt-1 text-[11px] text-emerald-700 font-medium">
                        &bull; AOI automated optical inspection yield: 99.1%
                      </div>
                    </div>
                  </div>
                )}

                {/* WIDGET 3: Live Finished Goods Shipments */}
                {widget.type === 'shipments' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-indigo-600" />
                          <span className="font-mono font-bold text-slate-900">DHL Express #9482-0192-US</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                          In-Transit (Flight DH892)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 text-[11px]">
                        <span>Route: <strong>Austin (ATX) &rarr; Fremont Hub (SJC)</strong></span>
                        <span>Quantity: <strong>4,800 units</strong></span>
                        <span>ETA: <strong className="text-emerald-700">Tomorrow 09:30 AM</strong></span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          <span className="font-mono font-bold text-slate-900">FedEx Priority #7810-4491-EU</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Customs Cleared &bull; Delivered
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 text-[11px]">
                        <span>Route: <strong>Austin (ATX) &rarr; Frankfurt Hub (FRA)</strong></span>
                        <span>Quantity: <strong>1,200 units</strong></span>
                        <span>Delivered: <strong>Aug 25, 14:15</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* WIDGET 4: SMT Build Progress Pace */}
                {widget.type === 'smt_progress' && (
                  <div className="space-y-3">
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={smtBuildPace}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 3000]} tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ fontSize: '11px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px' }} />
                          <Bar dataKey="planned" fill="#e2e8f0" name="Planned Run-Rate" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="actual" fill="#4f46e5" name="Actual Built" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg text-slate-600">
                      <span>Weekly Run-Rate Adherence: <strong className="text-emerald-700 font-mono">102.4%</strong></span>
                      <span>SMT Line 1 OEE: <strong className="text-slate-900 font-mono">89.2%</strong></span>
                    </div>
                  </div>
                )}

                {/* WIDGET 5: Controlled Engineering Documents */}
                {widget.type === 'documents' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="font-bold text-slate-900">NX-BMS-G3_SCHEMATIC_REV_D.pdf</p>
                          <p className="text-[10px] text-slate-500 font-mono">Released: Aug 24, 2026 &bull; Baseline Approved</p>
                        </div>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-teal-600" />
                        <div>
                          <p className="font-bold text-slate-900">NX-BMS-G3_FAI_AS9102_REPORT_PACK.zip</p>
                          <p className="text-[10px] text-slate-500 font-mono">Released: Aug 22, 2026 &bull; 100% Passed</p>
                        </div>
                      </div>
                      <button className="text-teal-600 hover:text-teal-800 text-xs font-semibold flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> ZIP
                      </button>
                    </div>
                  </div>
                )}

                {/* WIDGET 6: RMA Depot Returns */}
                {widget.type === 'rma_status' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-900">RMA-2026-0814</span>
                        <p className="text-[11px] text-slate-600">3 units &bull; Inverter Gate Snubber Triage</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Rework in Progress
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-900">RMA-2026-0792</span>
                        <p className="text-[11px] text-slate-600">1 unit &bull; Flash Firmware Re-burn</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Shipped Back (TAT: 3.2d)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
