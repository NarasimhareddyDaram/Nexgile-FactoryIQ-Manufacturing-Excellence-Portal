import {
  Role,
  User,
  Program,
  StatusHistoryRecord,
  Issue,
  Approval,
  Activity,
  NavSectionConfig
} from '../types';

export const INITIAL_ROLES: Role[] = [
  // 5 Customer-side roles
  {
    id: 'customer_engineering',
    name: 'Engineering',
    category: 'customer',
    description: 'Customer R&D & Product Design team. Access to technical specs, test summaries, ECOs, and DFM recommendations.',
    badgeColor: 'blue',
    focusArea: 'Design validation, ECOs, DFM, test telemetry & yield summary',
    detailLevel: 'summary',
    permissions: ['view_specs', 'approve_eco', 'view_test_summary', 'raise_technical_issue']
  },
  {
    id: 'customer_supply_chain',
    name: 'Supply Chain / Procurement',
    category: 'customer',
    description: 'Customer procurement & materials. Visibility into PO burn-down, shipment schedules, lead times & buffer stock.',
    badgeColor: 'emerald',
    focusArea: 'Purchase Orders, shipment tracking, material buffer & critical shortages',
    detailLevel: 'summary',
    permissions: ['view_po_status', 'view_shipments', 'view_material_availability']
  },
  {
    id: 'customer_quality',
    name: 'Quality / Compliance',
    category: 'customer',
    description: 'Customer QA & regulatory compliance. Reviews FAI reports, compliance certificates (ISO, RoHS, FDA), and CAPAs.',
    badgeColor: 'teal',
    focusArea: 'FAI approvals, audit packs, released yield metrics & customer CAPA reports',
    detailLevel: 'summary',
    permissions: ['view_quality_reports', 'approve_fai', 'view_compliance_certs', 'view_capa_summary']
  },
  {
    id: 'customer_pm',
    name: 'Program / Project Management',
    category: 'customer',
    description: 'Customer Lead Program Director. Comprehensive project milestone tracking, health KPIs & stage-gate sign-offs.',
    badgeColor: 'indigo',
    focusArea: 'Program milestone health, stage gates, schedule variance & executive summaries',
    detailLevel: 'summary',
    permissions: ['view_all_customer_data', 'approve_stage_gates', 'export_reports', 'manage_stakeholders']
  },
  {
    id: 'customer_after_sales',
    name: 'After-Sales / Service',
    category: 'customer',
    description: 'Customer Warranty & field service management. RMA return tracking, turnaround time (TAT), and spares ordering.',
    badgeColor: 'cyan',
    focusArea: 'RMA tracking, warranty metrics, field failure trends & spare part inventory',
    detailLevel: 'summary',
    permissions: ['create_rma', 'view_rma_status', 'request_spares', 'view_warranty_stats']
  },

  // 6 Internal (company) roles
  {
    id: 'internal_account',
    name: 'Customer Success / Account Team',
    category: 'internal',
    description: 'Account leadership and customer relationship management. Commercial alignment, customer health escalation, and SLA tracking.',
    badgeColor: 'purple',
    focusArea: 'Customer relationship, executive summaries, escalation management & SLA status',
    detailLevel: 'full',
    permissions: ['manage_customer_accounts', 'view_full_history', 'create_executive_summary', 'manage_alerts']
  },
  {
    id: 'internal_planning',
    name: 'Production Planning',
    category: 'internal',
    description: 'Master Production Schedule (MPS), capacity allocation, line sequencing, and bottleneck forecasting across plants.',
    badgeColor: 'violet',
    focusArea: 'Capacity planning, line scheduling, WIP forecasting & plant shift allocations',
    detailLevel: 'full',
    permissions: ['edit_schedule', 'allocate_capacity', 'manage_wip', 'set_line_targets']
  },
  {
    id: 'internal_ops',
    name: 'Manufacturing Ops',
    category: 'internal',
    description: 'Line supervisors & shopfloor operations. Station-by-station throughput, OEE, downtime tracking & operator shift logs.',
    badgeColor: 'sky',
    focusArea: 'Live line station telemetry, OEE, machine downtime, cycle times & shift throughput',
    detailLevel: 'full',
    permissions: ['log_station_data', 'update_line_status', 'manage_downtime', 'view_live_telemetry']
  },
  {
    id: 'internal_quality',
    name: 'Quality Engineering',
    category: 'internal',
    description: 'Internal QA/QC engineers. In-depth 8D root-cause investigations, line scrap analysis, SPC control charts & internal NCRs.',
    badgeColor: 'rose',
    focusArea: '8D root cause, scrap breakdown, SPC charts, supplier non-conformance & ship holds',
    detailLevel: 'full',
    permissions: ['manage_ncrs', 'run_8d_analysis', 'manage_spc', 'issue_ship_holds', 'log_scrap_metrics']
  },
  {
    id: 'internal_logistics',
    name: 'Logistics / Supply Chain',
    category: 'internal',
    description: 'Warehouse, inbound component tracking, BOM shortages, supplier risk matrices & customs clearance.',
    badgeColor: 'amber',
    focusArea: 'BOM shortage deep dive, warehouse dock-to-stock, supplier risk & freight tracking',
    detailLevel: 'full',
    permissions: ['manage_bom_allocations', 'track_customs', 'manage_warehouse_stock', 'update_carrier_status']
  },
  {
    id: 'internal_service',
    name: 'Service / Repair',
    category: 'internal',
    description: 'Depot repair technicians and warranty triage. Component-level repair teardowns, turnaround times (TAT) & root-cause rework.',
    badgeColor: 'orange',
    focusArea: 'Depot triage, component repair teardowns, rework cost & warranty root causes',
    detailLevel: 'full',
    permissions: ['perform_triage', 'update_repair_bom', 'complete_rma', 'manage_service_inventory']
  }
];

