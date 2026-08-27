import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  FileText,
  Users,
  Shield,
  HelpCircle,
  Sparkles,
  GitCommit,
  CheckSquare,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { NCRCAPARecord, EightDReport, FiveWhyItem, ContainmentAction, CorrectiveActionItem } from '../../types';

interface EightDWizardModalProps {
  existingRecord?: NCRCAPARecord | null;
  onClose: () => void;
  onSave: (record: Partial<NCRCAPARecord>) => void;
}

export const EightDWizardModal: React.FC<EightDWizardModalProps> = ({
  existingRecord,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [recordType, setRecordType] = useState<'NCR' | 'CAPA'>(existingRecord?.recordType || 'CAPA');
  const [title, setTitle] = useState(existingRecord?.title || '');
  const [programCode, setProgramCode] = useState(existingRecord?.programCode || 'NX-VM-BMS-G3');
  const [programName, setProgramName] = useState(existingRecord?.programName || 'NextGen EV Battery Management System (BMS Gen-3)');
  const [facility, setFacility] = useState(existingRecord?.facility || 'Austin Giga-1 (Texas, USA)');
  const [productionLine, setProductionLine] = useState(existingRecord?.productionLine || 'SMT Line 1 - High-Speed Surface Mount');
  const [severity, setSeverity] = useState<'Critical' | 'Major' | 'Minor'>(existingRecord?.severity || 'Major');
  const [defectCategory, setDefectCategory] = useState(existingRecord?.defectCategory || 'Solder Defect / Bridging');
  const [affectedQuantity, setAffectedQuantity] = useState(existingRecord?.affectedQuantity || 150);

  // D1 Team
  const [d1Champion, setD1Champion] = useState(existingRecord?.eightD.d1_team.champion || 'Michael Reynolds (VP Quality)');
  const [d1Leader, setD1Leader] = useState(existingRecord?.eightD.d1_team.leader || 'Dr. Anita Joshi (Senior Quality Engineer)');
  const [d1Members, setD1Members] = useState<string>(existingRecord?.eightD.d1_team.members.join(', ') || 'Carlos Mendez, David Chen, Sarah Lin');
  const [d1CustomerRep, setD1CustomerRep] = useState(existingRecord?.eightD.d1_team.customerRepresentative || 'Dr. Elena Rostova (VoltMobility QA)');

  // D2 Problem
  const [d2Description, setD2Description] = useState(existingRecord?.eightD.d2_problem.description || '');
  const [d2What, setD2What] = useState(existingRecord?.eightD.d2_problem.whatOccurred || '');
  const [d2Where, setD2Where] = useState(existingRecord?.eightD.d2_problem.whereDetected || '');
  const [d2When, setD2When] = useState(existingRecord?.eightD.d2_problem.whenDetected || '2026-08-26 Shift 1');
  const [d2Lot, setD2Lot] = useState(existingRecord?.eightD.d2_problem.lotNumber || 'LOT-20260826-A');
  const [d2Photos, setD2Photos] = useState<{ name: string; url: string; caption: string }[]>(
    existingRecord?.eightD.d2_problem.photos || [
      {
        name: 'Optical Defect Macro View',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        caption: 'Microscope view of solder fillet bridge on pin 12'
      }
    ]
  );

  // D3 Containment
  const [d3QuarantineQty, setD3QuarantineQty] = useState(existingRecord?.eightD.d3_containment.quarantineQty || 150);
  const [d3SortingResults, setD3SortingResults] = useState(existingRecord?.eightD.d3_containment.sortingResults || '100% optical inspection completed on quarantined lot.');
  const [d3Actions, setD3Actions] = useState<ContainmentAction[]>(
    existingRecord?.eightD.d3_containment.actions || [
      { id: 'c1', action: 'Immediate quarantine of lot in Secure QA Cage 2', owner: 'Carlos Mendez', targetDate: '2026-08-26', status: 'completed' },
      { id: 'c2', action: '100% screening of WIP buffers on SMT Line 1', owner: 'David Chen', targetDate: '2026-08-26', status: 'completed' }
    ]
  );

  // D4 Root Cause (5-Why & Fishbone)
  const [d4PrimaryRootCause, setD4PrimaryRootCause] = useState(existingRecord?.eightD.d4_rootCause.primaryRootCause || '');
  const [d4EscapePoint, setD4EscapePoint] = useState(existingRecord?.eightD.d4_rootCause.escapePointRootCause || '');
  const [fiveWhys, setFiveWhys] = useState<FiveWhyItem[]>(
    existingRecord?.eightD.d4_rootCause.fiveWhys || [
      { step: 1, question: 'Why did the solder defect occur?', answer: 'Excessive solder paste height deposited.', verified: true },
      { step: 2, question: 'Why was paste height excessive?', answer: 'Stencil aperture was clogged with dry solder paste flux.', verified: true },
      { step: 3, question: 'Why was the aperture clogged?', answer: 'Under-stencil wipe vacuum cycle frequency was too low.', verified: true },
      { step: 4, question: 'Why was wipe frequency too low?', answer: 'Recipe parameter had not been updated for 0.4mm pitch.', verified: true },
      { step: 5, question: 'Why was recipe parameter not updated?', answer: 'NPI DFM design guideline lacked automated fine-pitch parameter checklist.', verified: true }
    ]
  );

  // Fishbone categories
  const [fishboneMan, setFishboneMan] = useState<string[]>(existingRecord?.eightD.d4_rootCause.fishbone.man || ['Operator missed visual check at shift handoff']);
  const [fishboneMachine, setFishboneMachine] = useState<string[]>(existingRecord?.eightD.d4_rootCause.fishbone.machine || ['DEK printer vacuum pressure 15% below spec']);
  const [fishboneMethod, setFishboneMethod] = useState<string[]>(existingRecord?.eightD.d4_rootCause.fishbone.method || ['Wipe cycle set to every 20 boards instead of 8']);
  const [fishboneMaterial, setFishboneMaterial] = useState<string[]>(existingRecord?.eightD.d4_rootCause.fishbone.material || ['Solder paste viscosity aged beyond 8 hours']);
  const [fishboneMeasurement, setFishboneMeasurement] = useState<string[]>(existingRecord?.eightD.d4_rootCause.fishbone.measurement || ['SPI alarm threshold ±30% was too wide']);
  const [fishboneEnvironment, setFishboneEnvironment] = useState<string[]>(existingRecord?.eightD.d4_rootCause.fishbone.environment || ['Cleanroom temperature was nominal (21°C)']);

  // D5 Corrective Actions
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionItem[]>(
    existingRecord?.eightD.d5_correctiveActions || [
      { id: 'ca1', action: 'Update SMT printer recipe with automated wipe every 8 boards', owner: 'David Chen', targetDate: '2026-08-28', status: 'completed', validationPlan: 'Validate on 50 consecutive boards with 0 bridge defects.' },
      { id: 'ca2', action: 'Tighten SPI recipe tolerance limit to ±18% IPC Class 3', owner: 'Dr. Anita Joshi', targetDate: '2026-08-29', status: 'in_progress', validationPlan: 'Verify 0 false rejects on 3 production lots.' }
    ]
  );

  // D6 Implementation & Results
  const [d6Results, setD6Results] = useState(existingRecord?.eightD.d6_implementation.resultsSummary || 'Post-implementation validation on 1,500 units achieved 0 defects.');
  const [d6PPM, setD6PPM] = useState(existingRecord?.eightD.d6_implementation.measuredPPM || 15);
  const [d6PfmeaUpdated, setD6PfmeaUpdated] = useState(existingRecord?.eightD.d6_implementation.pFMEAUpdated ?? true);
  const [d6ControlPlanUpdated, setD6ControlPlanUpdated] = useState(existingRecord?.eightD.d6_implementation.controlPlanUpdated ?? true);

  // D7 Preventive Actions
  const [d7SystemicActions, setD7SystemicActions] = useState<string[]>(
    existingRecord?.eightD.d7_preventiveActions.systemicActions || [
      'Standardize wipe cycle frequency in Global SMT Recipe Manual.',
      'Deploy RFID stencil lifecycle lockout across all 4 plants.'
    ]
  );

  // D8 Closure
  const [d8VerificationStatus, setD8VerificationStatus] = useState(existingRecord?.eightD.d8_closure.verificationStatus || 'Monitoring (30-Day)');
  const [d8QaApproval, setD8QaApproval] = useState(existingRecord?.eightD.d8_closure.qaManagerApproval || 'Dr. Anita Joshi (QA Lead)');
  const [d8CustomerApproval, setD8CustomerApproval] = useState(existingRecord?.eightD.d8_closure.customerApproval || 'Dr. Elena Rostova (VoltMobility QA)');
  const [d8Notes, setD8Notes] = useState(existingRecord?.eightD.d8_closure.finalNotes || 'Effectiveness audit scheduled after 30 days of clean production.');

  const stepTitles = [
    'General Info',
    'D1: Team',
    'D2: Problem Description',
    'D3: Containment',
    'D4: Root Cause (5-Why & Fishbone)',
    'D5: Corrective Actions',
    'D6: Implementation',
    'D7: Preventive Actions',
    'D8: Sign-Off'
  ];

  const handleAddPhoto = () => {
    const newPhoto = {
      name: `Defect Photo #${d2Photos.length + 1}`,
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
      caption: 'Attached optical microscopy scan'
    };
    setD2Photos([...d2Photos, newPhoto]);
  };

  const handleAddFiveWhy = () => {
    const nextStep = fiveWhys.length + 1;
    setFiveWhys([...fiveWhys, { step: nextStep, question: `Why did step ${nextStep - 1} occur?`, answer: '', verified: false }]);
  };

  const handleAddCorrectiveAction = () => {
    const newId = `ca-${Date.now()}`;
    setCorrectiveActions([...correctiveActions, { id: newId, action: '', owner: 'Quality Team', targetDate: '2026-09-15', status: 'planned', validationPlan: '' }]);
  };

  const handleSaveAll = () => {
    const recordPayload: Partial<NCRCAPARecord> = {
      id: existingRecord?.id || `${recordType}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      recordType,
      title: title || `${defectCategory} on ${programCode}`,
      programCode,
      programName,
      customerName: 'VoltMobility EV',
      facility,
      productionLine,
      severity,
      defectCategory,
      affectedQuantity,
      scrappedQuantity: 0,
      reworkedQuantity: affectedQuantity,
      costImpactUSD: affectedQuantity * 20,
      customerVisible: true,
      status: currentStep >= 7 ? 'Action Implemented' : currentStep >= 4 ? 'RCA In Progress' : 'Containment Active',
      createdDate: existingRecord?.createdDate || new Date().toISOString().split('T')[0],
      targetClosureDate: '2026-09-30',
      owner: d1Leader,
      eightD: {
        d1_team: {
          champion: d1Champion,
          leader: d1Leader,
          members: d1Members.split(',').map(m => m.trim()),
          customerRepresentative: d1CustomerRep
        },
        d2_problem: {
          description: d2Description,
          whatOccurred: d2What,
          whereDetected: d2Where,
          whenDetected: d2When,
          defectQuantity: affectedQuantity,
          lotNumber: d2Lot,
          photos: d2Photos
        },
        d3_containment: {
          actions: d3Actions,
          quarantineQty: d3QuarantineQty,
          sortingResults: d3SortingResults,
          customerNotificationSent: true
        },
        d4_rootCause: {
          primaryRootCause: d4PrimaryRootCause || 'Under-stencil wipe vacuum cycle frequency parameter was set too loose for 0.4mm pitch components.',
          escapePointRootCause: d4EscapePoint || 'CyberOptics SPI recipe tolerance limit was set to ±30% rather than automotive ±18%.',
          fiveWhys,
          fishbone: {
            man: fishboneMan,
            machine: fishboneMachine,
            method: fishboneMethod,
            material: fishboneMaterial,
            measurement: fishboneMeasurement,
            environment: fishboneEnvironment
          }
        },
        d5_correctiveActions: correctiveActions,
        d6_implementation: {
          implementationDate: '2026-08-28',
          measuredPPM: d6PPM,
          pFMEAUpdated: d6PfmeaUpdated,
          controlPlanUpdated: d6ControlPlanUpdated,
          resultsSummary: d6Results
        },
        d7_preventiveActions: {
          systemicActions: d7SystemicActions,
          lessonsLearnedLogged: true,
          sopUpdated: true,
          crossPlantTransferred: true
        },
        d8_closure: {
          qaManagerApproval: d8QaApproval,
          customerApproval: d8CustomerApproval,
          verificationStatus: d8VerificationStatus,
          effectivenessDays: 30,
          finalNotes: d8Notes
        }
      }
    };

    onSave(recordPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-2xs">
              8D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                  {recordType} Wizard
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Step {currentStep} of {stepTitles.length}: {stepTitles[currentStep - 1]}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {existingRecord ? `Edit ${existingRecord.id} - 8D Report` : 'Log Non-Conformance & Initiate 8D CAPA'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100/60 px-6 py-2 overflow-x-auto text-[11px] font-semibold text-slate-500">
          {stepTitles.map((st, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setCurrentStep(i + 1)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-lg transition ${
                  currentStep === i + 1
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : currentStep > i + 1
                    ? 'text-emerald-700 font-semibold hover:bg-slate-200'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {currentStep > i + 1 ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold">
                    {i + 1}
                  </span>
                )}
                <span>{st.split(':')[0]}</span>
              </button>
              {i < stepTitles.length - 1 && (
                <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* STEP 1: GENERAL INFO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Non-Conformance Classification & Assembly Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Issue Workflow Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRecordType('CAPA')}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold border transition ${
                        recordType === 'CAPA'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      CAPA (8D Formal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecordType('NCR')}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold border transition ${
                        recordType === 'NCR'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Internal NCR
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Critical">Critical (Line Stop / Safety / High Scrap)</option>
                    <option value="Major">Major (Specification Breach / Rework Required)</option>
                    <option value="Minor">Minor (Cosmetic / Process Deviation)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Issue Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Solder Bridging on 0.4mm Pitch BGA Driver IC"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Manufacturing Program</label>
                  <input
                    type="text"
                    value={programCode}
                    onChange={(e) => setProgramCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Defect Category</label>
                  <select
                    value={defectCategory}
                    onChange={(e) => setDefectCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Solder Defect / Bridging">Solder Defect / Bridging</option>
                    <option value="Component Tombstoning">Component Tombstoning</option>
                    <option value="Mechanical / Fastening Torque">Mechanical / Fastening Torque</option>
                    <option value="Conformal Coating / Thickness">Conformal Coating / Thickness</option>
                    <option value="BGA Voiding / Delamination">BGA Voiding / Delamination</option>
                    <option value="Electrical / Hi-Pot Failure">Electrical / Hi-Pot Failure</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Facility & Production Line</label>
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quantity Affected (Units)</label>
                  <input
                    type="number"
                    value={affectedQuantity}
                    onChange={(e) => setAffectedQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: D1 TEAM */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D1: Cross-Functional 8D Problem Solving Team
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Executive Champion</label>
                  <input
                    type="text"
                    value={d1Champion}
                    onChange={(e) => setD1Champion(e.target.value)}
                    placeholder="e.g. Michael Reynolds (VP Quality)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">8D Team Leader (Lead QE)</label>
                  <input
                    type="text"
                    value={d1Leader}
                    onChange={(e) => setD1Leader(e.target.value)}
                    placeholder="e.g. Dr. Anita Joshi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cross-Functional Members (comma separated)</label>
                  <input
                    type="text"
                    value={d1Members}
                    onChange={(e) => setD1Members(e.target.value)}
                    placeholder="Carlos Mendez (Ops), David Chen (SMT), Sarah Lin (QA)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Customer Quality Representative</label>
                  <input
                    type="text"
                    value={d1CustomerRep}
                    onChange={(e) => setD1CustomerRep(e.target.value)}
                    placeholder="e.g. Dr. Elena Rostova (VoltMobility Customer QA Lead)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: D2 PROBLEM DESCRIPTION & PHOTOS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D2: Problem Description & Physical Evidence (5W2H)
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Comprehensive Problem Statement</label>
                  <textarea
                    rows={3}
                    value={d2Description}
                    onChange={(e) => setD2Description(e.target.value)}
                    placeholder="Detail the symptom, functional test impact, and discrepancy against engineering drawing/IPC standard..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">What Occurred?</label>
                    <input
                      type="text"
                      value={d2What}
                      onChange={(e) => setD2What(e.target.value)}
                      placeholder="e.g. Solder bridge between pins 18-19"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Where Detected?</label>
                    <input
                      type="text"
                      value={d2Where}
                      onChange={(e) => setD2Where(e.target.value)}
                      placeholder="e.g. Station 3D-AOI Line 1 post-reflow"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">When Detected?</label>
                    <input
                      type="text"
                      value={d2When}
                      onChange={(e) => setD2When(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Lot / Batch Number</label>
                    <input
                      type="text"
                      value={d2Lot}
                      onChange={(e) => setD2Lot(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Photo Attachments */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Photographic Exhibits & Microscopy</span>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Defect Image</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {d2Photos.map((photo, pidx) => (
                      <div key={pidx} className="flex gap-3 rounded-xl border border-slate-200 p-2.5 bg-slate-50">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="h-16 w-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1 text-xs flex-1">
                          <p className="font-bold text-slate-800">{photo.name}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{photo.caption}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold">Attached & Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: D3 CONTAINMENT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D3: Immediate Containment Actions & Quarantine
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quarantined Quantity (Units)</label>
                  <input
                    type="number"
                    value={d3QuarantineQty}
                    onChange={(e) => setD3QuarantineQty(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sorting & Re-Screening Results</label>
                  <input
                    type="text"
                    value={d3SortingResults}
                    onChange={(e) => setD3SortingResults(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">Containment Actions Checklist:</span>
                {d3Actions.map((act, aidx) => (
                  <div key={aidx} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800">{act.action}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>Owner: <strong>{act.owner}</strong></span>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {act.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: D4 ROOT CAUSE (5-Why & Fishbone) */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D4: Root Cause Analysis (5-Why Tree & Fishbone Ishikawa)
              </h3>

              {/* 5-Why Builder */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Interactive 5-Why Iteration Tree
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFiveWhy}
                    className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Why Step</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {fiveWhys.map((why, widx) => (
                    <div key={widx} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span>Why #{why.step}: {why.question}</span>
                        <label className="flex items-center gap-1 text-[11px] font-normal cursor-pointer">
                          <input
                            type="checkbox"
                            checked={why.verified}
                            onChange={(e) => {
                              const updated = [...fiveWhys];
                              updated[widx].verified = e.target.checked;
                              setFiveWhys(updated);
                            }}
                            className="rounded text-blue-600"
                          />
                          <span>Empirically Verified</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={why.answer}
                        onChange={(e) => {
                          const updated = [...fiveWhys];
                          updated[widx].answer = e.target.value;
                          setFiveWhys(updated);
                        }}
                        placeholder="State the underlying cause for this step..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fishbone 6M Categories */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ishikawa Fishbone Diagram (6M Analysis)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="font-bold text-slate-800 block mb-1">Man (People)</span>
                    <p className="text-slate-600 text-[11px]">{fishboneMan.join('; ')}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="font-bold text-slate-800 block mb-1">Machine (Equipment)</span>
                    <p className="text-slate-600 text-[11px]">{fishboneMachine.join('; ')}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="font-bold text-slate-800 block mb-1">Method (Process)</span>
                    <p className="text-slate-600 text-[11px]">{fishboneMethod.join('; ')}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="font-bold text-slate-800 block mb-1">Material (Raw Components)</span>
                    <p className="text-slate-600 text-[11px]">{fishboneMaterial.join('; ')}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="font-bold text-slate-800 block mb-1">Measurement (Metrology)</span>
                    <p className="text-slate-600 text-[11px]">{fishboneMeasurement.join('; ')}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="font-bold text-slate-800 block mb-1">Environment</span>
                    <p className="text-slate-600 text-[11px]">{fishboneEnvironment.join('; ')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: D5 CORRECTIVE ACTIONS */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  D5: Permanent Corrective Actions & Verification Plan
                </h3>
                <button
                  type="button"
                  onClick={handleAddCorrectiveAction}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Action</span>
                </button>
              </div>

              <div className="space-y-3">
                {correctiveActions.map((ca, cidx) => (
                  <div key={cidx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Corrective Action #{cidx + 1}</span>
                      <select
                        value={ca.status}
                        onChange={(e) => {
                          const updated = [...correctiveActions];
                          updated[cidx].status = e.target.value as any;
                          setCorrectiveActions(updated);
                        }}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                      >
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={ca.action}
                      onChange={(e) => {
                        const updated = [...correctiveActions];
                        updated[cidx].action = e.target.value;
                        setCorrectiveActions(updated);
                      }}
                      placeholder="Specify the engineering or process change..."
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Owner</label>
                        <input
                          type="text"
                          value={ca.owner}
                          onChange={(e) => {
                            const updated = [...correctiveActions];
                            updated[cidx].owner = e.target.value;
                            setCorrectiveActions(updated);
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Date</label>
                        <input
                          type="text"
                          value={ca.targetDate}
                          onChange={(e) => {
                            const updated = [...correctiveActions];
                            updated[cidx].targetDate = e.target.value;
                            setCorrectiveActions(updated);
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: D6 IMPLEMENTATION & VALIDATION */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D6: Implementation & Validation Data
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Validation Results Summary</label>
                  <textarea
                    rows={3}
                    value={d6Results}
                    onChange={(e) => setD6Results(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Measured Post-Fix PPM</label>
                    <input
                      type="number"
                      value={d6PPM}
                      onChange={(e) => setD6PPM(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-emerald-700"
                    />
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d6PfmeaUpdated}
                        onChange={(e) => setD6PfmeaUpdated(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Process FMEA (pFMEA) Updated & RPN Recalculated</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d6ControlPlanUpdated}
                        onChange={(e) => setD6ControlPlanUpdated(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Manufacturing Control Plan Updated with New Limits</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: D7 PREVENTIVE ACTIONS */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D7: Systemic Preventive Actions & Knowledge Transfer
              </h3>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Cross-Plant Systemic Preventative Measures:</span>
                {d7SystemicActions.map((act, sidx) => (
                  <div key={sidx} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50 text-xs">
                    <CheckSquare className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-800">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: D8 CLOSURE & SIGN-OFF */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                D8: Final Team Sign-Off & Effectiveness Verification
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Verification Status</label>
                  <select
                    value={d8VerificationStatus}
                    onChange={(e) => setD8VerificationStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-emerald-700"
                  >
                    <option value="Verified Effective">Verified Effective (Closed)</option>
                    <option value="Monitoring (30-Day)">Monitoring (30-Day Window Active)</option>
                    <option value="Pending Sign-Off">Pending Sign-Off</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">QA Manager Sign-Off</label>
                  <input
                    type="text"
                    value={d8QaApproval}
                    onChange={(e) => setD8QaApproval(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Customer Quality Approval Sign-Off</label>
                  <input
                    type="text"
                    value={d8CustomerApproval}
                    onChange={(e) => setD8CustomerApproval(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Closure / Review Notes</label>
                  <textarea
                    rows={2}
                    value={d8Notes}
                    onChange={(e) => setD8Notes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            {currentStep < stepTitles.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(stepTitles.length, prev + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
              >
                <span>Next Step</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAll}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save & Complete 8D Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
