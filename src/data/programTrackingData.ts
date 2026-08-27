import {
  GanttTask,
  WorkOrder,
  StageGate,
  BOMItem,
  EngineeringDrawing,
  EngineeringSpec,
  ECO,
  EvidenceFile
} from '../types';

export const INITIAL_GANTT_TASKS: GanttTask[] = [
  // EV Battery Management System (BMS Gen-3) - NX-VM-BMS-G3
  {
    id: 'gt-01',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'EVT Hardware Freeze & Architecture Sign-Off',
    phase: 'EVT',
    owner: 'David Chen (Power Electronics)',
    plannedStartDate: '2026-01-10',
    plannedEndDate: '2026-03-20',
    actualEndDate: '2026-03-18',
    progressPercent: 100,
    status: 'completed',
    criticalPath: true
  },
  {
    id: 'gt-02',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Tooling & High-Speed Stencil Fabrication',
    phase: 'Tooling',
    owner: 'Carlos Mendez (Ops)',
    plannedStartDate: '2026-03-22',
    plannedEndDate: '2026-04-28',
    actualEndDate: '2026-04-25',
    progressPercent: 100,
    status: 'completed',
    dependsOn: ['gt-01'],
    criticalPath: true
  },
  {
    id: 'gt-03',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'DVT 500-Unit Reliability & Thermal Chamber Validation',
    phase: 'DVT',
    owner: 'Dr. Anita Joshi (QA)',
    plannedStartDate: '2026-05-02',
    plannedEndDate: '2026-06-30',
    actualEndDate: '2026-07-08',
    progressPercent: 100,
    status: 'completed',
    dependsOn: ['gt-02'],
    isDelayed: true,
    delayDays: 8,
    delayReason: 'Thermal cycling test chamber #4 compressor fault required 7-day calibration re-run for -40°C dwell.',
    mitigationPlan: 'Parallelized vibration profile across test bay 2 & 3 to compress remaining test matrix.',
    criticalPath: true
  },
  {
    id: 'gt-04',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Automated ICT Test Fixture (Agilent 3070) Programming',
    phase: 'DVT / Test',
    owner: 'Marcus Brody (Test Eng)',
    plannedStartDate: '2026-06-15',
    plannedEndDate: '2026-07-25',
    actualEndDate: '2026-07-25',
    progressPercent: 100,
    status: 'completed',
    dependsOn: ['gt-02'],
    criticalPath: false
  },
  {
    id: 'gt-05',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'PVT 10,000 Unit Production Run & Line Rate Takt Tuning',
    phase: 'PVT',
    owner: 'Kevin O\'Connor (Planning)',
    plannedStartDate: '2026-07-15',
    plannedEndDate: '2026-09-10',
    progressPercent: 88,
    status: 'in_progress',
    dependsOn: ['gt-03', 'gt-04'],
    criticalPath: true
  },
  {
    id: 'gt-06',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Automotive First Article Inspection (PPAP Level 3 Dossier)',
    phase: 'PPAP',
    owner: 'Sarah Lin (Customer PM)',
    plannedStartDate: '2026-08-20',
    plannedEndDate: '2026-09-25',
    progressPercent: 65,
    status: 'in_progress',
    dependsOn: ['gt-05'],
    criticalPath: true
  },
  {
    id: 'gt-07',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Mass Production Ramp (85,000 Units/Month)',
    phase: 'Ramp',
    owner: 'Carlos Mendez (Ops)',
    plannedStartDate: '2026-10-01',
    plannedEndDate: '2026-11-15',
    progressPercent: 10,
    status: 'pending',
    dependsOn: ['gt-06'],
    criticalPath: true
  },

  // Precision Infusion Smart Pump - NX-BIO-PUMP-PRO
  {
    id: 'gt-10',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'Schematic Freeze & DFM Cleanroom Clearance',
    phase: 'EVT',
    owner: 'Elena Rostova (Customer Sourcing)',
    plannedStartDate: '2026-02-01',
    plannedEndDate: '2026-04-15',
    actualEndDate: '2026-04-15',
    progressPercent: 100,
    status: 'completed',
    criticalPath: true
  },
  {
    id: 'gt-11',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'Cleanroom Prototype Build (1,000 Units)',
    phase: 'DVT',
    owner: 'Dr. Anita Joshi (QA)',
    plannedStartDate: '2026-04-20',
    plannedEndDate: '2026-07-20',
    actualEndDate: '2026-08-05',
    progressPercent: 100,
    status: 'completed',
    dependsOn: ['gt-10'],
    isDelayed: true,
    delayDays: 16,
    delayReason: 'Custom piezoelectric driver ASIC wafer yield shortage at foundry delayed raw PCB assembly.',
    mitigationPlan: 'Air-freighted secondary wafer lot and approved dual-source ceramic capacitor alternative.',
    criticalPath: true
  },
  {
    id: 'gt-12',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'FDA 510(k) Pre-Audit Dossier & Biocompatibility (ISO 10993)',
    phase: 'Regulatory',
    owner: 'Elena Rostova (Customer)',
    plannedStartDate: '2026-07-25',
    plannedEndDate: '2026-10-15',
    progressPercent: 55,
    status: 'delayed',
    dependsOn: ['gt-11'],
    isDelayed: true,
    delayDays: 14,
    delayReason: 'Pending extractables/leachables laboratory 3rd-party toxicology report from accredited lab in Frankfurt.',
    mitigationPlan: 'Expedited review fee authorized; bi-weekly audit synchronization with customer quality team.',
    criticalPath: true
  },
  {
    id: 'gt-13',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'PVT Medical Validation Run (5,000 Units)',
    phase: 'PVT',
    owner: 'Kevin O\'Connor (Planning)',
    plannedStartDate: '2026-10-20',
    plannedEndDate: '2026-12-10',
    progressPercent: 0,
    status: 'pending',
    dependsOn: ['gt-12'],
    criticalPath: true
  },

  // Heavy-Payload Autonomous Mobile Robot Inverter - NX-BOT-AMR-DRIVE
  {
    id: 'gt-20',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    title: 'EVT Alpha Board Spin 1 Assembly & Dyno Bench Setup',
    phase: 'EVT',
    owner: 'Liam Vance (Robotics Eng)',
    plannedStartDate: '2026-04-01',
    plannedEndDate: '2026-06-15',
    actualEndDate: '2026-06-15',
    progressPercent: 100,
    status: 'completed',
    criticalPath: true
  },
  {
    id: 'gt-21',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    title: 'EVT Spin 2 Board Re-spin & Vapor Chamber Heat Sink Redesign',
    phase: 'EVT',
    owner: 'David Chen / Liam Vance',
    plannedStartDate: '2026-06-20',
    plannedEndDate: '2026-08-15',
    progressPercent: 45,
    status: 'delayed',
    dependsOn: ['gt-20'],
    isDelayed: true,
    delayDays: 32,
    delayReason: 'MOSFET gate ringing overshoot (65V peak on 60V Vds) caused thermal destruction at 150A continuous stall. Full PCB layout snubber re-spin & heatsink tooling redesign needed.',
    mitigationPlan: 'Transitioned BOM to 80V GaN MOSFETs and commissioned rapid CNC copper cold plates for prototype spin 2.2 testing.',
    criticalPath: true
  },
  {
    id: 'gt-22',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    title: 'DVT Tooling Release & Environmental Vibration Test',
    phase: 'DVT',
    owner: 'Carlos Mendez (Ops)',
    plannedStartDate: '2026-09-01',
    plannedEndDate: '2026-12-15',
    progressPercent: 5,
    status: 'pending',
    dependsOn: ['gt-21'],
    criticalPath: true
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-001',
    workOrderNumber: 'WO-2026-0881',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    programName: 'NextGen EV Battery Management System (BMS Gen-3)',
    batchSize: 10000,
    completedUnits: 7850,
    scrappedUnits: 125,
    status: 'in_production',
    assignedFacility: 'Plant 1 (Austin High-Tech Campus)',
    assignedLine: 'SMT Line 02 & Cell B',
    currentShift: 'Shift 1 (Day) - 06:00 to 14:30',
    leadSupervisor: 'Carlos Mendez (Manufacturing Ops)',
    overallWipPercent: 78.5,
    startDate: '2026-08-10',
    estimatedCompletionDate: '2026-09-05',
    stations: [
      {
        id: 'st-01',
        name: 'High-Precision SMT Solder Paste & Component Placement',
        sequence: 1,
        stageCode: 'SMT-PICK-PLACE',
        assignedLine: 'SMT-02 Fuji NXT III',
        assignedShift: 'Shift 1',
        operatorCount: 2,
        wipUnits: 140,
        wipCapacity: 300,
        targetThroughputPerHour: 180,
        actualThroughputPerHour: 184,
        targetTaktSeconds: 20,
        actualCycleSeconds: 19.5,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0881'
      },
      {
        id: 'st-02',
        name: 'Nitrogen Reflow Oven & 3D Automated Optical Inspection (AOI)',
        sequence: 2,
        stageCode: 'REFLOW-AOI',
        assignedLine: 'SMT-02 Heller 1913 Mk5 + Koh Young AOI',
        assignedShift: 'Shift 1',
        operatorCount: 1,
        wipUnits: 180,
        wipCapacity: 350,
        targetThroughputPerHour: 180,
        actualThroughputPerHour: 178,
        targetTaktSeconds: 20,
        actualCycleSeconds: 20.2,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0881'
      },
      {
        id: 'st-03',
        name: 'Automated In-Circuit Test (ICT) & Boundary Scan',
        sequence: 3,
        stageCode: 'ICT-TEST',
        assignedLine: 'Test Station Agilent 3070 Fixture #3',
        assignedShift: 'Shift 1',
        operatorCount: 2,
        wipUnits: 340,
        wipCapacity: 350,
        targetThroughputPerHour: 180,
        actualThroughputPerHour: 142,
        targetTaktSeconds: 20,
        actualCycleSeconds: 25.4,
        status: 'bottleneck',
        bottleneckReason: 'High pin-count test vector dwell time is 25.4s vs 20.0s line takt. Queue build-up at 340 units (97% station buffer).',
        activeWorkOrderNumber: 'WO-2026-0881'
      },
      {
        id: 'st-04',
        name: 'Selective Conformal Coating & UV Curing',
        sequence: 4,
        stageCode: 'COATING-UV',
        assignedLine: 'Nordson Asymtek Robot Cell A',
        assignedShift: 'Shift 1',
        operatorCount: 1,
        wipUnits: 95,
        wipCapacity: 250,
        targetThroughputPerHour: 180,
        actualThroughputPerHour: 175,
        targetTaktSeconds: 20,
        actualCycleSeconds: 20.6,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0881'
      },
      {
        id: 'st-05',
        name: 'High-Voltage Hi-Pot (1500V Isolation) & End-of-Line Functional Test',
        sequence: 5,
        stageCode: 'EOL-HIPOT',
        assignedLine: 'Automated EOL Chamber Bay 1',
        assignedShift: 'Shift 1',
        operatorCount: 2,
        wipUnits: 110,
        wipCapacity: 200,
        targetThroughputPerHour: 180,
        actualThroughputPerHour: 172,
        targetTaktSeconds: 20,
        actualCycleSeconds: 20.9,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0881'
      },
      {
        id: 'st-06',
        name: 'Final Mechanical Box Build, Thermal Gel Dispense & Laser Marking',
        sequence: 6,
        stageCode: 'BOX-BUILD-PACK',
        assignedLine: 'Assembly Cell B4',
        assignedShift: 'Shift 1',
        operatorCount: 4,
        wipUnits: 75,
        wipCapacity: 300,
        targetThroughputPerHour: 180,
        actualThroughputPerHour: 180,
        targetTaktSeconds: 20,
        actualCycleSeconds: 19.8,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0881'
      }
    ]
  },
  {
    id: 'wo-002',
    workOrderNumber: 'WO-2026-0894',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    programName: 'Precision Infusion Smart Pump Controller Module',
    batchSize: 2000,
    completedUnits: 1080,
    scrappedUnits: 64,
    status: 'in_production',
    assignedFacility: 'Plant 3 (ISO 13485 Cleanroom Annex)',
    assignedLine: 'Cleanroom Micro-SMT Line 01',
    currentShift: 'Shift 2 (Afternoon) - 14:00 to 22:30',
    leadSupervisor: 'Dr. Anita Joshi (Quality / Medical)',
    overallWipPercent: 54.0,
    startDate: '2026-08-15',
    estimatedCompletionDate: '2026-09-12',
    stations: [
      {
        id: 'st-11',
        name: 'ISO Class 7 Micro-SMT Stencil & Fine-Pitch Placement',
        sequence: 1,
        stageCode: 'CR-SMT',
        assignedLine: 'Panasonic NPM-W2',
        assignedShift: 'Shift 2',
        operatorCount: 2,
        wipUnits: 60,
        wipCapacity: 150,
        targetThroughputPerHour: 60,
        actualThroughputPerHour: 58,
        targetTaktSeconds: 60,
        actualCycleSeconds: 62.0,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0894'
      },
      {
        id: 'st-12',
        name: '3D Micro-CT X-Ray Inspection for QFN Solder Voiding',
        sequence: 2,
        stageCode: '3D-XRAY',
        assignedLine: 'Nordson Dage Quadra 5 X-Ray',
        assignedShift: 'Shift 2',
        operatorCount: 1,
        wipUnits: 88,
        wipCapacity: 100,
        targetThroughputPerHour: 60,
        actualThroughputPerHour: 42,
        targetTaktSeconds: 60,
        actualCycleSeconds: 85.7,
        status: 'warning',
        bottleneckReason: '100% sample inspection active due to recent QFN voiding NCR. Slows throughput to 42 uph.',
        activeWorkOrderNumber: 'WO-2026-0894'
      },
      {
        id: 'st-13',
        name: 'Cleanroom Ultrasonic Wash & Particle Count Verification',
        sequence: 3,
        stageCode: 'CR-WASH',
        assignedLine: 'Crest Ultrasonic 4-Stage DI Wash',
        assignedShift: 'Shift 2',
        operatorCount: 1,
        wipUnits: 35,
        wipCapacity: 120,
        targetThroughputPerHour: 60,
        actualThroughputPerHour: 60,
        targetTaktSeconds: 60,
        actualCycleSeconds: 60.0,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0894'
      }
    ]
  },
  {
    id: 'wo-003',
    workOrderNumber: 'WO-2026-0740',
    programId: 'prog-003',
    programCode: 'NX-AERO-FCS-400',
    programName: 'Dual-Redundant Flight Control Gateway Computer',
    batchSize: 500,
    completedUnits: 460,
    scrappedUnits: 4,
    status: 'in_production',
    assignedFacility: 'Plant 1 (AS9100 Certified Avionics Bay)',
    assignedLine: 'Avionics Cell Alpha',
    currentShift: 'Shift 1 (Day)',
    leadSupervisor: 'Liam Vance (Avionics Ops)',
    overallWipPercent: 92.0,
    startDate: '2026-08-01',
    estimatedCompletionDate: '2026-08-30',
    stations: [
      {
        id: 'st-21',
        name: 'AS9100 IPC Class 3 Assembly & Automated Soldering',
        sequence: 1,
        stageCode: 'AV-SMT',
        assignedLine: 'Avionics SMT 01',
        assignedShift: 'Shift 1',
        operatorCount: 2,
        wipUnits: 12,
        wipCapacity: 50,
        targetThroughputPerHour: 20,
        actualThroughputPerHour: 21,
        targetTaktSeconds: 180,
        actualCycleSeconds: 171.4,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0740'
      },
      {
        id: 'st-22',
        name: 'Robotic Silicone Conformal Coating (55um Mil-Spec)',
        sequence: 2,
        stageCode: 'AV-COAT',
        assignedLine: 'Nordson Asymtek SelectCoat',
        assignedShift: 'Shift 1',
        operatorCount: 1,
        wipUnits: 15,
        wipCapacity: 40,
        targetThroughputPerHour: 20,
        actualThroughputPerHour: 20,
        targetTaktSeconds: 180,
        actualCycleSeconds: 180.0,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0740'
      },
      {
        id: 'st-23',
        name: 'ESS Thermal Shock & 3-Axis Random Vibration Sweep',
        sequence: 3,
        stageCode: 'ESS-VIBE',
        assignedLine: 'Unholtz-Dickie Shaker Bay 1',
        assignedShift: 'Shift 1',
        operatorCount: 2,
        wipUnits: 9,
        wipCapacity: 30,
        targetThroughputPerHour: 20,
        actualThroughputPerHour: 19.5,
        targetTaktSeconds: 180,
        actualCycleSeconds: 184.6,
        status: 'optimal',
        activeWorkOrderNumber: 'WO-2026-0740'
      }
    ]
  }
];

