export type RoleCategory = 'customer' | 'internal';

export type CustomerRoleId =
  | 'customer_engineering'
  | 'customer_supply_chain'
  | 'customer_quality'
  | 'customer_pm'
  | 'customer_after_sales';

export type InternalRoleId =
  | 'internal_account'
  | 'internal_planning'
  | 'internal_ops'
  | 'internal_quality'
  | 'internal_logistics'
  | 'internal_service';

export type RoleId = CustomerRoleId | InternalRoleId;

export interface Role {
  id: RoleId;
  name: string;
  category: RoleCategory;
  description: string;
  badgeColor: string;
  focusArea: string;
  detailLevel: 'summary' | 'full';
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  roleCategory: RoleCategory;
  company: string;
  department: string;
  avatar?: string;
}

export type HealthStatus = 'green' | 'yellow' | 'red';

export type ProgramStage =
  | 'R&D Concept'
  | 'EVT (Engineering Validation)'
  | 'DVT (Design Validation)'
  | 'PVT (Production Validation)'
  | 'Mass Production (Ramp)'
  | 'Sustaining / EOL';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'on_track' | 'at_risk' | 'delayed';
  completionPercent: number;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  customerName: string;
  productCategory: string;
  facility: string;
  stage: ProgramStage;
  health: HealthStatus;
  progressPercent: number;
  targetLaunchDate: string;
  targetVolume: number;
  currentUnitsBuilt: number;
  currentYieldPercent: number;
  internalScrapPercent: number;
  openIssuesCount: number;
  pendingApprovalsCount: number;
  customerSummary: string;
  internalNotes: string;
  keyMilestones: Milestone[];
  updatedAt: string;
}

export interface StatusHistoryRecord {
  id: string;
  programId: string;
  programName: string;
  changedByName: string;
  category: 'health' | 'stage' | 'yield' | 'schedule' | 'risk' | 'milestone' | 'general';
  oldStatus?: string;
  newStatus: string;
  reason: string;
  isInternalOnly: boolean;
  createdAt: string;
}

export interface Issue {
  id: string;
  programId: string;
  programCode: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_investigation' | 'capa_pending' | 'resolved';
  owner: string;
  category: string;
  customerVisible: boolean;
  customerSummary: string;
  internalRootCause: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  programId: string;
  programCode: string;
  title: string;
  approvalType: 'ECO' | 'Stage Gate' | 'Ship Hold' | 'Deviation' | 'Quality Sign-Off';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requiredRole: string;
  deadline: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  programId?: string;
  programCode?: string;
  userName: string;
  userRole: string;
  roleCategory: RoleCategory;
  actionType: string;
  description: string;
  isInternalOnly: boolean;
  timestamp: string;
}

export type NavigationSectionId =
  | 'dashboard'
  | 'programs'
  | 'production'
  | 'quality'
  | 'supply_chain'
  | 'after_sales'
  | 'collaboration'
  | 'analytics';

export interface NavSectionConfig {
  id: NavigationSectionId;
  label: string;
  iconName: string;
  badge?: number | string;
  description: string;
  customerVisibilitySummary: string;
  internalVisibilitySummary: string;
  plannedFeatures: string[];
}

// ==========================================
// PROGRAM & PROJECT TRACKING SPECIFIC TYPES
// ==========================================

export interface GanttTask {
  id: string;
  programId: string;
  programCode: string;
  title: string;
  phase: string;
  owner: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  progressPercent: number;
  status: 'completed' | 'in_progress' | 'delayed' | 'pending';
  dependsOn?: string[]; // IDs of prerequisite tasks
  isDelayed?: boolean;
  delayDays?: number;
  delayReason?: string;
  mitigationPlan?: string;
  criticalPath: boolean;
}

export interface WorkOrderStation {
  id: string;
  name: string;
  sequence: number;
  stageCode: string;
  assignedLine: string;
  assignedShift: string;
  operatorCount: number;
  wipUnits: number;
  wipCapacity: number;
  targetThroughputPerHour: number;
  actualThroughputPerHour: number;
  targetTaktSeconds: number;
  actualCycleSeconds: number;
  status: 'optimal' | 'warning' | 'bottleneck' | 'idle';
  bottleneckReason?: string;
  activeWorkOrderNumber: string;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  programId: string;
  programCode: string;
  programName: string;
  batchSize: number;
  completedUnits: number;
  scrappedUnits: number;
  status: 'in_production' | 'staged' | 'quality_hold' | 'completed';
  assignedFacility: string;
  assignedLine: string;
  currentShift: string;
  leadSupervisor: string;
  overallWipPercent: number;
  startDate: string;
  estimatedCompletionDate: string;
  stations: WorkOrderStation[];
}

export interface RequirementItem {
  id: string;
  reqCode: string;
  category: 'Functional' | 'Electrical' | 'Mechanical' | 'Environmental' | 'Regulatory' | 'Quality';
  description: string;
  targetSpec: string;
  verificationMethod: 'Test' | 'Analysis' | 'Demonstration' | 'Inspection';
  verificationStatus: 'verified' | 'in_progress' | 'failed' | 'untested';
  testCaseRef: string;
}

export interface DesignReviewApproval {
  id: string;
  gatePhase: string;
  reviewTitle: string;
  reviewDate: string;
  reviewerName: string;
  reviewerRole: string;
  status: 'approved' | 'approved_with_conditions' | 'pending' | 'rejected';
  comments: string;
  conditions?: string[];
  signatureTimestamp?: string;
}

export interface PrototypeIteration {
  id: string;
  spinCode: string;
  buildDate: string;
  quantityBuilt: number;
  yieldPercent: number;
  keyIssuesFound: string[];
  designChangesImplemented: string[];
  leadEngineer: string;
  status: 'passed' | 'rework_needed' | 'superseded';
}

export interface QualificationItem {
  id: string;
  testName: string;
  standardRef: string;
  sampleSize: number;
  status: 'passed' | 'failed' | 'in_progress' | 'not_started';
  passCriteria: string;
  measuredResult?: string;
  testedBy: string;
  dateTested?: string;
  evidenceFileId?: string;
}