export const INITIAL_USERS: User[] = [
  // Customer users
  {
    id: 'usr-cust-pm-1',
    name: 'Sarah Lin',
    email: 'sarah.lin@voltmobility.com',
    roleId: 'customer_pm',
    roleCategory: 'customer',
    company: 'VoltMobility EV',
    department: 'Vehicle Electronics Program Office',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-cust-eng-1',
    name: 'David Chen',
    email: 'david.chen@voltmobility.com',
    roleId: 'customer_engineering',
    roleCategory: 'customer',
    company: 'VoltMobility EV',
    department: 'Power Electronics R&D',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-cust-sc-1',
    name: 'Elena Rostova',
    email: 'e.rostova@apexbiomed.com',
    roleId: 'customer_supply_chain',
    roleCategory: 'customer',
    company: 'Apex BioMedical Devices',
    department: 'Global Strategic Sourcing',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-cust-qa-1',
    name: 'Marcus Vance',
    email: 'm.vance@aerosysdefense.com',
    roleId: 'customer_quality',
    roleCategory: 'customer',
    company: 'AeroSys Avionics',
    department: 'Product Assurance & Regulatory',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-cust-svc-1',
    name: 'Rachel Kim',
    email: 'rachel.kim@orionrobotics.com',
    roleId: 'customer_after_sales',
    roleCategory: 'customer',
    company: 'Orion Warehouse Robotics',
    department: 'Field Operations & Depot Services',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },

  // Internal users
  {
    id: 'usr-int-acct-1',
    name: 'Michael Reynolds',
    email: 'm.reynolds@nexgile.com',
    roleId: 'internal_account',
    roleCategory: 'internal',
    company: 'Nexgile Manufacturing',
    department: 'Global Customer Success',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-int-ops-1',
    name: 'Carlos Mendez',
    email: 'c.mendez@nexgile.com',
    roleId: 'internal_ops',
    roleCategory: 'internal',
    company: 'Nexgile Manufacturing',
    department: 'Plant 2 - Advanced SMT & Final Assembly',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-int-qa-1',
    name: 'Dr. Anita Joshi',
    email: 'a.joshi@nexgile.com',
    roleId: 'internal_quality',
    roleCategory: 'internal',
    company: 'Nexgile Manufacturing',
    department: 'Quality Engineering & Six Sigma',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-int-plan-1',
    name: 'Kevin O\'Connor',
    email: 'k.oconnor@nexgile.com',
    roleId: 'internal_planning',
    roleCategory: 'internal',
    company: 'Nexgile Manufacturing',
    department: 'Master Production Scheduling',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-int-log-1',
    name: 'Priya Patel',
    email: 'p.patel@nexgile.com',
    roleId: 'internal_logistics',
    roleCategory: 'internal',
    company: 'Nexgile Manufacturing',
    department: 'Inbound Supply Chain & Customs',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-int-svc-1',
    name: 'Thomas Mueller',
    email: 't.mueller@nexgile.com',
    roleId: 'internal_service',
    roleCategory: 'internal',
    company: 'Nexgile Manufacturing',
    department: 'Aftermarket Repair Depot & Warranty',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'prog-001',
    code: 'NX-VM-BMS-G3',
    name: 'NextGen EV Battery Management System (BMS Gen-3)',
    customerName: 'VoltMobility EV',
    productCategory: 'Automotive Powertrain Electronics',
    facility: 'Plant 1 (Austin High-Tech Campus)',
    stage: 'PVT (Production Validation)',
    health: 'green',
    progressPercent: 78,
    targetLaunchDate: '2026-11-15',
    targetVolume: 85000,
    currentUnitsBuilt: 12400,
    currentYieldPercent: 98.4,
    internalScrapPercent: 1.6,
    openIssuesCount: 2,
    pendingApprovalsCount: 1,
    customerSummary: 'PVT Phase 2 run completed 10,000 unit batch with 98.4% first-pass yield. Thermal chamber environmental stress testing passed. On track for November mass production ramp.',
    internalNotes: 'SMT Line 2 reflow profile optimized for lead-free SAC305 solder paste. Minor flux residue mitigated by ultrasonic wash dwell time adjustment (+8s). Component buffer at 6.2 weeks.',
    keyMilestones: [
      { id: 'm1', title: 'EVT Build & Validation', dueDate: '2026-03-20', status: 'completed', completionPercent: 100 },
      { id: 'm2', title: 'DVT Environmental Stress Test', dueDate: '2026-06-30', status: 'completed', completionPercent: 100 },
      { id: 'm3', title: 'PVT 10k Run & FAI Sign-off', dueDate: '2026-09-10', status: 'on_track', completionPercent: 85 },
      { id: 'm4', title: 'Mass Production Ramp 85k', dueDate: '2026-11-15', status: 'on_track', completionPercent: 20 }
    ],
    updatedAt: '2026-08-26T14:30:00Z'
  },
  {
    id: 'prog-002',
    code: 'NX-BIO-PUMP-PRO',
    name: 'Precision Infusion Smart Pump Controller Module',
    customerName: 'Apex BioMedical Devices',
    productCategory: 'Class II Medical Diagnostic Hardware',
    facility: 'Plant 3 (ISO 13485 Cleanroom Annex)',
    stage: 'DVT (Design Validation)',
    health: 'yellow',
    progressPercent: 54,
    targetLaunchDate: '2027-02-28',
    targetVolume: 42000,
    currentUnitsBuilt: 3200,
    currentYieldPercent: 94.1,
    internalScrapPercent: 5.9,
    openIssuesCount: 5,
    pendingApprovalsCount: 3,
    customerSummary: 'Design verification testing ongoing. Biocompatibility and EMC testing showing high compliance. Minor schedule adjustment for custom ASIC lead-time buffer.',
    internalNotes: 'Piezoelectric driver circuit showing 4.2% failure during high-humidity 40C/93%RH dwell. Root cause: solder bridge on QFN-32 pitch. Corrective action: revised stencil thickness from 120um to 100um.',
    keyMilestones: [
      { id: 'm2-1', title: 'Schematic Freeze & DFM', dueDate: '2026-04-15', status: 'completed', completionPercent: 100 },
      { id: 'm2-2', title: 'DVT Cleanroom Prototype Build', dueDate: '2026-07-20', status: 'completed', completionPercent: 100 },
      { id: 'm2-3', title: 'FDA 510(k) Pre-Audit Dossier', dueDate: '2026-10-15', status: 'at_risk', completionPercent: 60 },
      { id: 'm2-4', title: 'PVT Medical Validation Run', dueDate: '2026-12-10', status: 'on_track', completionPercent: 0 }
    ],
    updatedAt: '2026-08-25T18:15:00Z'
  },
  {
    id: 'prog-003',
    code: 'NX-AERO-FCS-400',
    name: 'Dual-Redundant Flight Control Gateway Computer',
    customerName: 'AeroSys Avionics',
    productCategory: 'DO-254 / DO-178C Aerospace Avionics',
    facility: 'Plant 1 (AS9100 Certified Avionics Bay)',
    stage: 'Mass Production (Ramp)',
    health: 'green',
    progressPercent: 92,
    targetLaunchDate: '2026-05-10',
    targetVolume: 12000,
    currentUnitsBuilt: 8900,
    currentYieldPercent: 99.1,
    internalScrapPercent: 0.9,
    openIssuesCount: 1,
    pendingApprovalsCount: 0,
    customerSummary: 'Production line operating at full steady state. Yield at 99.1% across automated optical inspection (AOI) and conformal coating cure. Delivered 8,900 units with 100% on-time delivery (OTD).',
    internalNotes: 'Robotic conformal coating thickness verified at 55 ± 5 um (MIL-I-46058C). Zero defects logged on latest 400-unit lot #NX-AERO-884.',
    keyMilestones: [
      { id: 'm3-1', title: 'AS9100 First Article Inspection', dueDate: '2026-02-15', status: 'completed', completionPercent: 100 },
      { id: 'm3-2', title: 'Vibration & Thermal Vacuum Test', dueDate: '2026-04-01', status: 'completed', completionPercent: 100 },
      { id: 'm3-3', title: 'Full Rate Production Milestone', dueDate: '2026-08-01', status: 'completed', completionPercent: 100 },
      { id: 'm3-4', title: 'Annual Surveillance Audit', dueDate: '2026-12-01', status: 'on_track', completionPercent: 15 }
    ],
    updatedAt: '2026-08-26T11:00:00Z'
  },
  {
    id: 'prog-004',
    code: 'NX-BOT-AMR-DRIVE',
    name: 'Heavy-Payload Autonomous Mobile Robot (AMR) Inverter',
    customerName: 'Orion Warehouse Robotics',
    productCategory: 'Industrial Automation & Robotics',
    facility: 'Plant 2 (Power Electronics Cell 4)',
    stage: 'EVT (Engineering Validation)',
    health: 'red',
    progressPercent: 35,
    targetLaunchDate: '2027-04-15',
    targetVolume: 25000,
    currentUnitsBuilt: 850,
    currentYieldPercent: 88.5,
    internalScrapPercent: 11.5,
    openIssuesCount: 8,
    pendingApprovalsCount: 4,
    customerSummary: 'EVT phase active. Power MOSFET thermal dissipation under peak torque requires heat sink redesign. Internal team is testing revised vapor chamber copper cold plate.',
    internalNotes: 'CRITICAL: High failure rate at 48V/150A continuous stall current. MOSFET gate ringing measured at 65V (exceeds 60V Vds rating). Redesigning snubber circuit + ordering samples of 80V GaN transistors.',
    keyMilestones: [
      { id: 'm4-1', title: 'EVT Alpha Board Spin 1', dueDate: '2026-06-15', status: 'completed', completionPercent: 100 },
      { id: 'm4-2', title: 'EVT Spin 2 (Thermal Overhaul)', dueDate: '2026-09-30', status: 'delayed', completionPercent: 40 },
      { id: 'm4-3', title: 'DVT Tooling Release', dueDate: '2026-12-15', status: 'at_risk', completionPercent: 10 },
      { id: 'm4-4', title: 'PVT Pilot Build', dueDate: '2027-02-20', status: 'on_track', completionPercent: 0 }
    ],
    updatedAt: '2026-08-26T16:45:00Z'
  },
  {
    id: 'prog-005',
    code: 'NX-IOT-GATEWAY-X',
    name: 'Ruggedized Industrial Edge IoT Gateway & Mesh Sensor',
    customerName: 'VoltMobility EV',
    productCategory: 'Smart Factory Connected Sensors',
    facility: 'Plant 1 (Surface Mount SMT 1)',
    stage: 'Mass Production (Ramp)',
    health: 'green',
    progressPercent: 88,
    targetLaunchDate: '2026-07-01',
    targetVolume: 120000,
    currentUnitsBuilt: 94000,
    currentYieldPercent: 99.4,
    internalScrapPercent: 0.6,
    openIssuesCount: 0,
    pendingApprovalsCount: 0,
    customerSummary: 'Ramping at 4,500 units/week. All IP67 ingress testing validated. Buffer inventory positioned in European & North American hubs.',
    internalNotes: 'Automated test fixture cycle time reduced from 42s to 28s per unit. Production running smoothly at 99.4% FPY.',
    keyMilestones: [
      { id: 'm5-1', title: 'FCC/CE/IC Certification', dueDate: '2026-03-01', status: 'completed', completionPercent: 100 },
      { id: 'm5-2', title: 'IP67 Environmental Testing', dueDate: '2026-05-15', status: 'completed', completionPercent: 100 },
      { id: 'm5-3', title: 'Mass Production Ramp 100k', dueDate: '2026-09-01', status: 'on_track', completionPercent: 94 }
    ],
    updatedAt: '2026-08-24T09:20:00Z'
  }
];