export const INITIAL_STAGE_GATES: StageGate[] = [
  {
    gateNumber: 0,
    gateCode: 'GATE-0',
    title: 'Concept & Feasibility Approval',
    description: 'Product concept definition, commercial architecture, initial BOM target cost, and high-level schedule baseline.',
    status: 'completed',
    plannedSignOff: '2025-11-30',
    actualSignOff: '2025-11-28',
    requirements: [
      {
        id: 'req-01',
        reqCode: 'PRD-REQ-001',
        category: 'Functional',
        description: 'System shall support 400V / 800V dual-bus battery architecture with isolated CAN-FD and Ethernet communication.',
        targetSpec: 'ISO 11898-1 CAN-FD 5Mbps',
        verificationMethod: 'Test',
        verificationStatus: 'verified',
        testCaseRef: 'TC-ARCH-001'
      },
      {
        id: 'req-02',
        reqCode: 'PRD-REQ-002',
        category: 'Environmental',
        description: 'Operating temperature range from -40°C to +105°C continuous ambient under full rated power.',
        targetSpec: '-40°C to +105°C (AEC-Q100 Grade 2)',
        verificationMethod: 'Test',
        verificationStatus: 'verified',
        testCaseRef: 'TC-ENV-002'
      }
    ],
    designReviews: [
      {
        id: 'dr-01',
        gatePhase: 'Gate 0',
        reviewTitle: 'Concept Architecture & System Specification Review',
        reviewDate: '2025-11-20',
        reviewerName: 'David Chen (Customer Lead Eng)',
        reviewerRole: 'Customer R&D',
        status: 'approved',
        comments: 'System architecture meets all VoltMobility powertrain requirements.',
        signatureTimestamp: '2025-11-28T16:00:00Z'
      }
    ],
    prototypeIterations: [
      {
        id: 'proto-00',
        spinCode: 'Concept Breadboard v0.1',
        buildDate: '2025-10-15',
        quantityBuilt: 10,
        yieldPercent: 100,
        keyIssuesFound: ['Microcontroller clock jitter on initial bench board.'],
        designChangesImplemented: ['Added 22pF load capacitors to main 40MHz crystal.'],
        leadEngineer: 'David Chen',
        status: 'superseded'
      }
    ],
    qualificationChecklist: [
      {
        id: 'qc-01',
        testName: 'Feasibility Bench Simulation',
        standardRef: 'Internal Spec VM-FEAS-01',
        sampleSize: 5,
        status: 'passed',
        passCriteria: 'MathCad / SPICE simulation convergence < 1%',
        measuredResult: '0.24% variance across worst-case tolerance stackup',
        testedBy: 'David Chen',
        dateTested: '2025-11-15'
      }
    ]
  },
  {
    gateNumber: 1,
    gateCode: 'GATE-1',
    title: 'EVT (Engineering Validation Test) Sign-Off',
    description: 'First functional PCB spin, DFM review, preliminary thermal and electrical verification under bench loads.',
    status: 'completed',
    plannedSignOff: '2026-03-25',
    actualSignOff: '2026-03-22',
    requirements: [
      {
        id: 'req-11',
        reqCode: 'PRD-REQ-003',
        category: 'Electrical',
        description: 'Current measurement accuracy < 0.5% full-scale across -40°C to +85°C with shunt sensor.',
        targetSpec: '±0.5% FS Error Limit',
        verificationMethod: 'Test',
        verificationStatus: 'verified',
        testCaseRef: 'TC-ELEC-014'
      },
      {
        id: 'req-12',
        reqCode: 'PRD-REQ-004',
        category: 'Regulatory',
        description: 'Galvanic high-voltage isolation between HV pack bus and LV 12V vehicle chassis ground > 3.0 kV RMS.',
        targetSpec: '> 3000 VAC for 60s (IEC 60664-1)',
        verificationMethod: 'Test',
        verificationStatus: 'verified',
        testCaseRef: 'TC-HV-009'
      }
    ],
    designReviews: [
      {
        id: 'dr-11',
        gatePhase: 'Gate 1',
        reviewTitle: 'EVT DFM / DFA & Schematic Freeze Review',
        reviewDate: '2026-03-15',
        reviewerName: 'Carlos Mendez (Ops Lead)',
        reviewerRole: 'Manufacturing Ops',
        status: 'approved',
        comments: 'DFM clearance verified. Test point spacing modified from 0.8mm to 1.0mm for Agilent 3070 fixture probe clearance.',
        signatureTimestamp: '2026-03-22T10:15:00Z'
      }
    ],
    prototypeIterations: [
      {
        id: 'proto-01',
        spinCode: 'EVT Alpha Board Spin 1.0',
        buildDate: '2026-02-10',
        quantityBuilt: 50,
        yieldPercent: 92.0,
        keyIssuesFound: ['HV gate driver snubber capacitor overheated during 200A peak current transient.'],
        designChangesImplemented: ['Replaced 0805 100nF with 1210 X7R 630V rated ceramic capacitor.'],
        leadEngineer: 'Marcus Brody',
        status: 'passed'
      }
    ],
    qualificationChecklist: [
      {
        id: 'qc-11',
        testName: 'Dielectric Withstand Hi-Pot Test',
        standardRef: 'IEC 60664-1 / UL 94V-0',
        sampleSize: 50,
        status: 'passed',
        passCriteria: 'Leakage current < 1.0 mA at 3000 VAC for 60s',
        measuredResult: 'Max leakage: 0.18 mA. Zero dielectric breakdowns.',
        testedBy: 'Dr. Anita Joshi',
        dateTested: '2026-03-12'
      },
      {
        id: 'qc-12',
        testName: 'CAN-FD Bus Signal Integrity & Eye Diagram',
        standardRef: 'ISO 11898-2',
        sampleSize: 20,
        status: 'passed',
        passCriteria: 'Eye opening > 85% mask at 5.0 Mbps',
        measuredResult: '93.4% eye opening with 2.8ns rise time',
        testedBy: 'David Chen',
        dateTested: '2026-03-18'
      }
    ]
  },
  {
    gateNumber: 2,
    gateCode: 'GATE-2',
    title: 'DVT (Design Validation Test) Sign-Off',
    description: 'Tool-made parts, reliability environmental testing (vibration, thermal shock, salt fog), and full automated test fixture validation.',
    status: 'completed',
    plannedSignOff: '2026-07-05',
    actualSignOff: '2026-07-08',
    requirements: [
      {
        id: 'req-21',
        reqCode: 'PRD-REQ-005',
        category: 'Environmental',
        description: 'Vibration profile: 3-axis random vibration 10-2000Hz at 7.7 gRMS for 32 hours per axis.',
        targetSpec: 'ISO 16750-3 Profile 4.1',
        verificationMethod: 'Test',
        verificationStatus: 'verified',
        testCaseRef: 'TC-REL-031'
      },
      {
        id: 'req-22',
        reqCode: 'PRD-REQ-006',
        category: 'Mechanical',
        description: 'Enclosure ingress protection against pressurized water spray and fine dust.',
        targetSpec: 'IP6K9K (DIN 40050-9)',
        verificationMethod: 'Test',
        verificationStatus: 'verified',
        testCaseRef: 'TC-ING-008'
      }
    ],
    designReviews: [
      {
        id: 'dr-21',
        gatePhase: 'Gate 2',
        reviewTitle: 'DVT Environmental & Tooling Qualification Review',
        reviewDate: '2026-07-02',
        reviewerName: 'Sarah Lin (Customer PM)',
        reviewerRole: 'Customer PM Lead',
        status: 'approved_with_conditions',
        comments: 'Conditional sign-off approved pending 10k PVT confirmation of ultrasonic wash dwell time.',
        conditions: ['Maintain 100% AOI on QFN-32 pins during PVT run', 'Verify thermal paste dispense Cpk > 1.67'],
        signatureTimestamp: '2026-07-08T18:45:00Z'
      }
    ],
    prototypeIterations: [
      {
        id: 'proto-02',
        spinCode: 'DVT Beta Board Spin 2.0',
        buildDate: '2026-05-18',
        quantityBuilt: 500,
        yieldPercent: 97.4,
        keyIssuesFound: ['Minor flux residue on pin 14 of micro-controller in wash tank 2.'],
        designChangesImplemented: ['Increased ultrasonic wash cycle dwell time by 8s and switched DI rinse nozzle angle.'],
        leadEngineer: 'Carlos Mendez',
        status: 'passed'
      }
    ],
    qualificationChecklist: [
      {
        id: 'qc-21',
        testName: 'Thermal Shock Cycling (-40°C to +125°C)',
        standardRef: 'EIAJ ED-4701/100 (500 cycles)',
        sampleSize: 60,
        status: 'passed',
        passCriteria: 'Zero solder joint micro-cracking, zero functional faults',
        measuredResult: '0/60 failures. Micro-sectioning verified 100% intermetallic bond.',
        testedBy: 'Dr. Anita Joshi',
        dateTested: '2026-06-28'
      },
      {
        id: 'qc-22',
        testName: 'Salt Fog Corrosion Resistance',
        standardRef: 'ASTM B117 (96 Hours 5% NaCl)',
        sampleSize: 15,
        status: 'passed',
        passCriteria: 'Zero corrosion ingress on sealed connector pins',
        measuredResult: 'Conformal coating and EPDM gasket showed zero salt ingress.',
        testedBy: 'Dr. Anita Joshi',
        dateTested: '2026-07-01'
      }
    ]
  },
  {
    gateNumber: 3,
    gateCode: 'GATE-3',
    title: 'PVT (Production Validation Test) Gate',
    description: 'Pilot production run on production line at target line speed. First Article Inspection (FAI), Gage R&R, Cpk > 1.67 verification.',
    status: 'active',
    plannedSignOff: '2026-09-25',
    requirements: [
      {
        id: 'req-31',
        reqCode: 'PRD-REQ-007',
        category: 'Functional',
        description: 'First Pass Yield (FPY) across full automated line must exceed 98.0% across 10,000 unit continuous pilot run.',
        targetSpec: 'FPY ≥ 98.0%, Scrap ≤ 2.0%',
        verificationMethod: 'Test',
        verificationStatus: 'in_progress',
        testCaseRef: 'TC-PROD-FPY'
      },
      {
        id: 'req-32',
        reqCode: 'PRD-REQ-008',
        category: 'Quality',
        description: 'Process capability index (Cpk) on all critical-to-quality (CTQ) dimensions and solder paste height > 1.67.',
        targetSpec: 'Cpk ≥ 1.67 on CTQ parameters',
        verificationMethod: 'Analysis',
        verificationStatus: 'in_progress',
        testCaseRef: 'TC-SPC-CPK'
      }
    ],
    designReviews: [
      {
        id: 'dr-31',
        gatePhase: 'Gate 3',
        reviewTitle: 'PVT Mid-Run Readiness & PPAP Level 3 Preliminary Review',
        reviewDate: '2026-08-20',
        reviewerName: 'Dr. Anita Joshi / Sarah Lin',
        reviewerRole: 'Joint Quality Board',
        status: 'pending',
        comments: 'PVT running at 98.4% yield (7,850 of 10,000 units completed). Final gate review scheduled for Sept 20th upon 10k batch completion.'
      }
    ],
    prototypeIterations: [
      {
        id: 'proto-03',
        spinCode: 'PVT Pilot Production Batch 1',
        buildDate: '2026-08-10',
        quantityBuilt: 10000,
        yieldPercent: 98.4,
        keyIssuesFound: ['ICT test fixture #3 contact pin wear causing false open on test pad TP42 after 6,000 cycles.'],
        designChangesImplemented: ['Replaced pogo pins with diamond-serrated hardened beryllium copper probes.'],
        leadEngineer: 'Carlos Mendez',
        status: 'passed'
      }
    ],
    qualificationChecklist: [
      {
        id: 'qc-31',
        testName: 'Automotive PPAP Level 3 Dimensional FAI',
        standardRef: 'AIAG PPAP 4th Edition',
        sampleSize: 300,
        status: 'in_progress',
        passCriteria: '100% drawing dimensions within tolerance (Cpk > 1.67)',
        measuredResult: '285 of 300 samples measured; current Cpk = 1.82',
        testedBy: 'Dr. Anita Joshi',
        dateTested: '2026-08-25'
      },
      {
        id: 'qc-32',
        testName: 'Gage R&R on Solder Paste Inspection (SPI)',
        standardRef: 'AIAG MSA Manual',
        sampleSize: 100,
        status: 'passed',
        passCriteria: 'Gage R&R (%GRR) < 10.0%',
        measuredResult: 'Measured %GRR = 6.42% (Excellent capability)',
        testedBy: 'Marcus Brody',
        dateTested: '2026-08-14'
      },
      {
        id: 'qc-33',
        testName: 'Drop Impact Resistance Test (1.5m)',
        standardRef: 'MIL-STD-810H Method 516.8',
        sampleSize: 20,
        status: 'passed',
        passCriteria: 'No enclosure cracking, functional post-drop test pass',
        measuredResult: '20/20 passed with zero cosmetic or functional defects',
        testedBy: 'Dr. Anita Joshi',
        dateTested: '2026-08-18'
      },
      {
        id: 'qc-34',
        testName: 'High-Temperature Operating Life (HTOL 1000h @ 105°C)',
        standardRef: 'JESD22-A108',
        sampleSize: 77,
        status: 'in_progress',
        passCriteria: '0 failures after 1000 hours continuous dwell',
        measuredResult: 'Currently at 640 hours: 0 failures logged',
        testedBy: 'Dr. Anita Joshi',
        dateTested: '2026-08-27'
      }
    ]
  },
  {
    gateNumber: 4,
    gateCode: 'GATE-4',
    title: 'Mass Production Ramp (85k Units/mo) Gate',
    description: 'Unconditional release for mass scale high-speed manufacturing, supplier buffer stocking, and multi-shift operations.',
    status: 'upcoming',
    plannedSignOff: '2026-10-15',
    requirements: [
      {
        id: 'req-41',
        reqCode: 'PRD-REQ-009',
        category: 'Functional',
        description: 'Supply chain buffer: 6 weeks raw material buffer stock secured across all A-class active semiconductor ICs.',
        targetSpec: '6.0 Weeks Verified Safety Buffer',
        verificationMethod: 'Inspection',
        verificationStatus: 'untested',
        testCaseRef: 'TC-SC-BUF'
      }
    ],
    designReviews: [],
    prototypeIterations: [],
    qualificationChecklist: [
      {
        id: 'qc-41',
        testName: 'Final Customer Sign-Off & Commercial Authorization',
        standardRef: 'Customer Commercial Agreement',
        sampleSize: 1,
        status: 'not_started',
        passCriteria: 'Signatures from Customer Lead PM & Quality Director',
        testedBy: 'Sarah Lin & Elena Rostova'
      }
    ]
  }
];