export interface StageGate {
  gateNumber: number;
  gateCode: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  plannedSignOff: string;
  actualSignOff?: string;
  requirements: RequirementItem[];
  designReviews: DesignReviewApproval[];
  prototypeIterations: PrototypeIteration[];
  qualificationChecklist: QualificationItem[];
}

export interface BOMItem {
  id: string;
  partNumber: string;
  description: string;
  category: 'Active IC' | 'Passive' | 'Electromechanical' | 'PCB' | 'Enclosure' | 'Fastener' | 'Cable';
  quantityPerUnit: number;
  manufacturer: string;
  mpn: string;
  lifecycleStatus: 'Active' | 'NRND (Not Recommended)' | 'EOL (End of Life)' | 'Alternative Qualified';
  leadTimeWeeks: number;
  unitCostUSD: number;
  supplierRisk: 'low' | 'medium' | 'high';
  currentStock: number;
}

export interface EngineeringDrawing {
  id: string;
  docNumber: string;
  title: string;
  docType: '3D STEP Model' | '2D Mechanical Schematic' | 'PCB Gerber / ODB++' | 'Schematic PDF' | 'Wire Harness Spec';
  revision: string;
  fileSize: string;
  lastUpdated: string;
  author: string;
  status: 'Approved / Released' | 'Under Review' | 'Draft';
  downloadUrl: string;
}

export interface EngineeringSpec {
  id: string;
  specCode: string;
  title: string;
  version: string;
  docCategory: 'PRD' | 'DFM Guidelines' | 'Test & Calibration Spec' | 'Packaging & Labeling';
  author: string;
  effectiveDate: string;
  status: 'Active' | 'Superseded' | 'Draft';
  summary: string;
}

export interface ECO {
  id: string;
  ecoNumber: string;
  programId: string;
  programCode: string;
  title: string;
  dateCreated: string;
  effectiveDate: string;
  priority: 'Immediate / Stop Ship' | 'Routine / Next Batch' | 'Phase-In';
  status: 'Approved & Released' | 'Pending Customer Approval' | 'Under Engineering Review' | 'Draft';
  author: string;
  reasonForChange: string;
  whatChangedBefore: string;
  whatChangedAfter: string;
  affectedPartNumbers: string[];
  approvals: {
    roleName: string;
    approverName: string;
    approved: boolean;
    timestamp?: string;
  }[];
  notificationSent: boolean;
  notificationRecipients: string[];
}

export interface EvidenceFile {
  id: string;
  programId: string;
  programCode: string;
  title: string;
  category: 'test_plans' | 'test_results' | 'fai_ppap' | 'photos_videos';
  fileType: 'pdf' | 'csv' | 'png' | 'jpg' | 'mp4' | 'xlsx' | 'step';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  uploadedByRole: string;
  signOffStatus: 'approved' | 'pending' | 'under_review' | 'rejected';
  signedBy?: string;
  signOffDate?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  description: string;
  tags: string[];
}

// ==========================================
// PRODUCTION VISIBILITY SPECIFIC TYPES
// ==========================================

export type FactorySiteId = 'all' | 'austin' | 'fremont' | 'guadalajara' | 'penang';

export interface ProductionFacility {
  id: FactorySiteId;
  name: string;
  city: string;
  country: string;
  activeLinesCount: number;
  totalCapacityUnitsPerMonth: number;
  currentUtilizationPercent: number;
  avgYieldPercent: number;
  activeWorkOrdersCount: number;
  oeePercent: number;
  manager: string;
  certifications: string[];
  status: 'optimal' | 'warning' | 'constrained';
}

export interface ProductionLine {
  id: string;
  name: string;
  siteId: FactorySiteId;
  siteName: string;
  lineType: 'SMT Surface Mount' | 'Through-Hole / Selective' | 'Final Box Build' | 'Cleanroom ISO-7 Assembly';
  currentProgramCode: string;
  currentProgramName: string;
  workOrderNumber: string;
  status: 'running' | 'changeover' | 'maintenance' | 'paused';
  currentShift: string;
  leadSupervisor: string;
  operatorCount: number;
  plannedOutputToday: number;
  actualOutputToday: number;
  wipUnits: number;
  wipCapacity: number;
  firstPassYield: number;
  finalYield: number;
  scrapCount: number;
  oee: {
    overall: number;
    availability: number;
    performance: number;
    quality: number;
  };
  taktTimeSec: number;
  actualCycleSec: number;
  bottleneckStation?: string;
  nextScheduledChangeover?: string;
  hourlyOutput: { hour: string; plan: number; actual: number }[];
}

export interface ShiftPerformance {
  shiftId: string;
  shiftName: string;
  timeRange: string;
  supervisor: string;
  headcount: number;
  plannedUnits: number;
  actualUnits: number;
  yieldPercent: number;
  scrappedUnits: number;
  downtimeMinutes: number;
  changeoverMinutes: number;
  notes: string;
  status: 'exceeded' | 'met' | 'underperformed';
}

export interface InspectionResult {
  id: string;
  inspectionType: '3D-AOI' | '3D-AXI (X-Ray)' | 'Visual Microscope' | 'SPI (Solder Paste)';
  stationName: string;
  lineId: string;
  lineName: string;
  programCode: string;
  totalInspected: number;
  passedCount: number;
  failedCount: number;
  falseCallCount: number;
  defectRatePPM: number;
  avgScanTimeSec: number;
  operator: string;
  status: 'optimal' | 'elevated_alarm' | 'critical';
  recentDefects: {
    code: string;
    description: string;
    componentRef: string;
    severity: 'minor' | 'major' | 'critical';
    timestamp: string;
    resolved: boolean;
  }[];
}

