import React, { useState } from 'react';
import {
  GitMerge,
  Cpu,
  ShieldCheck,
  Boxes,
  Wrench,
  FolderGit2,
  Lock,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  FileCode2,
  Activity,
  AlertCircle
} from 'lucide-react';
import { NavSectionConfig, Role, User } from '../types';

interface PlaceholderModulePageProps {
  section: NavSectionConfig;
  currentRole: Role;
  currentUser: User;
  onNavigateHome: () => void;
}

export const PlaceholderModulePage: React.FC<PlaceholderModulePageProps> = ({
  section,
  currentRole,
  currentUser,
  onNavigateHome
}) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState('');

  const isInternal = currentRole.category === 'internal';

  const getModuleIcon = (iconName: string) => {
    const iconClass = "h-7 w-7 text-indigo-600";
    switch (iconName) {
      case 'GitMerge':
        return <GitMerge className={iconClass} />;
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Boxes':
        return <Boxes className={iconClass} />;
      case 'Wrench':
        return <Wrench className={iconClass} />;
      case 'FolderGit2':
        return <FolderGit2 className={iconClass} />;
      default:
        return <Layers className={iconClass} />;
    }
  };

  const handleSimulateAction = (featureName: string) => {
    setSimulationActive(true);
    setSimulationMessage(`Ready for Next Phase: "${featureName}" sub-module architecture is configured and ready to be built in detail on your prompt.`);
    setTimeout(() => {
      setSimulationActive(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Banner Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 shadow-2xs shrink-0">
              {getModuleIcon(section.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Manufacturing Module
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                  Phase Ready
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {section.label}
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            ← Back to Overview Dashboard
          </button>
        </div>
      </div>

      {/* Role-Specific Perspective Split Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer View Card */}
        <div
          className={`rounded-xl border p-5 transition-all ${
            !isInternal
              ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs ring-1 ring-emerald-400/20'
              : 'bg-white border-slate-200 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-emerald-600" /> Customer Perspective
            </span>
            {!isInternal && (
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                Active View
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-800 mb-2">
            Executive Milestone & Summary Level Visibility
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {section.customerVisibilitySummary}
          </p>
        </div>

        {/* Internal View Card */}
        <div
          className={`rounded-xl border p-5 transition-all ${
            isInternal
              ? 'bg-indigo-50/50 border-indigo-300 shadow-2xs ring-1 ring-indigo-400/20'
              : 'bg-white border-slate-200 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-indigo-600" /> Internal Operations Perspective
            </span>
            {isInternal && (
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                Active View
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-800 mb-2">
            Deep Shopfloor Telemetry & Root Cause Engineering Detail
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {section.internalVisibilitySummary}
          </p>
        </div>
      </div>

      {/* Planned Feature Architecture Wireframe Placeholder */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Module Architecture & Sub-Components
            </h2>
            <p className="text-xs text-slate-500">
              This module shell is linked and ready to be built in detail on your request.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Navigation Linked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {section.plannedFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 flex flex-col justify-between hover:bg-white hover:border-indigo-400 hover:shadow-2xs transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sub-Module 0{idx + 1}
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500 opacity-60 group-hover:opacity-100" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 leading-snug">{feat}</h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70">
                <button
                  onClick={() => handleSimulateAction(feat)}
                  className="w-full py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-[11px] font-semibold text-slate-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ready for Next Phase</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Alert if simulation clicked */}
        {simulationActive && (
          <div className="mt-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
            <p className="font-medium">{simulationMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
