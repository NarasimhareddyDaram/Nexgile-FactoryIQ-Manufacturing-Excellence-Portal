import {
  PortfolioHealthSummary,
  MonthlyDeliveryTrend,
  MonthlyQualityTrend,
  FacilityCapacityMetric,
  ServiceKpiMetric,
  CustomerDashboardWidget,
  PredictiveRiskFlag,
  SavedReportTemplate,
  ReportRowData
} from '../types';

export const INITIAL_PORTFOLIO_HEALTH: PortfolioHealthSummary = {
  totalPrograms: 8,
  greenCount: 5,
  yellowCount: 2,
  redCount: 1,
  onTimeDeliveryRate: 97.4,
  firstPassYieldAvg: 98.35,
  overallCapacityUtilization: 86.2,
  serviceCsatScore: 4.88,
  averageRmaTatDays: 4.1
};

export const INITIAL_DELIVERY_TRENDS: MonthlyDeliveryTrend[] = [
  { month: 'Mar 2026', onTimeRate: 95.8, targetRate: 95.0, shippedUnits: 42300, delayedLotsCount: 3 },
  { month: 'Apr 2026', onTimeRate: 96.4, targetRate: 95.0, shippedUnits: 48900, delayedLotsCount: 2 },
  { month: 'May 2026', onTimeRate: 95.2, targetRate: 95.0, shippedUnits: 51200, delayedLotsCount: 4 },
  { month: 'Jun 2026', onTimeRate: 97.1, targetRate: 95.0, shippedUnits: 56800, delayedLotsCount: 2 },
  { month: 'Jul 2026', onTimeRate: 98.2, targetRate: 95.0, shippedUnits: 62400, delayedLotsCount: 1 },
  { month: 'Aug 2026', onTimeRate: 97.4, targetRate: 95.0, shippedUnits: 59700, delayedLotsCount: 2 }
];

export const INITIAL_QUALITY_TRENDS: MonthlyQualityTrend[] = [
  { month: 'Mar 2026', firstPassYield: 97.6, dpmo: 285, scrapRate: 2.1, reworkHours: 142 },
  { month: 'Apr 2026', firstPassYield: 97.9, dpmo: 240, scrapRate: 1.9, reworkHours: 118 },
  { month: 'May 2026', firstPassYield: 98.1, dpmo: 210, scrapRate: 1.7, reworkHours: 95 },
  { month: 'Jun 2026', firstPassYield: 98.4, dpmo: 175, scrapRate: 1.5, reworkHours: 76 },
  { month: 'Jul 2026', firstPassYield: 98.7, dpmo: 148, scrapRate: 1.3, reworkHours: 58 },
  { month: 'Aug 2026', firstPassYield: 98.35, dpmo: 162, scrapRate: 1.4, reworkHours: 64 }
];

export const INITIAL_CAPACITY_METRICS: FacilityCapacityMetric[] = [
  {
    facilityName: 'Plant 1 (Austin High-Tech Campus)',
    siteCode: 'SITE-ATX-01',
    smtUtilization: 91.4,
    boxBuildUtilization: 84.2,
    testInspectionUtilization: 88.6,
    cleanroomUtilization: 94.0,
    headcountShiftEfficiency: 96.2,
    bottleneckStation: 'In-Circuit Test (ICT) Bed-of-Nails'
  },
  {
    facilityName: 'Plant 2 (Guadalajara Electronics Park)',
    siteCode: 'SITE-GDL-02',
    smtUtilization: 85.8,
    boxBuildUtilization: 89.1,
    testInspectionUtilization: 82.4,
    cleanroomUtilization: 78.5,
    headcountShiftEfficiency: 94.0,
    bottleneckStation: 'Final Conformal Coating & UV Cure'
  },
  {
    facilityName: 'Plant 3 (Penang Semiconductor & SMT)',
    siteCode: 'SITE-PNG-03',
    smtUtilization: 88.7,
    boxBuildUtilization: 76.3,
    testInspectionUtilization: 92.1,
    cleanroomUtilization: 86.4,
    headcountShiftEfficiency: 95.5,
    bottleneckStation: 'High-Speed BGA X-Ray / AOI Station'
  }
];