export interface DefectParetoItem {
  id: string;
  defectName: string;
  category: 'Solder' | 'Component' | 'Placement' | 'PCB' | 'Mechanical';
  count: number;
  percentage: number;
  cumulativePercentage: number;
  primaryStation: string;
  rootCause: string;
  correctiveAction: string;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface DefectStationHighlight {
  stationId: string;
  stationName: string;
  lineName: string;
  defectCountToday: number;
  primaryDefectType: string;
  scrapCostUSD: number;
  reworkSuccessRate: number;
  status: 'critical_attention' | 'monitoring' | 'stable';
  assignedEngineer: string;
}

export interface LineCapacity {
  lineId: string;
  lineName: string;
  siteId: FactorySiteId;
  siteName: string;
  maxRatedUPH: number;
  actualAvgUPH: number;
  utilizationPercent: number;
  activeHoursPerWeek: number;
  status: 'optimal' | 'high_load' | 'bottlenecked' | 'idle_capacity';
  bottleneckReason?: string;
}

export interface ScheduledChangeover {
  id: string;
  lineId: string;
  lineName: string;
  siteName: string;
  scheduledTime: string;
  estimatedDurationMin: number;
  fromProgram: string;
  toProgram: string;
  fromProduct: string;
  toProduct: string;
  toolingReady: boolean;
  feedersStaged: boolean;
  stencilVerified: boolean;
  smedTechnician: string;
  status: 'scheduled' | 'in_prep' | 'in_progress' | 'completed';
}

export interface FacilityTransfer {
  id: string;
  transferCode: string;
  programCode: string;
  programName: string;
  fromSite: string;
  toSite: string;
  transferReason: string;
  transferStage: 'Tooling Fabrication' | 'Golden Sample Validation' | 'PPAP Sign-Off' | 'Pilot Run' | 'Volume Handoff';
  progressPercent: number;
  targetCompletionDate: string;
  status: 'on_schedule' | 'at_risk' | 'delayed' | 'completed';
  leadTransferEngineer: string;
  customerApproved: boolean;
  milestones: { name: string; completed: boolean; date?: string }[];
  riskNotes?: string;
}

// ==========================================
// QUALITY MANAGEMENT & COMPLIANCE DATA TYPES
// ==========================================

export type ComplianceStandard =
  | 'ISO 9001:2015'
  | 'IATF 16949:2016'
  | 'ISO 13485:2016'
  | 'AS9100D'
  | 'NADCAP Electronics'
  | 'FDA 21 CFR Part 820'
  | 'ISO 14001:2015'
  | 'ISO 45001:2018'
  | 'IRIS ISO 22163'
  | 'IPC-A-610 Class 3'
  | 'RoHS / REACH CoC';

export type ComplianceCategory =
  | 'Quality Management'
  | 'Automotive'
  | 'Aerospace/Defense'
  | 'Medical Devices'
  | 'Special Process (NADCAP)'
  | 'Railway (IRIS)'
  | 'Regulatory (FDA)'
  | 'Environmental/Safety';

export interface DocumentVersion {
  version: string;
  changeDate?: string;
  changedBy?: string;
  summary?: string;
  releaseDate?: string;
  authorName?: string;
  authorRole?: string;
  changeSummary?: string;
  fileSize: string;
  downloadUrl?: string;
  isBaseline?: boolean;
  baselineApprovedBy?: string;
  baselineDate?: string;
}

export interface ComplianceDocument {
  id: string;
  certNumber: string;
  title: string;
  standard: ComplianceStandard;
  category: ComplianceCategory;
  issuingBody: string;
  facility: string;
  facilitySiteId: FactorySiteId;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'in_renewal' | 'expired';
  owner: string;
  ownerEmail: string;
  scope: string;
  fileSize: string;
  downloadUrl: string;
  auditReadiness: 'Audit Ready' | 'Review Required' | 'Pre-Audit Stage';
  currentVersion: string;
  versionHistory: DocumentVersion[];
}

export interface RenewalTask {
  id: string;
  certId: string;
  certTitle: string;
  standard: ComplianceStandard;
  facility: string;
  expiryDate: string;
  daysRemaining: number;
  alertLevel: 'critical' | 'warning' | 'info' | 'expired';
  assignedLead: string;
  assignedLeadAvatar?: string;
  stage: 'Gap Analysis' | 'Internal Pre-Audit' | 'Registrar Scheduled' | 'Corrective Actions' | 'Recertification Issued';
  progressPercent: number;
  targetAuditDate: string;
  notes: string;
  checklistCount: { completed: number; total: number };
}

export interface AuditBundle {
  id: string;
  name: string;
  standard: string;
  facility: string;
  description: string;
  includedDocsCount: number;
  packageSize: string;
  lastUpdated: string;
  docTypes: string[];
}

export interface FiveWhyItem {
  step: number;
  question: string;
  answer: string;
  verified: boolean;
}

export interface FishboneData {
  man: string[];
  machine: string[];
  method: string[];
  material: string[];
  measurement: string[];
  environment: string[];
}

export interface ContainmentAction {
  id: string;
  action: string;
  owner: string;
  targetDate: string;
  status: 'completed' | 'in_progress' | 'pending';
  verifiedBy?: string;
}

export interface CorrectiveActionItem {
  id: string;
  action: string;
  owner: string;
  targetDate: string;
  status: 'completed' | 'in_progress' | 'planned';
  validationPlan: string;
}

export interface EightDReport {
  d1_team: {
    champion: string;
    leader: string;
    members: string[];
    customerRepresentative?: string;
  };
  d2_problem: {
    description: string;
    whatOccurred: string;
    whereDetected: string;
    whenDetected: string;
    defectQuantity: number;
    lotNumber: string;
    photos: { name: string; url: string; caption: string }[];
  };
  d3_containment: {
    actions: ContainmentAction[];
    quarantineQty: number;
    sortingResults: string;
    customerNotificationSent: boolean;
  };
  d4_rootCause: {
    primaryRootCause: string;
    escapePointRootCause: string;
    fiveWhys: FiveWhyItem[];
    fishbone: FishboneData;
  };
  d5_correctiveActions: CorrectiveActionItem[];
  d6_implementation: {
    implementationDate: string;
    measuredPPM: number;
    pFMEAUpdated: boolean;
    controlPlanUpdated: boolean;
    resultsSummary: string;
  };
  d7_preventiveActions: {
    systemicActions: string[];
    lessonsLearnedLogged: boolean;
    sopUpdated: boolean;
    crossPlantTransferred: boolean;
  };
  d8_closure: {
    signOffDate?: string;
    qaManagerApproval: string;
    customerApproval?: string;
    verificationStatus: 'Verified Effective' | 'Monitoring (30-Day)' | 'Pending Sign-Off';
    effectivenessDays: number;
    finalNotes: string;
  };
}

export interface NCRCAPARecord {
  id: string;
  recordType: 'NCR' | 'CAPA';
  title: string;
  programCode: string;
  programName: string;
  customerName: string;
  facility: string;
  productionLine: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'Containment Active' | 'RCA In Progress' | 'Action Implemented' | 'Verification Pending' | 'Closed';
  createdDate: string;
  targetClosureDate: string;
  closedDate?: string;
  owner: string;
  defectCategory: string;
  affectedQuantity: number;
  scrappedQuantity: number;
  reworkedQuantity: number;
  costImpactUSD: number;
  customerVisible: boolean;
  eightD: EightDReport;
}

export interface SPCMeasurementPoint {
  sampleId: number;
  timestamp: string;
  subgroupValues: number[];
  xBar: number;
  rangeR: number;
  stdDev: number;
  ucl: number;
  lcl: number;
  cl: number;
  usl: number;
  lsl: number;
  nominal: number;
  isViolation: boolean;
  violationRule?: string;
}

export interface ProcessCapabilityItem {
  id: string;
  characteristicName: string;
  stationName: string;
  lineName: string;
  facility: string;
  programCode: string;
  unit: string;
  usl: number;
  lsl: number;
  nominal: number;
  ucl: number;
  lcl: number;
  cl: number;
  cp: number;
  cpk: number;
  pp: number;
  ppk: number;
  mean: number;
  stdDev: number;
  sampleCount: number;
  status: 'capable' | 'marginal' | 'incapable';
  distributionHistogram: { binRange: string; count: number; normalDensity: number }[];
  measurements: SPCMeasurementPoint[];
}

export interface YieldTrendPoint {
  date: string;
  smtFirstPassYield: number;
  ictYield: number;
  fctYield: number;
  finalRolledYield: number;
  targetYield: number;
}

export interface EscapedDefectRecord {
  month: string;
  internalDefectPPM: number;
  customerEscapesPPM: number;
  targetPPM: number;
  customerRMAUnits: number;
  criticalEscapes: number;
  topEscapeCause: string;
}

export interface AuditChecklistItem {
  id: string;
  section: string;
  clause: string;
  question: string;
  evidence: string;
  result: 'Conforming' | 'Minor NC' | 'Major NC' | 'OFI' | 'Pending';
  auditorNotes: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  code: string;
  severity: 'Major NC' | 'Minor NC' | 'OFI';
  clause: string;
  title: string;
  description: string;
  assignedOwner: string;
  targetDueDate: string;
  status: 'Open' | 'CAPA Assigned' | 'Pending Verification' | 'Closed';
  linkedCapaId?: string;
}

export interface QualityAuditSchedule {
  id: string;
  auditTitle: string;
  auditType: 'Registrar ISO/IATF' | 'Customer Audit' | 'Internal System Audit' | 'Layered Process Audit (LPA)' | 'Supplier Audit';
  standard: string;
  facility: string;
  scheduledDate: string;
  durationDays: number;
  leadAuditor: string;
  auditingBody: string;
  status: 'Scheduled' | 'In Progress' | 'Under Review' | 'Completed';
  overallScore?: number;
  totalCheckpoints: number;
  completedCheckpoints: number;
  findingsSummary: { major: number; minor: number; ofi: number };
  scopeSummary: string;
  checklists: AuditChecklistItem[];
  findings: AuditFinding[];
}

export interface CalibrationGageRecord {
  id: string;
  assetTag: string;
  equipmentName: string;
  type: string;
  facility: string;
  locationBay: string;
  lastCalDate: string;
  nextCalDue: string;
  status: 'Calibrated' | 'Due Soon' | 'Overdue' | 'Out of Service';
  grrPercent: number;
  grrRating: 'Acceptable (<10%)' | 'Marginal (10-30%)' | 'Unacceptable (>30%)';
  standardRef: string;
  technician: string;
  certificateRef: string;
}

// ==========================================
// SUPPLY CHAIN & MATERIALS VISIBILITY TYPES
// ==========================================

export type POStatus =
  | 'draft'
  | 'issued'
  | 'acknowledged'
  | 'in_transit'
  | 'partially_received'
  | 'received'
  | 'delayed'
  | 'cancelled';

export interface POLineItem {
  id: string;
  partNumber: string;
  mpn: string;
  description: string;
  category: string;
  qtyOrdered: number;
  qtyReceived: number;
  unitPriceUSD: number;
  lineTotalUSD: number;
  promisedDate: string;
  status: 'pending' | 'in_transit' | 'partially_received' | 'received' | 'backordered';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierTier: 'Tier-1 Strategic' | 'Tier-2 Preferred' | 'Tier-3 Approved' | 'Critical Single-Source';
  programCode: string;
  programName: string;
  orderDate: string;
  promisedDeliveryDate: string;
  actualDeliveryDate?: string;
  revisedETA?: string;
  status: POStatus;
  lineItems: POLineItem[];
  totalAmountUSD: number;
  paymentTerms: string;
  incoterms: string;
  buyerName: string;
  shippingMethod: 'Air Express' | 'Air Standard' | 'Air Freight' | 'Ocean Freight' | 'Ocean Container' | 'Dedicated Ground' | 'Dedicated Road Feeder' | 'Hot-Shot Courier';
  trackingNumber?: string;
  carrier?: string;
  facilityDestination: FactorySiteId;
  facilityName: string;
  leadTimeDays: number;
  notes?: string;
}

export interface SupplierScorecard {
  id: string;
  name: string;
  code: string;
  category: 'Semiconductors' | 'Passives & Discretes' | 'PCBs & Substrates' | 'Electromechanical' | 'Enclosures & Plastics' | 'Optics & Sensors' | 'Cables & Interconnect';
  tier: 'Tier-1 Strategic' | 'Tier-2 Preferred' | 'Tier-3 Approved' | 'Critical Single-Source';
  overallScore: number;
  qualityRating: number; // 0-100 (DPPM & Reject rates)
  deliveryOTD: number; // 0-100 (% On-Time Delivery)
  costCompetitiveness: number; // 0-100
  esgRating: 'A+' | 'A' | 'B' | 'C';
  annualSpendUSD: number;
  country: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  primaryContact: string;
  contactEmail: string;
  avgLeadTimeWeeks: number;
  openPOCount: number;
  historicalLeadTimes: { month: string; leadTimeWeeks: number; industryAvgWeeks: number }[];
  status: 'active' | 'under_review' | 'restricted';
}

export type InventoryStockStatus =
  | 'healthy'
  | 'low_stock'
  | 'critical_shortage'
  | 'overstock'
  | 'stockout';

export type InventoryOwnership =
  | 'Factory-Owned'
  | 'Consignment (Supplier-Owned)'
  | 'Customer-Consigned (VMI)';

export interface InventoryItem {
  id: string;
  partNumber: string;
  mpn: string;
  manufacturer: string;
  description: string;
  category: 'Semiconductor' | 'Passive' | 'Connector' | 'PCB' | 'Electromechanical' | 'Mechanical Hardware' | 'Packaging';
  facility: FactorySiteId;
  facilityName: string;
  warehouseZone: string;
  binLocation: string;
  aisle: string;
  shelf: string;
  onHandQty: number;
  allocatedQty: number;
  availableQty: number;
  onOrderQty: number;
  safetyStockQty: number;
  minStockQty: number;
  maxStockQty: number;
  stockStatus: InventoryStockStatus;
  ownershipType: InventoryOwnership;
  consignmentSupplier?: string;
  unitCostUSD: number;
  totalInventoryValueUSD: number;
  lotNumber: string;
  dateCode: string;
  msdLevel: 'MSL 1' | 'MSL 2' | 'MSL 3 (168 hrs)' | 'MSL 4' | 'MSL 5' | 'N/A';
  rohsCompliant: boolean;
  countryOfOrigin: string;
  expirationDate?: string;
  lastCycleCountDate: string;
  assignedPrograms: string[];
}

export interface CustomsMilestone {
  milestone: string;
  stageCode: string;
  status: 'completed' | 'in_progress' | 'pending' | 'flagged';
  timestamp?: string;
  location: string;
  notes?: string;
}

export interface LogisticsShipment {
  id: string;
  shipmentNumber: string;
  trackingNumber: string;
  masterAWB_BOL: string;
  carrier: string;
  transportMode: 'Air Express' | 'Air Standard' | 'Air Freight' | 'Ocean Container' | 'Ocean Freight' | 'Dedicated Ground' | 'Dedicated Road Feeder' | 'Hot-Shot Courier';
  originFacility: string;
  originCity: string;
  originCountry: string;
  destinationFacility: FactorySiteId;
  destinationCity: string;
  destinationCountry: string;
  poNumbers: string[];
  partsSummary: string;
  totalWeightKg: number;
  totalPallets: number;
  cargoValueUSD: number;
  status: 'Departed Origin' | 'In Transit' | 'Port Arrival / Under Inspection' | 'Customs Hold' | 'Customs Cleared' | 'Out for Final Delivery' | 'Delivered';
  departureDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  delayDays: number;
  progressPercent: number;
  exceptionAlert?: {
    type: 'customs_hold' | 'weather_delay' | 'port_congestion' | 'carrier_rerouting' | 'document_amendment';
    title: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
    reportedAt: string;
    resolutionETA: string;
  };
  customsMilestones: CustomsMilestone[];
}

export interface AlternatePartSuggestion {
  altMpn: string;
  altManufacturer: string;
  equivalenceType: 'Form-Fit-Function (FFF) Drop-in' | 'Pin-Compatible (Firmware Update)' | 'Major Redesign Required';
  qualificationStatus: 'Fully Qualified & Approved' | 'Testing In-Progress (DVT)' | 'Requires Validation' | 'Not Evaluated';
  unitPriceDeltaPercent: number; // e.g. -5% or +12%
  leadTimeWeeks: number;
  stockAvailability: string;
  notes: string;
}

export interface ObsolescenceItem {
  id: string;
  partNumber: string;
  mpn: string;
  manufacturer: string;
  category: string;
  description: string;
  affectedPrograms: string[];
  lifecycleStatus: 'Active' | 'NRND' | 'EOL' | 'Discontinued';
  pcnNumber?: string;
  eolAnnouncementDate?: string;
  lastTimeBuyDeadline?: string;
  lastTimeShipDate?: string;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  currentStockTotal: number;
  projectedDemand12Mo: number;
  bufferShortfallUnits: number;
  estimatedLTBCostUSD: number;
  ltbStatus: 'Open for LTB' | 'Committed' | 'Redesign Approved' | 'No Action Needed';
  alternateParts: AlternatePartSuggestion[];
  redesignECN?: {
    ecnNumber: string;
    title: string;
    targetReleaseDate: string;
    engineeringOwner: string;
    progressPercent: number;
  };
}

export interface CustomerForecastMonth {
  month: string;
  demandUnits: number;
  committedUnits: number;
  actualBuildUnits?: number;
  forecastAccuracyPercent?: number;
  deltaVarianceUnits?: number;
  mapePercent?: number;
}

export interface ForecastScenario {
  id: string;
  customerName: string;
  programCode: string;
  programName: string;
  revision: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'Committed' | 'Under Review' | 'Scenario Simulation';
  totalAnnualVolume: number;
  totalCommittedValueUSD: number;
  forecastMonths: CustomerForecastMonth[];
}

export interface MRPSummaryItem {
  id: string;
  partNumber: string;
  mpn: string;
  description: string;
  category: string;
  grossDemandQty: number;
  onHandAvailableQty: number;
  scheduledReceiptsQty: number;
  netRequirementQty: number;
  plannedOrderReleaseQty: number;
  plannedReleaseWeek: string;
  supplier: string;
  leadTimeWeeks: number;
  isShortage: boolean;
  shortageImpactProgram: string;
}

export interface CapacityCommitment {
  id: string;
  facility: FactorySiteId;
  facilityName: string;
  lineName: string;
  lineType: string;
  monthlyCapacityUnits: number;
  customerCommittedUnits: number;
  utilizationPercent: number;
  status: 'Optimal' | 'Near Capacity' | 'Constrained';
  bottleneckRisk: string;
}

// ==========================================
// AFTER-SALES SERVICE & REPAIR DOMAIN TYPES
// ==========================================

export type RMAReasonCode =
  | 'DOA (Dead on Arrival)'
  | 'Field Operational Failure'
  | 'Intermittent Signal Fault'
  | 'Physical / Connector Damage'
  | 'Firmware / Boot Error'
  | 'Calibration / Sensor Drift'
  | 'Incompatible Hardware Rev'
  | 'Customer Misconfiguration'
  | 'Other Defect';

export type RMATriageStatus =
  | 'Draft'
  | 'Submitted / Pending Review'
  | 'RMA Approved & Label Issued'
  | 'In-Transit to Depot'
  | 'Received at Depot'
  | 'Visual & Quarantine Inspection'
  | 'Bench Testing / Diagnostics'
  | 'In Repair / Rework Bay'
  | 'Final QA Testing'
  | 'Outbound Shipped'
  | 'Closed / Credit Issued';

export interface RMAShippingLabel {
  trackingNumber: string;
  carrier: 'FedEx Priority' | 'DHL Express' | 'UPS Worldwide' | 'Dedicated Freight';
  serviceSpeed: string;
  shipFrom: {
    name: string;
    company: string;
    address: string;
    city: string;
    country: string;
    contactPhone: string;
  };
  shipTo: {
    facilityName: string;
    address: string;
    dockCode: string;
    attention: string;
  };
  barcodeValue: string;
  labelCreatedDate: string;
  packageWeightKg: number;
  customsDeclarationValueUSD: number;
}

export interface RMAWorkflowStep {
  stepName: string;
  timestamp?: string;
  completedBy?: string;
  notes?: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface RMARequest {
  id: string;
  rmaNumber: string;
  customerName: string;
  programCode: string;
  productName: string;
  partNumber: string;
  serialNumber: string;
  lotCode: string;
  requestDate: string;
  reasonCode: RMAReasonCode;
  customerNotes: string;
  failureSymptoms: string;
  operatingHours: number;
  environmentCondition: string;
  warrantyStatus: 'Under Standard Warranty' | 'Under Extended Gold SLA' | 'Out of Warranty (Billable)' | 'Voided (Customer Tamper)';
  triageStatus: RMATriageStatus;
  triageAssignedTo: string;
  depotFacility: FactorySiteId;
  priority: 'Critical (AOG / Line Stop)' | 'High' | 'Standard' | 'Low';
  estimatedRepairDays: number;
  shippingLabel?: RMAShippingLabel;
  workflowSteps: RMAWorkflowStep[];
}

export interface RepairFaultyComponent {
  refDes: string;
  partNumber: string;
  mpn: string;
  defectType: 'Solder Bridging' | 'Blown Silicon Die' | 'Open Trace' | 'Component Degradation' | 'ESD Damage' | 'Mechanical Fracturing';
  severity: 'Critical' | 'Moderate' | 'Minor';
}

export interface RepairActionEntry {
  id: string;
  actionName: string;
  performedBy: string;
  timestamp: string;
  partsReplaced: string[];
  equipmentUsed: string;
  notes: string;
}

export interface RepairFinalTestResults {
  ictTest: 'Passed' | 'Failed' | 'N/A';
  functionalTest: 'Passed' | 'Failed' | 'N/A';
  burnInDurationHours: number;
  burnInResult: 'Passed' | 'Failed' | 'N/A';
  hiPotSafetyTest: 'Passed (3.0kV Isolation)' | 'Failed' | 'N/A';
  calibrationLog: string;
  qaInspectorBadge: string;
  completionDate: string;
  certificateOfConformanceUrl?: string;
}

export interface RepairOutboundShipment {
  carrier: string;
  trackingNumber: string;
  shipmentDate: string;
  estimatedArrival: string;
  recipientAddress: string;
  packingSlipNumber: string;
  status: 'Preparing Dispatch' | 'Picked Up' | 'In Transit' | 'Delivered';
}

export interface RepairRecord {
  id: string;
  rmaId: string;
  rmaNumber: string;
  serialNumber: string;
  productName: string;
  customerName: string;
  technicianName: string;
  repairBay: string;
  stage: 'Depot Intake' | 'Visual & Optical (AOI/X-Ray)' | 'Failure Analysis & Root Cause' | 'Quotation & Customer Approval' | 'Rework & Component Replacement' | 'Firmware & Calibration' | 'Final Functional & Safety Testing' | 'Packaging & Outbound Dispatch';
  progressPercent: number;
  diagnostics: {
    failureCategory: string;
    rootCauseSummary: string;
    faultyComponents: RepairFaultyComponent[];
    opticalXrayNotes: string;
    thermalImagingResult: string;
    logsAnalyzed: string;
  };
  quoteApproval: {
    isBillable: boolean;
    laborHours: number;
    laborRateUSD: number;
    partsCostUSD: number;
    totalQuoteUSD: number;
    approvalStatus: 'Under Warranty (No Charge)' | 'Pending Customer Approval' | 'Approved by Customer' | 'Rejected / Return As-Is' | 'Scrap & Issue Replacement';
    approvedBy?: string;
    approvedAt?: string;
    customerPurchaseOrder?: string;
  };
  repairActionsLog: RepairActionEntry[];
  finalTestResults: RepairFinalTestResults;
  outboundShipment?: RepairOutboundShipment;
}

export interface WarrantyLookupRecord {
  serialNumber: string;
  productName: string;
  partNumber: string;
  manufacturingDate: string;
  shipDate: string;
  facilityBorn: string;
  customerName: string;
  warrantyTier: 'Standard OEM (12 Months)' | 'Extended Enterprise (36 Months)' | 'Mission-Critical Gold (60 Months)';
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyStatus: 'Active' | 'Expiring Soon (< 30 Days)' | 'Expired' | 'Void (Unauthorized Modification)';
  claimHistoryCount: number;
  contractId: string;
  serviceAgreementLevel: string;
}

export interface WarrantyClaim {
  id: string;
  claimNumber: string;
  serialNumber: string;
  productName: string;
  customerName: string;
  claimType: 'Full Replacement Unit' | 'Warranty Depot Repair' | 'Advance Hardware Replacement' | 'Credit Memo / Refund';
  status: 'Claim Submitted' | 'Under Technical Evaluation' | 'Approved - RMA Issued' | 'Rejected' | 'Settled & Closed';
  claimAmountUSD: number;
  submittedDate: string;
  reviewerName: string;
  justification: string;
  approvalHistory: Array<{
    role: string;
    approver: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    date?: string;
    comment?: string;
  }>;
}

export interface FailureTrendDataPoint {
  category: string;
  count: number;
  percentage: number;
  avgLaborHours: number;
  topComp: string;
}

export interface SparePartEquivalent {
  partNumber: string;
  mpn: string;
  manufacturer: string;
  compatibilityLevel: '100% Drop-In' | 'Requires Adapter Bracket' | 'Firmware Dependent';
  priceUSD: number;
  stockQty: number;
}

export interface SparePart {
  id: string;
  partNumber: string;
  mpn: string;
  name: string;
  category: 'PCB Assemblies (FRU)' | 'Sub-modules & Sensors' | 'Cables & Harnesses' | 'Enclosure & Mechanical' | 'Power Supplies & Inverters' | 'Consumables & Gaskets';
  compatiblePrograms: string[];
  unitPriceUSD: number;
  onHandQty: number;
  allocatedQty: number;
  availableQty: number;
  leadTimeDays: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Backordered' | 'Obsolete / LTB';
  warehouseLocation: string;
  minOrderQty: number;
  description: string;
  replacesPartNumber?: string;
  alternateEquivalents: SparePartEquivalent[];
}

export interface SparePartOrderItem {
  partNumber: string;
  name: string;
  quantity: number;
  unitPriceUSD: number;
  lineTotalUSD: number;
}

export interface SparePartOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  poReference: string;
  orderDate: string;
  items: SparePartOrderItem[];
  totalAmountUSD: number;
  shippingSpeed: 'Priority Courier (Next Day)' | 'Standard Air (3-5 Days)' | 'Economy Ground';
  destinationAddress: string;
  status: 'Processing Order' | 'Picking & Packing' | 'Shipped & In-Transit' | 'Delivered';
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface EOLNotice {
  id: string;
  noticeNumber: string;
  productFamily: string;
  affectedAssemblies: string[];
  affectedCustomers: string[];
  announcementDate: string;
  lastTimeBuyDate: string;
  lastTimeShipDate: string;
  endOfServiceDate: string;
  reason: string;
  migrationPath: string;
  replacementProduct: string;
  status: 'Active Notice' | 'LTB Window Open' | 'LTB Closed / Production Phasing' | 'End of Support';
}

export interface LTBProgram {
  id: string;
  noticeId: string;
  productName: string;
  partNumber: string;
  customerName: string;
  targetBufferYears: number;
  forecastedSupportUnits: number;
  committedLTBUnits: number;
  unitCostUSD: number;
  totalCommitmentUSD: number;
  productionBatchDate: string;
  status: 'Demand Forecast Pending' | 'Contract Signed' | 'In Production' | 'Transferred to Long-Term Storage';
}

export interface LongTermStorageItem {
  id: string;
  lotNumber: string;
  partNumber: string;
  description: string;
  facility: FactorySiteId;
  vaultLocation: string;
  storedUnits: number;
  storageStartDate: string;
  storageCommitmentYears: number;
  storageEnvironment: string;
  moistureBarrierSealDate: string;
  nextDesiccantInspection: string;
  annualStorageFeeUSD: number;
  ownershipModel: 'Customer Dedicated Consignment' | 'EMS Guaranteed Buffer';
}

export interface RedesignMigrationProject {
  id: string;
  legacyProduct: string;
  nextGenProduct: string;
  customerName: string;
  compatibilityRating: '100% Form-Fit-Function Drop-In' | 'Form-Fit Equivalent (Minor FW delta)' | 'Requires Mechanical Bracket Mod';
  ecnNumber: string;
  engineeringLead: string;
  targetSampleDate: string;
  qualificationStatus: 'Proto Testing' | 'DVT Validation' | 'Customer Field Trial' | 'Approved for Ramp';
  progressPercent: number;
  keyEnhancements: string[];
}

// ==========================================
// COLLABORATION, DOCUMENTS & KNOWLEDGE TYPES
// ==========================================

export interface ThreadAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  downloadUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ThreadReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ThreadComment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar?: string;
  content: string;
  mentions: string[];
  attachments: ThreadAttachment[];
  reactions: ThreadReaction[];
  createdAt: string;
}

export interface ProjectThread {
  id: string;
  programId: string;
  programCode: string;
  programName: string;
  title: string;
  category: 'DFM & Design' | 'Quality & CAPA' | 'Supply Chain' | 'Assembly & NPI' | 'General';
  status: 'open' | 'in_review' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  participants: { id: string; name: string; role: string; avatar?: string }[];
  commentsCount: number;
  unread: boolean;
  tags: string[];
  comments: ThreadComment[];
}

export interface DocumentApprovalStep {
  id: string;
  roleTitle: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'conditional';
  signedAt?: string;
  notes?: string;
}

export interface AnnotationReply {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface DocumentAnnotation {
  id: string;
  documentId: string;
  version: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  xPercent: number;
  yPercent: number;
  pageNumber: number;
  type: 'pin' | 'box' | 'highlight' | 'redline';
  widthPercent?: number;
  heightPercent?: number;
  comment: string;
  createdAt: string;
  status: 'open' | 'resolved';
  replies: AnnotationReply[];
}

export interface CollaborationDocument {
  id: string;
  documentNumber: string;
  title: string;
  programId: string;
  programCode: string;
  programName: string;
  category: 'CAD & Mechanical' | 'PCB & Gerber EDA' | 'BOM & Schematics' | 'Work Instructions' | 'Quality & Test Plans' | 'Regulatory & Certs';
  fileType: 'STEP' | 'GERBER' | 'BOM_CSV' | 'PDF' | 'DWG' | 'SCHEMATIC';
  currentVersion: string;
  isBaselineLocked: boolean;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Baseline Released' | 'Obsolete';
  ownerName: string;
  ownerRole: string;
  lastModified: string;
  description: string;
  versions: DocumentVersion[];
  approvals: DocumentApprovalStep[];
  annotations: DocumentAnnotation[];
  securityClassification: 'Customer Confidential' | 'Proprietary IP' | 'Plant Restricted';
}

export interface CadPartNode {
  id: string;
  name: string;
  category: 'Enclosure' | 'PCB' | 'Heatsink' | 'Connector' | 'IC' | 'Hardware';
  material: string;
  weightGrams: number;
  color: string;
  isVisible: boolean;
  opacity: number;
  positionOffset: [number, number, number];
}

export interface Cad3DModel {
  id: string;
  name: string;
  programCode: string;
  revision: string;
  format: string;
  polyCount: number;
  dimensions: string;
  description: string;
  parts: CadPartNode[];
}

export interface GerberLayer {
  id: string;
  name: string;
  layerCode: string;
  type: 'top_copper' | 'bottom_copper' | 'solder_mask' | 'silkscreen' | 'drill_holes' | 'solder_paste';
  color: string;
  isVisible: boolean;
  opacity: number;
  dcodeCount: number;
}

export interface GerberProject {
  id: string;
  programCode: string;
  boardName: string;
  layerCount: number;
  thicknessMm: number;
  minTraceClearanceMil: number;
  activeNets: string[];
  layers: GerberLayer[];
  drcWarningsCount: number;
}

export type BomAvailabilitySignal =
  | 'In Stock'
  | 'Low Stock'
  | 'Lead Time Alert'
  | 'Allocation Risk'
  | 'EOL / Obsolete'
  | 'Alternate Qualified';

export interface BomComponent {
  id: string;
  refDes: string;
  mpn: string;
  manufacturer: string;
  description: string;
  packageFootprint: string;
  quantityPerBoard: number;
  unitCostUSD: number;
  availabilitySignal: BomAvailabilitySignal;
  leadTimeWeeks: number;
  globalStockQty: number;
  secondSourceAvailable: boolean;
  secondSourceMpn?: string;
  singleSourceRisk: 'None' | 'Moderate' | 'Critical High';
  rohsCompliant: boolean;
  automotiveGrade: boolean;
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Manufacturing Processes' | 'EMS Capabilities' | 'Test Procedures' | 'Training & Certifications' | 'Quality Standards';
  authorName: string;
  authorRole: string;
  lastUpdated: string;
  version: string;
  readTimeMinutes: number;
  tags: string[];
  summary: string;
  contentMarkdown: string;
  isFeatured: boolean;
  viewsCount: number;
  helpfulVotes: number;
}

export interface FaqItem {
  id: string;
  category: 'DFM & Engineering' | 'Production & SMT' | 'Quality & PPAP' | 'RMA & Reverse Logistics' | 'Security & Portal Access';
  question: string;
  answer: string;
  relatedArticleId?: string;
  lastVerified: string;
}

export interface ContactSla {
  id: string;
  teamName: string;
  department: string;
  primaryContact: string;
  email: string;
  phone: string;
  location: string;
  timeZone: string;
  availabilityStatus: 'Available' | 'In DFM Review' | 'On Shift' | 'Away';
  responseSlaHours: number;
  urgentEscalationSlaHours: number;
  coverageWindow: string;
  responsibilities: string[];
  activeTicketsCount: number;
}

// ==========================================
// ANALYTICS & REPORTING TYPES
// ==========================================

export interface PortfolioHealthSummary {
  totalPrograms: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  onTimeDeliveryRate: number; // e.g. 96.8%
  firstPassYieldAvg: number; // e.g. 98.2%
  overallCapacityUtilization: number; // e.g. 84.5%
  serviceCsatScore: number; // e.g. 4.9 / 5.0
  averageRmaTatDays: number; // e.g. 4.2 days
}

export interface MonthlyDeliveryTrend {
  month: string;
  onTimeRate: number;
  targetRate: number;
  shippedUnits: number;
  delayedLotsCount: number;
}

export interface MonthlyQualityTrend {
  month: string;
  firstPassYield: number;
  dpmo: number;
  scrapRate: number;
  reworkHours: number;
}

export interface FacilityCapacityMetric {
  facilityName: string;
  siteCode: string;
  smtUtilization: number;
  boxBuildUtilization: number;
  testInspectionUtilization: number;
  cleanroomUtilization: number;
  headcountShiftEfficiency: number;
  bottleneckStation: string;
}

export interface ServiceKpiMetric {
  category: string;
  metricName: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  changeVsLastMonth: string;
}

export type CustomerWidgetType =
  | 'project_status'
  | 'quality_summary'
  | 'shipments'
  | 'documents'
  | 'smt_progress'
  | 'rma_status'
  | 'cost_burn_rate';

export interface CustomerDashboardWidget {
  id: string;
  type: CustomerWidgetType;
  title: string;
  description: string;
  width: 'half' | 'full';
  isVisible: boolean;
  order: number;
  iconName: string;
}

export type RiskCategory = 'delivery' | 'quality' | 'supply';

export interface PredictiveRiskFlag {
  id: string;
  category: RiskCategory;
  title: string;
  programId: string;
  programCode: string;
  programName: string;
  customerName: string;
  severity: 'critical' | 'high' | 'medium';
  confidenceScore: number; // percentage 0-100
  trendLogicTrigger: string; // e.g. "3 schedule slips in last 30 days + SMT line 2 thermal variance"
  leadTimeImpactDays: number;
  financialExposureUsd: number;
  rootCauseAnalysis: string;
  trendData: { period: string; measuredValue: number; thresholdLimit: number }[];
  suggestedMitigation: string;
  mitigationStatus: 'active' | 'in_progress' | 'mitigated';
  mitigatedByName?: string;
  mitigatedDate?: string;
  createdAt: string;
}

export interface ReportFilterState {
  dateRange: '7d' | '30d' | '90d' | 'ytd' | 'custom';
  startDate?: string;
  endDate?: string;
  selectedPrograms: string[];
  selectedFacilities: string[];
  metricCategories: string[];
  aggregationLevel: 'daily' | 'weekly' | 'monthly';
}

export interface SavedReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Executive' | 'Customer QBR' | 'Quality Deep-Dive' | 'Supply Chain & BOM' | 'Plant Operations';
  authorName: string;
  createdAt: string;
  lastGenerated: string;
  filterState: ReportFilterState;
  chartType: 'bar' | 'line' | 'area' | 'composite';
  isFavorite: boolean;
}

export interface ReportRowData {
  id: string;
  programCode: string;
  customer: string;
  facility: string;
  period: string;
  unitsPlanned: number;
  unitsBuilt: number;
  yieldPercent: number;
  dpmo: number;
  otdPercent: number;
  scrapCostUsd: number;
  rmaCount: number;
  status: 'Compliant' | 'At Risk' | 'Non-Conforming';
}