export const INITIAL_STATUS_HISTORY: StatusHistoryRecord[] = [
  {
    id: 'sh-001',
    programId: 'prog-004',
    programName: 'NX-BOT-AMR-DRIVE',
    changedByName: 'Dr. Anita Joshi (Quality Engineering)',
    category: 'health',
    oldStatus: 'yellow',
    newStatus: 'red',
    reason: 'Elevated MOSFET thermal stress failure during 48V continuous stall test. Health moved to Red pending gate snubber redesign and revised heat sink qualification.',
    isInternalOnly: false,
    createdAt: '2026-08-26T16:30:00Z'
  },
  {
    id: 'sh-002',
    programId: 'prog-001',
    programName: 'NX-VM-BMS-G3',
    changedByName: 'Carlos Mendez (Manufacturing Ops)',
    category: 'yield',
    oldStatus: '97.2%',
    newStatus: '98.4%',
    reason: 'Reflow profile temperature curve optimized for zone 5 & 6, reducing solder ball defects by 85%. First-pass yield elevated to 98.4%.',
    isInternalOnly: false,
    createdAt: '2026-08-25T14:10:00Z'
  },
  {
    id: 'sh-003',
    programId: 'prog-002',
    programName: 'NX-BIO-PUMP-PRO',
    changedByName: 'Kevin O\'Connor (Production Planning)',
    category: 'schedule',
    oldStatus: 'On Schedule',
    newStatus: '2-Week Buffer Extended',
    reason: 'Custom ASIC packaging delivery moved by vendor from Aug 28 to Sep 12. DVT build slot rescheduled with cleanroom line 3.',
    isInternalOnly: false,
    createdAt: '2026-08-24T11:00:00Z'
  },
  {
    id: 'sh-004',
    programId: 'prog-003',
    programName: 'NX-AERO-FCS-400',
    changedByName: 'Michael Reynolds (Account Director)',
    category: 'milestone',
    oldStatus: 'PVT Testing',
    newStatus: 'Full Rate Mass Production',
    reason: 'AS9100 FAI and FAA DER witness testing passed without non-conformance. Program successfully transitioned to steady-state Mass Production.',
    isInternalOnly: false,
    createdAt: '2026-08-20T09:45:00Z'
  },
  {
    id: 'sh-005',
    programId: 'prog-001',
    programName: 'NX-VM-BMS-G3',
    changedByName: 'Sarah Lin (Customer Program Manager)',
    category: 'stage',
    oldStatus: 'DVT',
    newStatus: 'PVT (Production Validation)',
    reason: 'Signed off DVT exit criteria following 500-hour thermal shock and vibration compliance verification.',
    isInternalOnly: false,
    createdAt: '2026-08-10T16:00:00Z'
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-001',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    title: 'High-torque stall thermal runaway on MOSFET Bridge Q1-Q4',
    severity: 'critical',
    status: 'in_investigation',
    owner: 'David Chen / Dr. Anita Joshi',
    category: 'Hardware & Thermal Design',
    customerVisible: true,
    customerSummary: 'Investigating thermal performance under peak torque limit. Redesigning heat spreader and evaluating GaN power stage upgrade.',
    internalRootCause: 'Rds(on) temperature coefficient causes positive feedback loop under >140A load. Copper trace thickness currently 2oz, needs upgrade to 3oz with direct thermal vias.',
    createdAt: '2026-08-26T15:00:00Z'
  },
  {
    id: 'iss-002',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'Micro-solder bridging on QFN-32 piezo driver IC',
    severity: 'high',
    status: 'capa_pending',
    owner: 'Carlos Mendez (Mfg Ops)',
    category: 'SMT Process Quality',
    customerVisible: true,
    customerSummary: 'Fine-pitch component stencil aperture adjusted to eliminate solder bridging. Corrective action implemented in next build.',
    internalRootCause: 'Laser-cut stencil 120um had 1:1 aperture ratio. Reduced to 85% area with nano-coating to prevent paste slumping.',
    createdAt: '2026-08-24T10:15:00Z'
  },
  {
    id: 'iss-003',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'CAN-FD bus transceiver supply lead time spike',
    severity: 'medium',
    status: 'open',
    owner: 'Priya Patel (Logistics)',
    category: 'Component Supply Chain',
    customerVisible: true,
    customerSummary: 'Primary IC lead time extended by 4 weeks. Secondary approved manufacturer (AML) part already qualified in DVT.',
    internalRootCause: 'TI manufacturing fab maintenance backlog. Sourced 15,000 units from authorized secondary distributor with COC.',
    createdAt: '2026-08-22T08:30:00Z'
  },
  {
    id: 'iss-004',
    programId: 'prog-003',
    programCode: 'NX-AERO-FCS-400',
    title: 'Conformal coating UV inspection minor void on connector J3',
    severity: 'low',
    status: 'resolved',
    owner: 'Dr. Anita Joshi',
    category: 'Workmanship / Coating',
    customerVisible: true,
    customerSummary: 'Manual touch-up masking protocol refined. 100% automated optical inspection confirms zero voids in lot #884.',
    internalRootCause: 'Connector shroud shadow angle during robotic spray head sweep. Programmed 15-degree wrist offset in Nordson coater.',
    createdAt: '2026-08-18T14:20:00Z'
  }
];