export const INITIAL_SERVICE_KPIS: ServiceKpiMetric[] = [
  {
    category: 'After-Sales & Reverse Logistics',
    metricName: 'RMA Depot Turnaround Time (TAT)',
    currentValue: '4.1',
    targetValue: '< 5.0',
    unit: 'Days',
    status: 'optimal',
    trend: 'improving',
    changeVsLastMonth: '-0.4d vs Jul'
  },
  {
    category: 'Customer Satisfaction',
    metricName: 'Customer Net CSAT Rating',
    currentValue: '4.88',
    targetValue: '> 4.70',
    unit: '/ 5.0',
    status: 'optimal',
    trend: 'improving',
    changeVsLastMonth: '+0.12 pts'
  },
  {
    category: 'Engineering & DFM',
    metricName: 'ECO Turnaround Time',
    currentValue: '28.5',
    targetValue: '< 36.0',
    unit: 'Hours',
    status: 'optimal',
    trend: 'improving',
    changeVsLastMonth: '-4.2h vs Jul'
  },
  {
    category: 'Quality Assurance',
    metricName: 'First-Contact Ticket Resolution',
    currentValue: '94.2',
    targetValue: '> 90.0',
    unit: '%',
    status: 'optimal',
    trend: 'improving',
    changeVsLastMonth: '+1.8% vs Jul'
  },
  {
    category: 'Supply Chain Assurance',
    metricName: 'BOM Safety Buffer Coverage',
    currentValue: '98.6',
    targetValue: '> 98.0',
    unit: '%',
    status: 'optimal',
    trend: 'stable',
    changeVsLastMonth: '+0.2%'
  },
  {
    category: 'Warranty & Cost',
    metricName: 'Warranty Claim Recovery Rate',
    currentValue: '92.4',
    targetValue: '> 88.0',
    unit: '%',
    status: 'optimal',
    trend: 'improving',
    changeVsLastMonth: '+2.1%'
  }
];

export const INITIAL_CUSTOMER_WIDGETS: CustomerDashboardWidget[] = [
  {
    id: 'w-proj-status',
    type: 'project_status',
    title: 'Active Program Milestones & Stage Gates',
    description: 'Current stage, completion percentage, next delivery milestone, and health badge for customer programs.',
    width: 'half',
    isVisible: true,
    order: 1,
    iconName: 'GitMerge'
  },
  {
    id: 'w-quality-sum',
    type: 'quality_summary',
    title: 'First-Pass Yield & DPMO Telemetry',
    description: 'Weekly test yield performance, automated optical inspection stats, and defect pareto.',
    width: 'half',
    isVisible: true,
    order: 2,
    iconName: 'ShieldCheck'
  },
  {
    id: 'w-shipments',
    type: 'shipments',
    title: 'Live Finished Goods Shipments & In-Transit GPS',
    description: 'Real-time airway bill tracking, estimated delivery dates, and dock-to-dock status.',
    width: 'half',
    isVisible: true,
    order: 3,
    iconName: 'Truck'
  },
  {
    id: 'w-smt-progress',
    type: 'smt_progress',
    title: 'Real-Time SMT & Box-Build Volume Pace',
    description: 'Live daily target vs built counters, shift run-rate, and upcoming lot release forecast.',
    width: 'half',
    isVisible: true,
    order: 4,
    iconName: 'Cpu'
  },
  {
    id: 'w-documents',
    type: 'documents',
    title: 'Recent Engineering Docs & Released Baselines',
    description: 'Quick access to approved CAD, FAI test reports, and Certificate of Conformance packs.',
    width: 'half',
    isVisible: true,
    order: 5,
    iconName: 'FolderGit2'
  },
  {
    id: 'w-rma-status',
    type: 'rma_status',
    title: 'RMA Depot Returns & Service Queue',
    description: 'Active repair tickets, warranty validation, and depot shipment turnarounds.',
    width: 'half',
    isVisible: true,
    order: 6,
    iconName: 'Wrench'
  }
];