export const INITIAL_BOM_ITEMS: BOMItem[] = [
  {
    id: 'bom-01',
    partNumber: 'NX-IC-MCU-ARM4',
    description: '32-bit Dual-Core ARM Cortex-M7 Automotive Microcontroller (AEC-Q100, 2MB Flash, 1MB RAM)',
    category: 'Active IC',
    quantityPerUnit: 1,
    manufacturer: 'STMicroelectronics',
    mpn: 'STM32H743ZIT6',
    lifecycleStatus: 'Active',
    leadTimeWeeks: 12,
    unitCostUSD: 14.85,
    supplierRisk: 'low',
    currentStock: 48500
  },
  {
    id: 'bom-02',
    partNumber: 'NX-IC-AFE-CELL16',
    description: '16-Channel High-Precision Battery Cell Monitor & Balancer IC with Daisy Chain SPI',
    category: 'Active IC',
    quantityPerUnit: 4,
    manufacturer: 'Analog Devices',
    mpn: 'ADBMS6815WFS',
    lifecycleStatus: 'Active',
    leadTimeWeeks: 16,
    unitCostUSD: 9.40,
    supplierRisk: 'medium',
    currentStock: 192000
  },
  {
    id: 'bom-03',
    partNumber: 'NX-ISO-CANFD-5KV',
    description: 'Galvanically Isolated CAN-FD Transceiver with 5000Vrms Reinforced Isolation',
    category: 'Active IC',
    quantityPerUnit: 2,
    manufacturer: 'Texas Instruments',
    mpn: 'ISO1042BDWVR',
    lifecycleStatus: 'Active',
    leadTimeWeeks: 8,
    unitCostUSD: 2.15,
    supplierRisk: 'low',
    currentStock: 95000
  },
  {
    id: 'bom-04',
    partNumber: 'NX-RES-SHUNT-001',
    description: '0.1 mOhm Precision Current Shunt Resistor 50W (0.1% Tol, 15 ppm/°C)',
    category: 'Passive',
    quantityPerUnit: 1,
    manufacturer: 'Isabellenhütte',
    mpn: 'BVT-Z-R0001-0.1',
    lifecycleStatus: 'Active',
    leadTimeWeeks: 10,
    unitCostUSD: 6.20,
    supplierRisk: 'low',
    currentStock: 52000
  },
  {
    id: 'bom-05',
    partNumber: 'NX-PCB-8L-TG180',
    description: '8-Layer FR4 High-Tg (180°C) PCB with 2oz Inner/Outer Copper & ENIG Gold Finish',
    category: 'PCB',
    quantityPerUnit: 1,
    manufacturer: 'TTM Technologies',
    mpn: 'NX-PCB-BMS-REV-C',
    lifecycleStatus: 'Active',
    leadTimeWeeks: 4,
    unitCostUSD: 11.50,
    supplierRisk: 'low',
    currentStock: 60000
  },
  {
    id: 'bom-06',
    partNumber: 'NX-ENC-ALU-IP67',
    description: 'Die-Cast ADC12 Aluminum Enclosure with Integrated Cooling Fins & EPDM Gasket',
    category: 'Enclosure',
    quantityPerUnit: 1,
    manufacturer: 'Dynacast International',
    mpn: 'ENC-BMS-G3-ALU',
    lifecycleStatus: 'Active',
    leadTimeWeeks: 6,
    unitCostUSD: 18.75,
    supplierRisk: 'low',
    currentStock: 42000
  },
  {
    id: 'bom-07',
    partNumber: 'NX-LDO-5V-500MA',
    description: 'High-Voltage 45V Input Low-Dropout Linear Voltage Regulator 5.0V 500mA',
    category: 'Active IC',
    quantityPerUnit: 2,
    manufacturer: 'Texas Instruments',
    mpn: 'TPS7A1601QDGNRQ1',
    lifecycleStatus: 'Alternative Qualified',
    leadTimeWeeks: 14,
    unitCostUSD: 1.45,
    supplierRisk: 'low',
    currentStock: 88000
  }
];

