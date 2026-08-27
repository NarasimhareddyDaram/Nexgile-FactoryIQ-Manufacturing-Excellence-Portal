import React, { useState } from 'react';
import { StageGate, QualificationItem, Program, Role, User } from '../../types';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Cpu,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  GitCommit,
  GitPullRequest,
  Layers,
  ListOrdered,
  RotateCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface StageGatesStepperProps {
  stageGates: StageGate[];
  programs: Program[];
  selectedProgram?: Program | null;
  currentRole: Role | null;
  currentUser: User | null;
  onUpdateQualificationStatus?: (gateIndex: number, itemId: string, newStatus: 'passed' | 'failed' | 'in_progress') => void;
}

export function StageGatesStepper({
  stageGates,
  programs,
  selectedProgram,
  currentRole,
  currentUser
}: StageGatesStepperProps) {
  const [activeGateNumber, setActiveGateNumber] = useState<number>(3); // Default to PVT Gate 3
  const [activeSubTab, setActiveSubTab] = useState<'requirements' | 'design_reviews' | 'prototype_log' | 'qualification'>('qualification');
  const [localGates, setLocalGates] = useState<StageGate[]>(stageGates);
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'passed' | 'in_progress' | 'failed'>('all');

  const activeGate = localGates.find(g => g.gateNumber === activeGateNumber) || localGates[3] || localGates[0];

  const handleToggleStatus = (itemId: string, status: 'passed' | 'failed' | 'in_progress') => {
    setLocalGates(prev =>
      prev.map(gate => {
        if (gate.gateNumber !== activeGateNumber) return gate;
        return {
          ...gate,
          qualificationChecklist: gate.qualificationChecklist.map(item => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              status,
              testedBy: status === 'passed' ? (currentUser?.name || 'Dr. Anita Joshi') : item.testedBy,
              dateTested: status === 'passed' ? '2026-08-27' : item.dateTested
            };
          })
        };
      })
    );
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Verified Pass
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            <Clock className="h-3 w-3" /> Testing In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
            <XCircle className="h-3 w-3" /> Non-Compliant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
            Untested
          </span>
        );
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case 'approved_with_conditions':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" /> Approved w/ Conditions
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
            <Clock className="h-3.5 w-3.5" /> Pending Sign-off
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
    }
  };

  const filteredChecklist = activeGate.qualificationChecklist.filter(item => {
    if (checklistFilter === 'all') return true;
    return item.status === checklistFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Stepper Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                NPI STAGE GATE SYSTEM
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Stage 0 Concept → Stage 4 Full Ramp
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-600">
              Active Focus: {activeGate.gateCode} - {activeGate.title}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track requirements traceability, multi-disciplinary design reviews, hardware prototype iteration learnings, and qualification criteria sign-offs.
          </p>
        </div>

        {/* Interactive 5-Step Gate Stepper Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          {localGates.map((gate) => {
            const isSelected = activeGateNumber === gate.gateNumber;
            const isCompleted = gate.status === 'completed';
            const isActive = gate.status === 'active';

            return (
              <button
                key={gate.gateNumber}
                onClick={() => setActiveGateNumber(gate.gateNumber)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                    : isActive
                    ? 'border-indigo-300 bg-white hover:border-indigo-400'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {gate.gateCode}
                    </span>
                    {isCompleted ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : isActive ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold animate-pulse">
                        {gate.gateNumber}
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                        {gate.gateNumber}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {gate.title.split('(')[0].trim()}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {gate.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${isCompleted ? 'text-emerald-700' : isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {isCompleted ? 'Sign-Off Complete' : isActive ? 'Active Phase' : 'Upcoming'}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {gate.actualSignOff || gate.plannedSignOff}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Gate Content Sub-Tabs */}
      <div className="space-y-4">
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('qualification')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'qualification'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Qualification Checklist ({activeGate.qualificationChecklist.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('requirements')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'requirements'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Requirements Traceability ({activeGate.requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('design_reviews')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'design_reviews'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Design Review Sign-Offs ({activeGate.designReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prototype_log')}
            className={`pb-3 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'prototype_log'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Prototype Iteration Log ({activeGate.prototypeIterations.length})</span>
          </button>
        </div>

        {/* 1. Qualification Checklist Sub-Tab */}
        {activeSubTab === 'qualification' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Filter Status:</span>
                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  {(['all', 'passed', 'in_progress', 'failed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setChecklistFilter(filter)}
                      className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                        checklistFilter === filter
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {filter.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-slate-500">
                Interactive verification controls enabled for authorized roles
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Test Name & Standard</th>
                    <th className="py-3 px-4">Pass Criteria</th>
                    <th className="py-3 px-4">Measured Result</th>
                    <th className="py-3 px-4">Tested By & Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredChecklist.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.testName}</div>
                        <div className="text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">
                          {item.standardRef} • Sample: {item.sampleSize} units
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{item.passCriteria}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800">
                        {item.measuredResult || 'Pending execution'}
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">
                        <div className="text-slate-800 font-semibold">{item.testedBy}</div>
                        <div className="text-slate-400">{item.dateTested || 'In schedule'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.status === 'passed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Pass
                          </span>
                        ) : item.status === 'in_progress' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                            <Clock className="h-3.5 w-3.5" /> In Progress
                          </span>
                        ) : item.status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                            <XCircle className="h-3.5 w-3.5" /> Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-xs font-medium">
                            Not Started
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(item.id, 'passed')}
                            title="Mark as Passed"
                            className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold cursor-pointer"
                          >
                            Pass
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id, 'in_progress')}
                            title="Mark In-Progress"
                            className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold cursor-pointer"
                          >
                            Testing
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id, 'failed')}
                            title="Mark as Failed"
                            className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer"
                          >
                            Fail
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

        {/* 2. Requirements Traceability Sub-Tab */}
        {activeSubTab === 'requirements' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Req Code & Category</th>
                  <th className="py-3 px-4">Requirement Specification</th>
                  <th className="py-3 px-4">Target Spec</th>
                  <th className="py-3 px-4">Verification Method</th>
                  <th className="py-3 px-4">Test Case Ref</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeGate.requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {req.reqCode}
                      </span>
                      <div className="text-[10px] text-slate-500 font-semibold mt-1">
                        {req.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 leading-relaxed max-w-md">
                      {req.description}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      {req.targetSpec}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {req.verificationMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-indigo-600">
                      {req.testCaseRef}
                    </td>
                    <td className="py-3.5 px-4">{getVerificationBadge(req.verificationStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Design Review Approvals Sub-Tab */}
        {activeSubTab === 'design_reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGate.designReviews.length === 0 ? (
              <div className="col-span-2 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
                No formal design review sessions recorded for this upcoming phase yet.
              </div>
            ) : (
              activeGate.designReviews.map((dr) => (
                <div
                  key={dr.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {dr.gatePhase}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{dr.reviewTitle}</h4>
                    </div>
                    {getApprovalBadge(dr.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Reviewer & Authority</p>
                      <p className="font-bold text-slate-800">{dr.reviewerName}</p>
                      <p className="text-[10px] text-slate-500">{dr.reviewerRole}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Review Date</p>
                      <p className="font-bold text-slate-800">{dr.reviewDate}</p>
                      {dr.signatureTimestamp && (
                        <p className="text-[10px] text-emerald-600 font-medium">
                          Signed: {dr.signatureTimestamp.split('T')[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-800">Review Notes & Technical Findings:</p>
                    <p className="leading-relaxed text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      {dr.comments}
                    </p>
                  </div>

                  {dr.conditions && dr.conditions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <p className="font-bold text-amber-800 mb-1">Approved Conditional Items:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                        {dr.conditions.map((cond, idx) => (
                          <li key={idx}>{cond}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Prototype Iteration Log Sub-Tab */}
        {activeSubTab === 'prototype_log' && (
          <div className="space-y-3">
            {activeGate.prototypeIterations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
                No prototype builds for this upcoming phase.
              </div>
            ) : (
              activeGate.prototypeIterations.map((proto) => (
                <div
                  key={proto.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{proto.spinCode}</h4>
                        <p className="text-[11px] text-slate-500">
                          Built on {proto.buildDate} • Lead Engineer: {proto.leadEngineer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-medium">Build Quantity</span>
                        <p className="font-bold text-slate-800">{proto.quantityBuilt} units</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-medium">First Pass Yield</span>
                        <p className="font-bold text-emerald-600">{proto.yieldPercent}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-rose-50/60 p-3 border border-rose-100 space-y-1">
                      <p className="font-bold text-rose-900">Key Engineering Issues Identified:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                        {proto.keyIssuesFound.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-100 space-y-1">
                      <p className="font-bold text-emerald-900">Design Changes & Fixes Implemented:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                        {proto.designChangesImplemented.map((change, idx) => (
                          <li key={idx}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