export const INITIAL_PREDICTIVE_RISKS: PredictiveRiskFlag[] = [
  {
    id: 'risk-001',
    category: 'delivery',
    title: 'DVT Component Stage Buffer Erosion (3 Micro-Delays in 30 Days)',
    programId: 'prog-002',
    programCode: 'NX-BIO-PUMP-PRO',
    programName: 'UltraPrecision Insulin Infusion Pump (Gen-2)',
    customerName: 'Apex BioMedical Devices',
    severity: 'critical',
    confidenceScore: 94,
    trendLogicTrigger: '3 cumulative sub-tier supplier lead time slippages in last 30 days (Delta: +11 days buffer consumed).',
    leadTimeImpactDays: 14,
    financialExposureUsd: 145000,
    rootCauseAnalysis: 'Custom high-torque micro-stepper motor vendor in Germany encountered cleanroom tooling maintenance delays, pushing next batch delivery by 14 days.',
    trendData: [
      { period: 'Week 1', measuredValue: 2, thresholdLimit: 5 },
      { period: 'Week 2', measuredValue: 6, thresholdLimit: 5 },
      { period: 'Week 3', measuredValue: 9, thresholdLimit: 5 },
      { period: 'Week 4', measuredValue: 14, thresholdLimit: 5 }
    ],
    suggestedMitigation: 'Split lot shipment via direct air charter + dual-source validation of Maxon precision alternate already in pre-qualification.',
    mitigationStatus: 'active',
    createdAt: '2026-08-26T14:30:00Z'
  },
  {
    id: 'risk-002',
    category: 'quality',
    title: 'SMT Line 3 Reflow Delta Drift & BGA Solder Ball Variance (+18% Alert)',
    programId: 'prog-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    programName: 'Industrial AMR 48V Heavy-Duty Drive Inverter',
    customerName: 'Orion Warehouse Robotics',
    severity: 'critical',
    confidenceScore: 91,
    trendLogicTrigger: '3D AOI solder paste volume Cpk dropped below 1.33 across 4 consecutive shift runs on Zone 6 reflow.',
    leadTimeImpactDays: 6,
    financialExposureUsd: 88000,
    rootCauseAnalysis: 'Heater element thermal thermocouple #4 calibration drift causing intermittent 4°C peak profile overshoot, creating micro-voiding in high-mass FET thermal pads.',
    trendData: [
      { period: 'Run 101', measuredValue: 1.48, thresholdLimit: 1.33 },
      { period: 'Run 102', measuredValue: 1.39, thresholdLimit: 1.33 },
      { period: 'Run 103', measuredValue: 1.28, thresholdLimit: 1.33 },
      { period: 'Run 104', measuredValue: 1.19, thresholdLimit: 1.33 }
    ],
    suggestedMitigation: 'Re-profile nitrogen reflow oven with 9-channel Datapaq logger; replace thermocouple probe on Line 3 reflow Zone 6.',
    mitigationStatus: 'in_progress',
    mitigatedByName: 'Dr. Anita Joshi (Quality Lead)',
    mitigatedDate: '2026-08-27T08:00:00Z',
    createdAt: '2026-08-25T11:15:00Z'
  },
  {
    id: 'risk-003',
    category: 'supply',
    title: 'Automotive Dual-Core MCU Wafer Allocation Freeze (Lead Time Leap 18w -> 32w)',
    programId: 'prog-001',
    programCode: 'NX-VM-BMS-G3',
    programName: 'NextGen EV Battery Management System (BMS Gen-3)',
    customerName: 'VoltMobility EV',
    severity: 'high',
    confidenceScore: 88,
    trendLogicTrigger: 'Silicon foundry foundry advisory issued allocation quota cap for AEC-Q100 32-bit automotive controllers.',
    leadTimeImpactDays: 28,
    financialExposureUsd: 320000,
    rootCauseAnalysis: 'Global 40nm automotive foundry wafer capacity constrained. Tier-1 distributor notified allocation restriction impacting Q4 2026 ramp.',
    trendData: [
      { period: 'May 2026', measuredValue: 18, thresholdLimit: 22 },
      { period: 'Jun 2026', measuredValue: 22, thresholdLimit: 22 },
      { period: 'Jul 2026', measuredValue: 27, thresholdLimit: 22 },
      { period: 'Aug 2026', measuredValue: 32, thresholdLimit: 22 }
    ],
    suggestedMitigation: 'Execute immediate strategic purchase order for 6-month buffer stock from authorized franchise distributor; trigger secondary pin-compatible qualification.',
    mitigationStatus: 'active',
    createdAt: '2026-08-24T09:00:00Z'
  },
  {
    id: 'risk-004',
    category: 'delivery',
    title: 'Frankfurt Air Freight Customs Clearance Inspection Hold',
    programId: 'prog-003',
    programCode: 'NX-AERO-FCS-400',
    programName: 'Flight Control Surface Actuator Computer',
    customerName: 'AeroSys Avionics',
    severity: 'medium',
    confidenceScore: 82,
    trendLogicTrigger: 'EU dual-use export documentation clarification request delayed air pallet clearance beyond 72h SLA.',
    leadTimeImpactDays: 4,
    financialExposureUsd: 45000,
    rootCauseAnalysis: 'Customs authority requested supplementary End-User Certificate (EUC) validation for DO-254 flight-critical hardware.',
    trendData: [
      { period: 'Day 1', measuredValue: 24, thresholdLimit: 48 },
      { period: 'Day 2', measuredValue: 48, thresholdLimit: 48 },
      { period: 'Day 3', measuredValue: 72, thresholdLimit: 48 },
      { period: 'Day 4', measuredValue: 96, thresholdLimit: 48 }
    ],
    suggestedMitigation: 'Direct escalation with Expeditors International customs broker; digital submission of pre-authenticated military/civilian dual-use cert.',
    mitigationStatus: 'in_progress',
    createdAt: '2026-08-26T17:45:00Z'
  },
  {
    id: 'risk-005',
    category: 'quality',
    title: 'Underfill Curing Void Rate Anomaly on 0.4mm Pitch High-Density BGA',
    programId: 'prog-005',
    programCode: 'NX-IOT-GATEWAY-5G',
    programName: 'Ruggedized Smart Grid 5G Edge Gateway',
    customerName: 'VoltMobility EV',
    severity: 'medium',
    confidenceScore: 79,
    trendLogicTrigger: 'Acoustic micro-imaging (C-SAM) revealed void percentage increased from 1.2% to 4.8% on lot #5G-4401.',
    leadTimeImpactDays: 3,
    financialExposureUsd: 38000,
    rootCauseAnalysis: 'Underfill epoxy dispense valve pre-heat temperature was set 3°C lower than validated recipe after routine preventive maintenance.',
    trendData: [
      { period: 'Lot 10', measuredValue: 1.1, thresholdLimit: 3.0 },
      { period: 'Lot 11', measuredValue: 1.4, thresholdLimit: 3.0 },
      { period: 'Lot 12', measuredValue: 2.8, thresholdLimit: 3.0 },
      { period: 'Lot 13', measuredValue: 4.8, thresholdLimit: 3.0 }
    ],
    suggestedMitigation: 'Reset Nordson dispense valve heater to 65°C ±0.5°C; run 100% C-SAM ultrasonic inspection on lot #5G-4401.',
    mitigationStatus: 'mitigated',
    mitigatedByName: 'Carlos Mendez (Ops Supervisor)',
    mitigatedDate: '2026-08-27T02:15:00Z',
    createdAt: '2026-08-23T10:00:00Z'
  },
  {
    id: 'risk-006',
    category: 'supply',
    title: 'High-Tg FR4 Copper-Clad Laminate Resin Shortage Warning',
    programId: 'prog-003',
    programCode: 'NX-AERO-FCS-400',
    programName: 'Flight Control Surface Actuator Computer',
    customerName: 'AeroSys Avionics',
    severity: 'high',
    confidenceScore: 85,
    trendLogicTrigger: 'Isola / Panasonic raw laminate raw delivery quote bumped by 3 weeks due to brominated epoxy supply crunch.',
    leadTimeImpactDays: 18,
    financialExposureUsd: 110000,
    rootCauseAnalysis: 'Upstream chemical precursor shortage in specialty halogen-free flame retardant resins.',
    trendData: [
      { period: 'Jun', measuredValue: 4, thresholdLimit: 6 },
      { period: 'Jul', measuredValue: 6, thresholdLimit: 6 },
      { period: 'Aug (W1)', measuredValue: 8, thresholdLimit: 6 },
      { period: 'Aug (W3)', measuredValue: 10, thresholdLimit: 6 }
    ],
    suggestedMitigation: 'Pre-order 12,000 panels of Isola 370HR high-Tg core material to reserve capacity at PCB fabrication partner.',
    mitigationStatus: 'active',
    createdAt: '2026-08-21T13:20:00Z'
  }
];