export const INITIAL_ENGINEERING_DRAWINGS: EngineeringDrawing[] = [
  {
    id: 'dwg-01',
    docNumber: 'DWG-BMS-001-CAD',
    title: '3D Master Assembly STEP Model with Thermal Cold Plate',
    docType: '3D STEP Model',
    revision: 'Rev C.4',
    fileSize: '48.2 MB',
    lastUpdated: '2026-08-15',
    author: 'David Chen (Customer Lead Eng)',
    status: 'Approved / Released',
    downloadUrl: '#'
  },
  {
    id: 'dwg-02',
    docNumber: 'DWG-BMS-002-SCH',
    title: 'Complete 8-Sheet Electrical Schematic (HV Isolation, MCU, AFE)',
    docType: 'Schematic PDF',
    revision: 'Rev C.3',
    fileSize: '12.6 MB',
    lastUpdated: '2026-08-12',
    author: 'David Chen',
    status: 'Approved / Released',
    downloadUrl: '#'
  },
  {
    id: 'dwg-03',
    docNumber: 'DWG-BMS-003-GERBER',
    title: 'Production PCB Gerber / ODB++ Manufacturing Package (8-Layer)',
    docType: 'PCB Gerber / ODB++',
    revision: 'Rev C.2',
    fileSize: '24.1 MB',
    lastUpdated: '2026-08-01',
    author: 'Carlos Mendez (DFM Team)',
    status: 'Approved / Released',
    downloadUrl: '#'
  },
  {
    id: 'dwg-04',
    docNumber: 'DWG-BMS-004-MECH',
    title: 'Die-Cast Enclosure 2D Tolerancing & Critical-to-Quality (CTQ) Drawing',
    docType: '2D Mechanical Schematic',
    revision: 'Rev B.8',
    fileSize: '8.4 MB',
    lastUpdated: '2026-07-20',
    author: 'Marcus Brody',
    status: 'Approved / Released',
    downloadUrl: '#'
  },
  {
    id: 'dwg-05',
    docNumber: 'DWG-BMS-005-WIRE',
    title: 'High-Voltage Harness & Automotive Automotive Connector Pinout Drawing',
    docType: 'Wire Harness Spec',
    revision: 'Rev C.1',
    fileSize: '6.1 MB',
    lastUpdated: '2026-07-15',
    author: 'Liam Vance',
    status: 'Approved / Released',
    downloadUrl: '#'
  }
];

