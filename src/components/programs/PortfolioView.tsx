import React, { useState, useMemo } from 'react';
import {
  Program,
  Role,
  User,
  StatusHistoryRecord,
  HealthStatus,
  ProgramStage
} from '../../types';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  GitBranch,
  Layers,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User as UserIcon,
  Activity,
  History,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Cpu,
  AlertTriangle
} from 'lucide-react';

interface PortfolioViewProps {
  programs: Program[];
  statusHistory: StatusHistoryRecord[];
  currentRole: Role | null;
  currentUser: User | null;
  onSelectProgram: (program: Program) => void;
  onOpenStatusHistory: (program?: Program) => void;
  onOpenNewProgram: () => void;
}

export function PortfolioView({
  programs,
  statusHistory,
  currentRole,
  currentUser,
  onSelectProgram,
  onOpenStatusHistory,
  onOpenNewProgram
}: PortfolioViewProps) {
  const [search, setSearch] = useState('');
  const [selectedHealth, setSelectedHealth] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Facilities list for filter
  const facilities = useMemo(() => {
    const set = new Set(programs.map(p => p.facility));
    return Array.from(set);
  }, [programs]);

  // Stages list for filter
  const stages: ProgramStage[] = [
    'R&D Concept',
    'EVT (Engineering Validation)',
    'DVT (Design Validation)',
    'PVT (Production Validation)',
    'Mass Production (Ramp)',
    'Sustaining / EOL'
  ];

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.customerName.toLowerCase().includes(search.toLowerCase()) ||
        p.facility.toLowerCase().includes(search.toLowerCase());

      const matchHealth = selectedHealth === 'all' || p.health === selectedHealth;
      const matchStage = selectedStage === 'all' || p.stage === selectedStage;
      const matchFacility = selectedFacility === 'all' || p.facility === selectedFacility;

      return matchSearch && matchHealth && matchStage && matchFacility;
    });
  }, [programs, search, selectedHealth, selectedStage, selectedFacility]);

  // Aggregate KPI stats
  const totalPrograms = programs.length;
  const greenCount = programs.filter(p => p.health === 'green').length;
  const yellowCount = programs.filter(p => p.health === 'yellow').length;
  const redCount = programs.filter(p => p.health === 'red').length;
  const avgYield = (
    programs.reduce((acc, p) => acc + p.currentYieldPercent, 0) / (programs.length || 1)
  ).toFixed(1);
  const totalUnitsBuilt = programs.reduce((acc, p) => acc + p.currentUnitsBuilt, 0);

  const getHealthBadge = (health: HealthStatus) => {
    switch (health) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Green (On Track)
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Yellow (At Risk)
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            Red (Critical)
          </span>
        );
    }
  };

  const getStageBadge = (stage: ProgramStage) => {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
        <GitBranch className="h-3 w-3 text-indigo-500" />
        {stage}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top High-Level Portfolio KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500">Total Programs</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{totalPrograms}</span>
            <Boxes className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Multi-site portfolio</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500">Healthy (Green)</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-600">{greenCount}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            {((greenCount / totalPrograms) * 100).toFixed(0)}% on schedule
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500">At Risk (Yellow)</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-amber-600">{yellowCount}</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">Mitigations active</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500">Critical (Red)</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-rose-600">{redCount}</span>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-[10px] text-rose-600 font-medium mt-1">Immediate focus</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500">Portfolio Avg Yield</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{avgYield}%</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">First-pass average</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-slate-500">Total Units Built</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-indigo-600">{totalUnitsBuilt.toLocaleString()}</span>
            <Cpu className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across all lines</p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs, codes, customers, sites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
            </div>

            <button
              onClick={() => onOpenStatusHistory()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <History className="h-3.5 w-3.5 text-indigo-600" />
              <span>Full Status Log</span>
            </button>

            {currentRole?.category === 'internal' && (
              <button
                onClick={onOpenNewProgram}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Program</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filters:
          </span>

          {/* Health Filter */}
          <select
            value={selectedHealth}
            onChange={(e) => setSelectedHealth(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Health Statuses</option>
            <option value="green">Green (On Track)</option>
            <option value="yellow">Yellow (At Risk)</option>
            <option value="red">Red (Critical)</option>
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All NPI Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Facility Filter */}
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="all">All Sites / Facilities</option>
            {facilities.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {(selectedHealth !== 'all' || selectedStage !== 'all' || selectedFacility !== 'all' || search) && (
            <button
              onClick={() => {
                setSelectedHealth('all');
                setSelectedStage('all');
                setSelectedFacility('all');
                setSearch('');
              }}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline ml-2"
            >
              Reset Filters
            </button>
          )}

          <div className="ml-auto text-[11px] text-slate-400 font-medium">
            Showing {filteredPrograms.length} of {programs.length} programs
          </div>
        </div>
      </div>

      {/* Program Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((program) => {
            const programHistory = statusHistory.filter(sh => sh.programId === program.id);
            const latestHistory = programHistory[0];

            return (
              <div
                key={program.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Bar: Code & Health */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                        {program.code}
                      </span>
                    </div>
                    {getHealthBadge(program.health)}
                  </div>

                  {/* Program Title */}
                  <h3
                    onClick={() => onSelectProgram(program)}
                    className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {program.name}
                  </h3>

                  {/* Customer and Category */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{program.customerName}</span>
                    <span>•</span>
                    <span className="truncate">{program.productCategory}</span>
                  </div>

                  {/* Stage and Location */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {getStageBadge(program.stage)}
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {program.facility.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">NPI Progress</span>
                      <span className="font-bold text-slate-800">{program.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          program.health === 'green'
                            ? 'bg-emerald-500'
                            : program.health === 'yellow'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${program.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Snapshot */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 text-center text-xs border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">FPY Yield</p>
                      <p className="font-bold text-slate-800">{program.currentYieldPercent}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Units Built</p>
                      <p className="font-bold text-slate-800">{program.currentUnitsBuilt.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Target Launch</p>
                      <p className="font-bold text-slate-800 text-[11px]">{program.targetLaunchDate}</p>
                    </div>
                  </div>

                  {/* Latest Status Note Preview */}
                  {latestHistory && (
                    <div className="mt-3 p-2 rounded-lg bg-slate-50/70 border border-slate-200/60 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      <span className="font-bold text-slate-700">Latest Update: </span>
                      {latestHistory.reason}
                    </div>
                  )}
                </div>

                {/* Card Footer with Click Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenStatusHistory(program)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Status History ({programHistory.length})</span>
                  </button>

                  <button
                    onClick={() => onSelectProgram(program)}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Program & Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Site / Location</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Health</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Yield</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map((program) => (
                  <tr
                    key={program.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => onSelectProgram(program)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                        {program.name}
                      </div>
                      <div className="font-mono text-[10px] text-indigo-600 font-semibold mt-0.5">
                        {program.code}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{program.customerName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{program.facility}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStageBadge(program.stage)}</td>
                    <td className="py-3 px-4">{getHealthBadge(program.health)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              program.health === 'green'
                                ? 'bg-emerald-500'
                                : program.health === 'yellow'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${program.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700">{program.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{program.currentYieldPercent}%</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{program.targetLaunchDate}</td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenStatusHistory(program)}
                          title="View Status History"
                          className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onSelectProgram(program)}
                          title="View Details"
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