export const INITIAL_SAVED_TEMPLATES: SavedReportTemplate[] = [
  {
    id: 'rpt-exec-steerco',
    title: 'Monthly Executive SteerCo Operations Pack',
    description: 'Comprehensive cross-program portfolio scorecard including OTD, FPY, DPMO, scrap costs, and capacity utilization.',
    category: 'Executive',
    authorName: 'Michael Reynolds (Account Director)',
    createdAt: '2026-08-01',
    lastGenerated: '2026-08-27 08:30 AM',
    filterState: {
      dateRange: '30d',
      selectedPrograms: ['all'],
      selectedFacilities: ['all'],
      metricCategories: ['otd', 'yield', 'dpmo', 'capacity', 'scrap'],
      aggregationLevel: 'monthly'
    },
    chartType: 'composite',
    isFavorite: true
  },
  {
    id: 'rpt-cust-qbr',
    title: 'VoltMobility EV Quarterly Business Review (QBR)',
    description: 'Dedicated customer digest highlighting build progress, milestone completion, test yields, and shipment reliability.',
    category: 'Customer QBR',
    authorName: 'Sarah Lin (Customer PM Lead)',
    createdAt: '2026-08-10',
    lastGenerated: '2026-08-26 04:15 PM',
    filterState: {
      dateRange: '90d',
      selectedPrograms: ['prog-001', 'prog-005'],
      selectedFacilities: ['SITE-ATX-01'],
      metricCategories: ['otd', 'yield', 'shipments', 'milestones'],
      aggregationLevel: 'weekly'
    },
    chartType: 'bar',
    isFavorite: true
  },
  {
    id: 'rpt-quality-sixsigma',
    title: 'Six Sigma DPMO & Scrap Pareto Analysis',
    description: 'Deep-dive quality report focusing on component-level defects, station-by-station fallout, and scrap dollar exposure.',
    category: 'Quality Deep-Dive',
    authorName: 'Dr. Anita Joshi (Quality Director)',
    createdAt: '2026-08-15',
    lastGenerated: '2026-08-27 07:00 AM',
    filterState: {
      dateRange: '30d',
      selectedPrograms: ['all'],
      selectedFacilities: ['all'],
      metricCategories: ['yield', 'dpmo', 'scrap', 'capa'],
      aggregationLevel: 'daily'
    },
    chartType: 'line',
    isFavorite: false
  },
  {
    id: 'rpt-sc-allocation',
    title: 'Single-Source BOM & Lead Time Horizon Audit',
    description: 'Supply chain risk summary detailing critical component allocations, buffer stock burn rates, and vendor OTD ratings.',
    category: 'Supply Chain & BOM',
    authorName: 'Elena Rostova (Strategic Sourcing)',
    createdAt: '2026-08-18',
    lastGenerated: '2026-08-25 11:45 AM',
    filterState: {
      dateRange: '90d',
      selectedPrograms: ['all'],
      selectedFacilities: ['all'],
      metricCategories: ['allocation', 'lead_time', 'buffer_stock'],
      aggregationLevel: 'monthly'
    },
    chartType: 'area',
    isFavorite: false
  }
];