export const INITIAL_ENGINEERING_SPECS: EngineeringSpec[] = [
  {
    id: 'spec-01',
    specCode: 'PRD-BMS-GEN3-V4',
    title: 'Product Requirements Document: EV Battery Management System Gen-3',
    version: 'v4.2',
    docCategory: 'PRD',
    author: 'Sarah Lin (Customer PM)',
    effectiveDate: '2026-06-01',
    status: 'Active',
    summary: 'Comprehensive performance, thermal, mechanical, CAN-FD protocol, and functional safety (ISO 26262 ASIL-C) requirements.'
  },
  {
    id: 'spec-02',
    specCode: 'DFM-NEX-BMS-08',
    title: 'Design for Manufacturing & SMT Assembly Process Guidelines',
    version: 'v2.1',
    docCategory: 'DFM Guidelines',
    author: 'Carlos Mendez (Ops Lead)',
    effectiveDate: '2026-05-15',
    status: 'Active',
    summary: 'Stencil apertures, lead-free SAC305 profile parameters, AOI optical keep-out zones, and ultrasonic wash cleanliness metrics.'
  },
  {
    id: 'spec-03',
    specCode: 'TEST-BMS-EOL-REV2',
    title: 'End-of-Line Automated Test & High-Voltage Calibration Specification',
    version: 'v3.0',
    docCategory: 'Test & Calibration Spec',
    author: 'Dr. Anita Joshi (QA)',
    effectiveDate: '2026-07-10',
    status: 'Active',
    summary: 'Detailed test steps, voltage injection limits, current calibration limits (±0.2% FS), and Hi-Pot isolation criteria.'
  },
  {
    id: 'spec-04',
    specCode: 'PKG-BMS-AUTO-03',
    title: 'Automotive ESD Tray Packaging, Barcode Labeling & Palletization Spec',
    version: 'v1.4',
    docCategory: 'Packaging & Labeling',
    author: 'Priya Patel (Logistics)',
    effectiveDate: '2026-06-25',
    status: 'Active',
    summary: 'EIA-541 compliant dissipative trays, 2D DataMatrix serial formatting, desiccant pouch quantity, and container stacking limits.'
  }
];