export const INITIAL_APPROVALS: Approval[] = [
  {
    id: 'app-001',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    title: 'ECO-2026-088: Secondary CAN-FD Transceiver Alternate P/N',
    approvalType: 'ECO',
    status: 'pending',
    requestedBy: 'Priya Patel (Logistics)',
    requiredRole: 'Customer Engineering / Quality',
    deadline: '2026-08-30',
    createdAt: '2026-08-25T10:00:00Z'
  },
  {
    id: 'app-002',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    title: 'Stage Gate: DVT to PVT Exit Review & Medical Dossier Sign-Off',
    approvalType: 'Stage Gate',
    status: 'pending',
    requestedBy: 'Kevin O\'Connor (Planning)',
    requiredRole: 'Customer Program Management & QA',
    deadline: '2026-09-05',
    createdAt: '2026-08-24T14:30:00Z'
  },
  {
    id: 'app-003',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    title: 'Engineering Deviation DEV-042: Heavy Copper PCB Substrate Spin 2',
    approvalType: 'Deviation',
    status: 'pending',
    requestedBy: 'David Chen (R&D)',
    requiredRole: 'Internal Quality / Operations',
    deadline: '2026-08-29',
    createdAt: '2026-08-26T17:00:00Z'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    userName: 'Carlos Mendez',
    userRole: 'Manufacturing Ops',
    roleCategory: 'internal',
    actionType: 'Yield Metric Updated',
    description: 'Updated PVT batch yield to 98.4% (+1.2% improvement)',
    isInternalOnly: false,
    timestamp: '15 mins ago'
  },
  {
    id: 'act-002',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    userName: 'Dr. Anita Joshi',
    userRole: 'Quality Engineering',
    roleCategory: 'internal',
    actionType: 'Health Status Changed',
    description: 'Updated health from Yellow to Red due to thermal runaway investigation',
    isInternalOnly: false,
    timestamp: '1 hour ago'
  },
  {
    id: 'act-003',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    userName: 'Sarah Lin',
    userRole: 'Program Management',
    roleCategory: 'customer',
    actionType: 'Document Uploaded',
    description: 'Uploaded ISO 13485 Risk Management Dossier Rev C',
    isInternalOnly: false,
    timestamp: '3 hours ago'
  },
  {
    id: 'act-004',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    userName: 'Priya Patel',
    userRole: 'Supply Chain',
    roleCategory: 'internal',
    actionType: 'ECO Submitted',
    description: 'Submitted ECO-2026-088 for CAN-FD dual-source component',
    isInternalOnly: false,
    timestamp: '5 hours ago'
  },
  {
    id: 'act-005',
    programId: 'prog-003',
    programCode: 'NX-AERO-FCS-400',
    userName: 'Michael Reynolds',
    userRole: 'Customer Success',
    roleCategory: 'internal',
    actionType: 'Shipment Released',
    description: 'Released 500-unit aerospace flight computer lot #884 to AeroSys',
    isInternalOnly: false,
    timestamp: '1 day ago'
  }
];

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    id: 'dashboard',
    label: 'Overview & Dashboard',
    iconName: 'LayoutDashboard',
    description: 'Unified manufacturing command center with executive KPIs, health metrics, and cross-functional action items.',
    customerVisibilitySummary: 'Executive portfolio health, milestone trackers, customer approvals, and summarized first-pass yield.',
    internalVisibilitySummary: 'Plant-by-plant operations, shift throughput, engineering scrap rates, and root-cause investigations.',
    plannedFeatures: [
      'Multi-program health roll-up',
      'Real-time yield & scrap dials',
      'Urgent gate approval queue',
      'Cross-company milestone Gantt'
    ]
  },
  {
    id: 'programs',
    label: 'Program & Project Tracking',
    iconName: 'GitMerge',
    badge: '5 Active',
    description: 'End-to-end NPI lifecycle management across R&D, EVT, DVT, PVT, and Mass Production ramp.',
    customerVisibilitySummary: 'Stage gate milestones, delivery forecast, customer design reviews, and engineering change orders (ECOs).',
    internalVisibilitySummary: 'Detailed stage exit criteria, tooling readiness, DFM feedback logs, internal test run logs, and resource allocation.',
    plannedFeatures: [
      'Interactive NPI Stage-Gate matrix (EVT / DVT / PVT / Ramp)',
      'Engineering Change Order (ECO) workflow with electronic signatures',
      'Interactive Milestone Gantt chart with critical path tracking',
      'Design for Manufacturability (DFM) feedback log & CAD review'
    ]
  },
  {
    id: 'production',
    label: 'Production Visibility',
    iconName: 'Cpu',
    badge: 'Live',
    description: 'Shop floor visibility, line-by-line throughput, automated optical inspection, and equipment performance.',
    customerVisibilitySummary: 'Target vs actual volume builds, released lot test yields, and scheduled completion dates.',
    internalVisibilitySummary: 'Station-by-station telemetry, cycle times, Overall Equipment Effectiveness (OEE), line stoppage root causes, and shift logs.',
    plannedFeatures: [
      'Live SMT & Box-Build line status boards',
      'Station cycle time & bottleneck waterfall chart',
      'Overall Equipment Effectiveness (OEE) & downtime log',
      'Automated Test Equipment (ATE) yield breakdown'
    ]
  },
  {
    id: 'quality',
    label: 'Quality Management & Compliance',
    iconName: 'ShieldCheck',
    badge: '4 Issues',
    description: 'Enterprise quality assurance, compliance certificates (ISO 9001/13485/AS9100), FAI, and 8D CAPA tracking.',
    customerVisibilitySummary: 'First Article Inspection (FAI) reports, Certificates of Conformance (CoC), and customer CAPA summaries.',
    internalVisibilitySummary: 'Statistical Process Control (SPC) X-bar/R charts, internal Non-Conformance Reports (NCRs), scrap heatmaps, and 8D root cause analysis.',
    plannedFeatures: [
      '8D Corrective & Preventive Action (CAPA) workflow',
      'Statistical Process Control (SPC) & Cp/Cpk analytics',
      'First Article Inspection (FAI / AS9102) digital sign-off',
      'Automated Certificate of Conformance (CoC) generator'
    ]
  },
  {
    id: 'supply_chain',
    label: 'Supply Chain & Materials Visibility',
    iconName: 'Boxes',
    badge: '2 Alerts',
    description: 'Component pipeline, BOM risk analysis, inventory buffer stock, purchase orders, and logistics tracking.',
    customerVisibilitySummary: 'Purchase Order fulfillment status, critical path material readiness, and shipment tracking.',
    internalVisibilitySummary: 'Single-source component risks, warehouse dock-to-stock metrics, supplier scorecard ratings, and customs clearance status.',
    plannedFeatures: [
      'Multi-tier BOM shortage & risk analyzer',
      'Real-time Inbound carrier & customs GPS tracking',
      'Supplier quality & on-time delivery scorecards',
      'Buffer inventory & Safety Stock threshold alarms'
    ]
  },
  {
    id: 'after_sales',
    label: 'After-Sales Service (RMA/Repair/Warranty/Spares)',
    iconName: 'Wrench',
    badge: 'RMA',
    description: 'Reverse logistics, Return Merchandise Authorization (RMA), depot repair diagnostics, and spare parts catalog.',
    customerVisibilitySummary: 'Create and track RMA return status, turnaround time (TAT), warranty coverage, and order replacement spares.',
    internalVisibilitySummary: 'Depot technician diagnostic triage, teardown analysis, repair BOM cost, warranty recovery, and field failure trends.',
    plannedFeatures: [
      'Customer self-service RMA creation & return label generator',
      'Depot repair diagnostic bench & teardown logger',
      'Mean Time Between Failures (MTBF) & field failure pareto',
      'Warranty claim validation & spares inventory provisioning'
    ]
  },
  {
    id: 'collaboration',
    label: 'Collaboration, Documents & Knowledge',
    iconName: 'FolderGit2',
    description: 'Controlled document repository, engineering drawings, meeting action items, and cross-organization messaging.',
    customerVisibilitySummary: 'Access released specifications, approved CAD drawings, user manuals, and shared meeting action items.',
    internalVisibilitySummary: 'Internal work instructions (SOPs), calibration logs, customer account notes, and cross-team design review channels.',
    plannedFeatures: [
      'Version-controlled drawing & specification vault',
      'Live cross-functional annotation & mark-up on schematics',
      'Secure customer-supplier direct chat & action item boards',
      'Audit-ready electronic document retention compliance'
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics & Reporting',
    iconName: 'BarChart3',
    badge: 'AI Trends',
    description: 'Executive dashboards, customizable customer metrics, predictive risk early-warning radar, and self-serve report builders.',
    customerVisibilitySummary: 'Configurable customer widgets, program yield trends, shipment metrics, document revisions, and shareable reports.',
    internalVisibilitySummary: 'Executive portfolio health, multi-facility capacity utilization, predictive risk flags, and deep Six Sigma DPMO telemetry.',
    plannedFeatures: [
      'Portfolio health & On-Time Delivery executive dashboards',
      'Configurable drag-and-drop customer dashboard widgets',
      'Predictive delivery, quality, and supply risk flag radar',
      'Self-serve custom report builder with CSV/Excel/PDF export'
    ]
  }
];