export const INITIAL_REPORT_ROWS: ReportRowData[] = [
  {
    id: 'row-001',
    programCode: 'NX-VM-BMS-G3',
    customer: 'VoltMobility EV',
    facility: 'Plant 1 (Austin)',
    period: 'Aug 2026',
    unitsPlanned: 14000,
    unitsBuilt: 13850,
    yieldPercent: 98.4,
    dpmo: 142,
    otdPercent: 98.6,
    scrapCostUsd: 4200,
    rmaCount: 1,
    status: 'Compliant'
  },
  {
    id: 'row-002',
    programCode: 'NX-BIO-PUMP-PRO',
    customer: 'Apex BioMedical',
    facility: 'Plant 1 (Austin - Cleanroom)',
    period: 'Aug 2026',
    unitsPlanned: 3500,
    unitsBuilt: 3420,
    yieldPercent: 99.2,
    dpmo: 85,
    otdPercent: 96.2,
    scrapCostUsd: 8900,
    rmaCount: 0,
    status: 'Compliant'
  },
  {
    id: 'row-003',
    programCode: 'NX-AERO-FCS-400',
    customer: 'AeroSys Avionics',
    facility: 'Plant 3 (Penang)',
    period: 'Aug 2026',
    unitsPlanned: 1200,
    unitsBuilt: 1200,
    yieldPercent: 99.7,
    dpmo: 45,
    otdPercent: 99.1,
    scrapCostUsd: 12400,
    rmaCount: 0,
    status: 'Compliant'
  },
  {
    id: 'row-004',
    programCode: 'NX-BOT-AMR-DRIVE',
    customer: 'Orion Robotics',
    facility: 'Plant 2 (Guadalajara)',
    period: 'Aug 2026',
    unitsPlanned: 4500,
    unitsBuilt: 3890,
    yieldPercent: 96.1,
    dpmo: 380,
    otdPercent: 88.4,
    scrapCostUsd: 19800,
    rmaCount: 5,
    status: 'Non-Conforming'
  },
  {
    id: 'row-005',
    programCode: 'NX-IOT-GATEWAY-5G',
    customer: 'VoltMobility EV',
    facility: 'Plant 2 (Guadalajara)',
    period: 'Aug 2026',
    unitsPlanned: 8000,
    unitsBuilt: 7920,
    yieldPercent: 98.8,
    dpmo: 120,
    otdPercent: 97.8,
    scrapCostUsd: 2900,
    rmaCount: 2,
    status: 'Compliant'
  },
  {
    id: 'row-006',
    programCode: 'NX-MED-DIAG-X1',
    customer: 'Apex BioMedical',
    facility: 'Plant 1 (Austin - Cleanroom)',
    period: 'Aug 2026',
    unitsPlanned: 2000,
    unitsBuilt: 1850,
    yieldPercent: 97.4,
    dpmo: 230,
    otdPercent: 92.5,
    scrapCostUsd: 11200,
    rmaCount: 1,
    status: 'At Risk'
  },
  {
    id: 'row-007',
    programCode: 'NX-SAT-TRANS-KA',
    customer: 'AeroSys Avionics',
    facility: 'Plant 3 (Penang)',
    period: 'Aug 2026',
    unitsPlanned: 800,
    unitsBuilt: 790,
    yieldPercent: 99.4,
    dpmo: 60,
    otdPercent: 98.8,
    scrapCostUsd: 15600,
    rmaCount: 0,
    status: 'Compliant'
  },
  {
    id: 'row-008',
    programCode: 'NX-IND-PLC-MODBUS',
    customer: 'Orion Robotics',
    facility: 'Plant 2 (Guadalajara)',
    period: 'Aug 2026',
    unitsPlanned: 6000,
    unitsBuilt: 5950,
    yieldPercent: 98.5,
    dpmo: 135,
    otdPercent: 98.2,
    scrapCostUsd: 3100,
    rmaCount: 1,
    status: 'Compliant'
  }
];