export const INITIAL_ECO_LOG: ECO[] = [
  {
    id: 'eco-001',
    ecoNumber: 'ECO-2026-094',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'High-Voltage Gate Driver Snubber Capacitor Value Optimization',
    dateCreated: '2026-08-18',
    effectiveDate: '2026-08-22',
    priority: 'Immediate / Stop Ship',
    status: 'Approved & Released',
    author: 'David Chen (Customer Lead Eng)',
    reasonForChange: 'Observed intermittent 4.2V ringing overshoot on high-side switching FET during fast 250A fault trip. Replacing 100nF ceramic cap with 220nF 630V X7R suppresses overshoot below 1.2V margin.',
    whatChangedBefore: 'C42 & C45: 100nF 500V 0805 Ceramic Capacitor (Kemet C0805C104K5RACTU)',
    whatChangedAfter: 'C42 & C45: 220nF 630V 1210 High-Voltage Automotive Ceramic Capacitor (TDK CGA6P3X7T2J224K250AE)',
    affectedPartNumbers: ['NX-RES-SHUNT-001', 'NX-PCB-8L-TG180'],
    approvals: [
      { roleName: 'Customer R&D Lead', approverName: 'David Chen', approved: true, timestamp: '2026-08-19T09:30:00Z' },
      { roleName: 'Customer PM Lead', approverName: 'Sarah Lin', approved: true, timestamp: '2026-08-19T11:45:00Z' },
      { roleName: 'Internal Quality Director', approverName: 'Dr. Anita Joshi', approved: true, timestamp: '2026-08-20T14:10:00Z' },
      { roleName: 'Manufacturing Ops Lead', approverName: 'Carlos Mendez', approved: true, timestamp: '2026-08-21T08:00:00Z' }
    ],
    notificationSent: true,
    notificationRecipients: ['sarah.lin@voltmobility.com', 'david.chen@voltmobility.com', 'a.joshi@nexgile.com', 'c.mendez@nexgile.com', 'k.oconnor@nexgile.com']
  },
  {
    id: 'eco-002',
    ecoNumber: 'ECO-2026-088',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Alternative Second-Source Qualification for 5V LDO Regulator',
    dateCreated: '2026-08-05',
    effectiveDate: '2026-08-10',
    priority: 'Routine / Next Batch',
    status: 'Approved & Released',
    author: 'Elena Rostova (Customer Sourcing)',
    reasonForChange: 'Primary TI LDO supplier allocated lead-time pushed to 28 weeks. Qualified pin-compatible ON Semiconductor AEC-Q100 part with identical thermal resistance.',
    whatChangedBefore: 'U12: Single source TI TPS7A1601QDGNRQ1',
    whatChangedAfter: 'U12: Dual source approved (TI TPS7A1601 & ON Semi NCV4274CDT50RKG)',
    affectedPartNumbers: ['NX-LDO-5V-500MA'],
    approvals: [
      { roleName: 'Customer R&D Lead', approverName: 'David Chen', approved: true, timestamp: '2026-08-06T10:00:00Z' },
      { roleName: 'Internal Quality Director', approverName: 'Dr. Anita Joshi', approved: true, timestamp: '2026-08-07T16:30:00Z' }
    ],
    notificationSent: true,
    notificationRecipients: ['e.rostova@apexbiomed.com', 'sarah.lin@voltmobility.com', 'p.patel@nexgile.com']
  },
  {
    id: 'eco-003',
    ecoNumber: 'ECO-2026-102',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'Stencil Aperture Reduction for QFN-32 Pitch to Eliminate Solder Bridging',
    dateCreated: '2026-08-24',
    effectiveDate: '2026-08-28',
    priority: 'Immediate / Stop Ship',
    status: 'Pending Customer Approval',
    author: 'Carlos Mendez (Ops)',
    reasonForChange: 'Internal 8D quality investigation revealed 4.2% short-circuit defect on QFN-32 fine pitch under 120um electroformed stencil. Reducing stencil thickness to 100um with 1:1 rounded rectangular aperture reduces solder paste volume by 18% and achieves zero bridging.',
    whatChangedBefore: 'SMT Stencil: 120um Electroformed Nickel Foil, 100% aperture ratio',
    whatChangedAfter: 'SMT Stencil: 100um Laser-Cut Nano-Coated Stainless Steel Foil, 82% aperture ratio',
    affectedPartNumbers: ['NX-PCB-8L-TG180'],
    approvals: [
      { roleName: 'Internal Quality Lead', approverName: 'Dr. Anita Joshi', approved: true, timestamp: '2026-08-25T11:00:00Z' },
      { roleName: 'Customer Quality Lead', approverName: 'Elena Rostova', approved: false }
    ],
    notificationSent: true,
    notificationRecipients: ['e.rostova@apexbiomed.com', 'a.joshi@nexgile.com', 'c.mendez@nexgile.com']
  }
];

