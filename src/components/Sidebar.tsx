import React from 'react';
import {
  LayoutDashboard,
  GitMerge,
  Cpu,
  ShieldCheck,
  Boxes,
  Wrench,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Database,
  History,
  CheckCircle2,
  Lock,
  Eye,
  ExternalLink,
  Activity,
  BarChart3
} from 'lucide-react';
import { NavigationSectionId, NavSectionConfig, Role, User } from '../types';

interface SidebarProps {
  currentSection: NavigationSectionId;
  onSelectSection: (sectionId: NavigationSectionId) => void;
  sections: NavSectionConfig[];
  currentRole: Role;
  currentUser: User;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenStatusHistory: () => void;
  onOpenDatabaseSchema: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  sections,
  currentRole,
  currentUser,
  collapsed,
  onToggleCollapse,
  onOpenStatusHistory,
  onOpenDatabaseSchema
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="h-4 w-4 shrink-0" />;
      case 'GitMerge':
        return <GitMerge className="h-4 w-4 shrink-0" />;
      case 'Cpu':
        return <Cpu className="h-4 w-4 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-4 w-4 shrink-0" />;
      case 'Boxes':
        return <Boxes className="h-4 w-4 shrink-0" />;
      case 'Wrench':
        return <Wrench className="h-4 w-4 shrink-0" />;
      case 'FolderGit2':
        return <FolderGit2 className="h-4 w-4 shrink-0" />;
      case 'BarChart3':
        return <BarChart3 className="h-4 w-4 shrink-0" />;
      default:
        return <LayoutDashboard className="h-4 w-4 shrink-0" />;
    }
  };

  const isInternal = currentRole.category === 'internal';

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-200 z-20 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operations Portal
            </span>
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 rounded-full bg-emerald-400" />
        )}

        <button
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {!collapsed && 'Core Modules'}
        </div>

        {sections.map((section) => {
          const isActive = currentSection === section.id;
          return (
            <button
              key={section.id}
              id={`nav-${section.id}`}
              onClick={() => onSelectSection(section.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={collapsed ? section.label : undefined}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`}>
                {getIcon(section.iconName)}
              </div>

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between text-left truncate">
                  <span className="truncate">{section.label}</span>
                  {section.badge && (
                    <span
                      className={`ml-1.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {section.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Database & History Quick Tools */}
        <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {!collapsed && 'System & Auditing'}
        </div>

        <button
          onClick={onOpenStatusHistory}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
          title="Status History Audit Log"
        >
          <History className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-400" />
          {!collapsed && <span>Status Audit Log</span>}
        </button>

        <button
          onClick={onOpenDatabaseSchema}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
          title="Supabase Schema Script"
        >
          <Database className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-400" />
          {!collapsed && <span>Database Schema</span>}
        </button>
      </div>

      {/* Sleek Theme Telemetry & Role Footer */}
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          {/* Production Health Meter from Sleek Design */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Production Health</span>
              <span className="text-emerald-400 font-bold">98.2%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[98%]" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-2.5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Role</span>
              <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  isInternal ? 'bg-indigo-900/80 text-indigo-300' : 'bg-emerald-900/80 text-emerald-300'
                }`}
              >
                {isInternal ? 'Internal' : 'Customer'}
              </span>
            </div>
            <p className="font-semibold text-white truncate">{currentRole.name}</p>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {currentRole.focusArea}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800 text-center">
          <div
            className={`mx-auto h-2.5 w-2.5 rounded-full ${
              isInternal ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}
            title={`${currentRole.name} (${currentRole.category})`}
          />
        </div>
      )}
    </aside>
  );
};