export const INITIAL_EVIDENCE_FILES: EvidenceFile[] = [
  // Test Plans
  {
    id: 'ev-01',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'PVT Master Test Plan & Reliability Protocol (ISO 16750 / AEC-Q100)',
    category: 'test_plans',
    fileType: 'pdf',
    fileName: 'PVT_Master_Test_Protocol_BMS_G3_Rev2.pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-08-08',
    uploadedBy: 'Dr. Anita Joshi',
    uploadedByRole: 'Internal Quality Engineering',
    signOffStatus: 'approved',
    signedBy: 'Sarah Lin (Customer PM)',
    signOffDate: '2026-08-10',
    description: 'Comprehensive test matrix covering environmental thermal shock (-40C to +105C), 3-axis vibration, ESD, high-potential isolation, and software fault injection.',
    tags: ['Test Plan', 'ISO 16750', 'PVT', 'Reliability']
  },
  {
    id: 'ev-02',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Automated End-of-Line Test Fixture Calibration & Safety Protocol',
    category: 'test_plans',
    fileType: 'pdf',
    fileName: 'EOL_Agilent3070_Calibration_Protocol_v3.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-08-12',
    uploadedBy: 'Marcus Brody',
    uploadedByRole: 'Manufacturing Test Engineer',
    signOffStatus: 'approved',
    signedBy: 'David Chen (Customer Lead Eng)',
    signOffDate: '2026-08-14',
    description: 'Test sequence timing, probe resistance threshold verification, and 1500V high-pot interlock safety check.',
    tags: ['ICT', 'Fixture', 'Safety', 'Calibration']
  },

  // Test Results
  {
    id: 'ev-03',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: '10,000 Unit PVT Thermal Cycling & Current Accuracy Telemetry Data',
    category: 'test_results',
    fileType: 'csv',
    fileName: 'PVT_Batch1_Telemetry_10000_Units.csv',
    fileSize: '18.4 MB',
    uploadDate: '2026-08-25',
    uploadedBy: 'Carlos Mendez',
    uploadedByRole: 'Manufacturing Ops',
    signOffStatus: 'approved',
    signedBy: 'David Chen (Customer Eng)',
    signOffDate: '2026-08-26',
    description: 'Full station-by-station telemetry log recording 7,850 completed units. Average current shunt accuracy is 0.18% FS error with zero thermal trip events.',
    tags: ['Telemetry', 'PVT Data', 'Current Shunt', 'Pass Log']
  },
  {
    id: 'ev-04',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'Dielectric Hi-Pot 3000V Isolation Automated Test Log',
    category: 'test_results',
    fileType: 'xlsx',
    fileName: 'HiPot_Dielectric_Isolation_Summary_Lot881.xlsx',
    fileSize: '5.6 MB',
    uploadDate: '2026-08-24',
    uploadedBy: 'Dr. Anita Joshi',
    uploadedByRole: 'Internal Quality Engineering',
    signOffStatus: 'approved',
    signedBy: 'Sarah Lin (Customer PM)',
    signOffDate: '2026-08-25',
    description: '100% of units passed 3000VAC 60-second isolation dwell. Max measured leakage current is 0.21 mA against 1.00 mA limit.',
    tags: ['Hi-Pot', 'Safety Test', 'Pass Data']
  },

  // FAI / PPAP
  {
    id: 'ev-05',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'AIAG PPAP Level 3 Complete Submission Dossier (PSW, Control Plan, PFMEA)',
    category: 'fai_ppap',
    fileType: 'pdf',
    fileName: 'PPAP_Level3_Dossier_NX_VM_BMS_G3_Complete.pdf',
    fileSize: '32.8 MB',
    uploadDate: '2026-08-22',
    uploadedBy: 'Dr. Anita Joshi',
    uploadedByRole: 'Quality Engineering Lead',
    signOffStatus: 'under_review',
    description: 'Part Submission Warrant (PSW), Process Flow Diagram, PFMEA (Risk Priority Number max 48), Control Plan, Gage R&R, and Cpk statistical analysis.',
    tags: ['PPAP', 'PSW', 'PFMEA', 'Level 3', 'AIAG']
  },
  {
    id: 'ev-06',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'First Article Inspection Report (AS9102 / IPC-A-610 Class 3 CTQ)',
    category: 'fai_ppap',
    fileType: 'pdf',
    fileName: 'FAIR_CTQ_Inspection_Report_RevC.pdf',
    fileSize: '8.9 MB',
    uploadDate: '2026-08-19',
    uploadedBy: 'Dr. Anita Joshi',
    uploadedByRole: 'Quality Engineering Lead',
    signOffStatus: 'approved',
    signedBy: 'Sarah Lin (Customer PM)',
    signOffDate: '2026-08-20',
    description: '100% dimensional verification of 300 sample units on Zeiss CMM. All enclosure mounting holes and connector interfaces within ±0.05mm tolerance.',
    tags: ['FAIR', 'CMM Data', 'IPC-A-610', 'Inspection']
  },

  // Photos & Videos
  {
    id: 'ev-07',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: '3D X-Ray Micro-CT Scan of BGA / QFN Solder Joint Voiding',
    category: 'photos_videos',
    fileType: 'png',
    fileName: 'BGA_XRay_MicroCT_Voiding_Analysis.png',
    fileSize: '3.4 MB',
    uploadDate: '2026-08-16',
    uploadedBy: 'Dr. Anita Joshi',
    uploadedByRole: 'Quality Engineering',
    signOffStatus: 'approved',
    previewUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    description: '3D X-ray inspection showing 4.8% average solder voiding across 256-ball BGA microcontroller, well below the IPC Class 3 maximum limit of 15.0%.',
    tags: ['X-Ray', 'Micro-CT', 'BGA', 'IPC Class 3']
  },
  {
    id: 'ev-08',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'FLIR Thermal Camera Imaging Under 250A Continuous Full-Load Dwell',
    category: 'photos_videos',
    fileType: 'jpg',
    fileName: 'FLIR_Thermal_Camera_250A_FullLoad.jpg',
    fileSize: '4.2 MB',
    uploadDate: '2026-08-18',
    uploadedBy: 'David Chen',
    uploadedByRole: 'Customer R&D Lead',
    signOffStatus: 'approved',
    previewUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
    description: 'FLIR thermal imaging confirms maximum hotspot temperature is 68.4°C on main power MOSFET bank, providing 36.6°C safety margin below rated 105°C ceiling.',
    tags: ['FLIR', 'Thermal', 'MOSFET', 'Stress Test']
  },
  {
    id: 'ev-09',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'High-Speed 1000 FPS Video of 1.5-Meter Drop Shock Impact Test',
    category: 'photos_videos',
    fileType: 'mp4',
    fileName: 'Drop_Test_1500mm_Concrete_1000fps.mp4',
    fileSize: '45.0 MB',
    uploadDate: '2026-08-20',
    uploadedBy: 'Dr. Anita Joshi',
    uploadedByRole: 'Quality Engineering',
    signOffStatus: 'approved',
    previewUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&auto=format&fit=crop&q=80',
    description: 'High-speed camera recording showing impact damping on aluminum chassis and internal isolation standoff integrity with zero micro-fractures.',
    tags: ['High-Speed Video', 'Drop Test', 'Shock', 'MIL-STD-810H']
  }
];
