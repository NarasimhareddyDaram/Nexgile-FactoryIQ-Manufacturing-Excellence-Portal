import {
  ComplianceDocument,
  RenewalTask,
  AuditBundle,
  NCRCAPARecord,
  ProcessCapabilityItem,
  YieldTrendPoint,
  EscapedDefectRecord,
  QualityAuditSchedule,
  AuditFinding,
  CalibrationGageRecord
} from '../types';

export const mockComplianceDocuments: ComplianceDocument[] = [
  {
    id: 'doc-iatf-001',
    certNumber: 'IATF-0498112-2024',
    title: 'IATF 16949:2016 Automotive Quality Management System',
    standard: 'IATF 16949:2016',
    category: 'Automotive',
    issuingBody: 'TÜV SÜD Management Service GmbH',
    facility: 'Austin Giga-1 (Texas, USA)',
    facilitySiteId: 'austin',
    issueDate: '2024-03-15',
    expiryDate: '2027-03-14',
    status: 'valid',
    owner: 'Dr. Anita Joshi',
    ownerEmail: 'a.joshi@nexgile.com',
    scope: 'Design, SMT assembly, box-build, and test of automotive powertrain BMS and high-voltage inverter electronic modules.',
    fileSize: '4.8 MB',
    downloadUrl: '/certs/IATF_16949_Austin_Giga1_Cert.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 4.1',
    versionHistory: [
      {
        version: 'Rev 4.1',
        changeDate: '2024-03-15',
        changedBy: 'Dr. Anita Joshi',
        summary: 'Triennial recertification audit pass without major non-conformances.',
        fileSize: '4.8 MB',
        downloadUrl: '/certs/archive/IATF_16949_2024_v4.1.pdf'
      },
      {
        version: 'Rev 3.0',
        changeDate: '2021-03-10',
        changedBy: 'Marcus Vance',
        summary: 'Scope expansion to include High-Voltage Battery Isolation lines.',
        fileSize: '4.2 MB',
        downloadUrl: '/certs/archive/IATF_16949_2021_v3.0.pdf'
      }
    ]
  },
  {
    id: 'doc-iso13485-002',
    certNumber: 'MD-772901-BSI',
    title: 'ISO 13485:2016 Medical Devices Quality Management',
    standard: 'ISO 13485:2016',
    category: 'Medical Devices',
    issuingBody: 'BSI Group Assurance Ltd',
    facility: 'Fremont Mega-2 (California, USA)',
    facilitySiteId: 'fremont',
    issueDate: '2023-10-01',
    expiryDate: '2026-09-30',
    status: 'expiring_soon',
    owner: 'Sarah Lin, CQE',
    ownerEmail: 's.lin@nexgile.com',
    scope: 'Contract manufacturing of active implantable neural telemetry, patient biometric monitors, and Class II/III sub-assemblies in ISO-7 cleanroom.',
    fileSize: '3.6 MB',
    downloadUrl: '/certs/ISO_13485_Fremont_Cleanroom.pdf',
    auditReadiness: 'Review Required',
    currentVersion: 'Rev 3.2',
    versionHistory: [
      {
        version: 'Rev 3.2',
        changeDate: '2023-10-01',
        changedBy: 'Sarah Lin, CQE',
        summary: 'Surveillance audit certificate renewal; validated ISO 14644-1 particle counts.',
        fileSize: '3.6 MB',
        downloadUrl: '/certs/archive/ISO_13485_2023_v3.2.pdf'
      }
    ]
  },
  {
    id: 'doc-as9100-003',
    certNumber: 'AS-9100D-DNV-88401',
    title: 'AS9100D / EN 9100 Aerospace & Defense Quality Systems',
    standard: 'AS9100D',
    category: 'Aerospace/Defense',
    issuingBody: 'DNV GL Business Assurance',
    facility: 'Austin Giga-1 (Texas, USA)',
    facilitySiteId: 'austin',
    issueDate: '2025-01-20',
    expiryDate: '2028-01-19',
    status: 'valid',
    owner: 'Col. Robert Harris (Ret.)',
    ownerEmail: 'r.harris@nexgile.com',
    scope: 'Manufacture of avionics mission computers, satellite phased-array RF modules, and ruggedized flight telemetry electronics.',
    fileSize: '5.2 MB',
    downloadUrl: '/certs/AS9100D_Austin_Avionics.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 5.0',
    versionHistory: [
      {
        version: 'Rev 5.0',
        changeDate: '2025-01-20',
        changedBy: 'Col. Robert Harris',
        summary: 'Recertification with upgraded FOD prevention protocols & counterfeit component risk mitigation (SAE AS6174).',
        fileSize: '5.2 MB',
        downloadUrl: '/certs/archive/AS9100D_2025_v5.0.pdf'
      }
    ]
  },
  {
    id: 'doc-nadcap-004',
    certNumber: 'PRI-NADCAP-ET-4402',
    title: 'NADCAP Electronics - Printed Board Assemblies (AC7119)',
    standard: 'NADCAP Electronics',
    category: 'Special Process (NADCAP)',
    issuingBody: 'Performance Review Institute (PRI)',
    facility: 'Penang Plant-4 (Bayan Lepas, Malaysia)',
    facilitySiteId: 'penang',
    issueDate: '2025-06-12',
    expiryDate: '2026-10-31',
    status: 'valid',
    owner: 'Chai Hock Boon',
    ownerEmail: 'hb.chai@nexgile.com',
    scope: 'Surface Mount Technology, Through-Hole Soldering, Conformal Coating, and Selective Underfill for critical aerospace & space applications.',
    fileSize: '3.9 MB',
    downloadUrl: '/certs/NADCAP_AC7119_Penang.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 2.1',
    versionHistory: [
      {
        version: 'Rev 2.1',
        changeDate: '2025-06-12',
        changedBy: 'Chai Hock Boon',
        summary: 'Audit checklist AC7119 Rev E compliance verification; added robotic conformal coating.',
        fileSize: '3.9 MB',
        downloadUrl: '/certs/archive/NADCAP_2025_v2.1.pdf'
      }
    ]
  },
  {
    id: 'doc-fda-005',
    certNumber: 'FDA-FEI-3008914022',
    title: 'FDA 21 CFR Part 820 / QSR Medical Device Establishment Registration',
    standard: 'FDA 21 CFR Part 820',
    category: 'Regulatory (FDA)',
    issuingBody: 'US Food and Drug Administration (CDRH)',
    facility: 'Fremont Mega-2 (California, USA)',
    facilitySiteId: 'fremont',
    issueDate: '2025-11-01',
    expiryDate: '2026-12-31',
    status: 'valid',
    owner: 'Sarah Lin, CQE',
    ownerEmail: 's.lin@nexgile.com',
    scope: 'Device Master Record (DMR) execution, Design History File (DHF) maintenance, and Medical Device Reporting (MDR) compliance.',
    fileSize: '2.4 MB',
    downloadUrl: '/certs/FDA_Establishment_Registration_2026.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: '2026 Annual Filing',
    versionHistory: [
      {
        version: '2026 Annual',
        changeDate: '2025-11-01',
        changedBy: 'Sarah Lin, CQE',
        summary: 'Annual FDA establishment renewal and electronic Device Listing submission.',
        fileSize: '2.4 MB',
        downloadUrl: '/certs/archive/FDA_2026_Annual.pdf'
      }
    ]
  },
  {
    id: 'doc-iso9001-006',
    certNumber: 'ISO9001-LRQA-0019283',
    title: 'ISO 9001:2015 Quality Management Systems (Enterprise Global)',
    standard: 'ISO 9001:2015',
    category: 'Quality Management',
    issuingBody: 'LRQA Lloyd’s Register',
    facility: 'Guadalajara Tech-3 (Jalisco, Mexico)',
    facilitySiteId: 'guadalajara',
    issueDate: '2023-08-10',
    expiryDate: '2026-09-15',
    status: 'expiring_soon',
    owner: 'Ing. Mateo Alvarez',
    ownerEmail: 'm.alvarez@nexgile.com',
    scope: 'High-speed electronics manufacturing, automated optical inspection, functional testing, and global supply chain fulfillment.',
    fileSize: '4.1 MB',
    downloadUrl: '/certs/ISO9001_Global_MultiSite_LRQA.pdf',
    auditReadiness: 'Review Required',
    currentVersion: 'Rev 6.0',
    versionHistory: [
      {
        version: 'Rev 6.0',
        changeDate: '2023-08-10',
        changedBy: 'Ing. Mateo Alvarez',
        summary: 'Multi-site global ISO 9001 certification renewal across USA, Mexico, and Malaysia.',
        fileSize: '4.1 MB',
        downloadUrl: '/certs/archive/ISO9001_2023_v6.0.pdf'
      }
    ]
  },
  {
    id: 'doc-iris-007',
    certNumber: 'IRIS-UNIFE-2024-911',
    title: 'IRIS (ISO 22163:2023) Railway Applications Quality Management',
    standard: 'IRIS ISO 22163',
    category: 'Railway (IRIS)',
    issuingBody: 'DEKRA Certification B.V.',
    facility: 'Guadalajara Tech-3 (Jalisco, Mexico)',
    facilitySiteId: 'guadalajara',
    issueDate: '2024-05-20',
    expiryDate: '2027-05-19',
    status: 'valid',
    owner: 'Ing. Mateo Alvarez',
    ownerEmail: 'm.alvarez@nexgile.com',
    scope: 'Production of traction drive control computers, signaling telemetry units, and SIL-4 train safety control boards.',
    fileSize: '3.7 MB',
    downloadUrl: '/certs/IRIS_ISO22163_Railway_Cert.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 2.0',
    versionHistory: [
      {
        version: 'Rev 2.0',
        changeDate: '2024-05-20',
        changedBy: 'Ing. Mateo Alvarez',
        summary: 'Transitioned successfully from IRIS Rev 03 to ISO 22163:2023 Bronze Performance Level.',
        fileSize: '3.7 MB',
        downloadUrl: '/certs/archive/IRIS_2024_v2.0.pdf'
      }
    ]
  },
  {
    id: 'doc-ipc-008',
    certNumber: 'IPC-QML-A610-3391',
    title: 'IPC-A-610 Class 3 / IPC J-STD-001 Space Addendum Certification',
    standard: 'IPC-A-610 Class 3',
    category: 'Special Process (NADCAP)',
    issuingBody: 'IPC Validation Services (QML)',
    facility: 'Austin Giga-1 (Texas, USA)',
    facilitySiteId: 'austin',
    issueDate: '2025-04-01',
    expiryDate: '2027-03-31',
    status: 'valid',
    owner: 'Dr. Anita Joshi',
    ownerEmail: 'a.joshi@nexgile.com',
    scope: 'Certified Qualified Manufacturers List (QML) for High-Reliability and Harsh Environment Electronic Assemblies.',
    fileSize: '2.9 MB',
    downloadUrl: '/certs/IPC_QML_Class3_Austin.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 4.0',
    versionHistory: [
      {
        version: 'Rev 4.0',
        changeDate: '2025-04-01',
        changedBy: 'Dr. Anita Joshi',
        summary: 'Added IPC-7711/7721 Rework and Modification Master Instructor endorsement.',
        fileSize: '2.9 MB',
        downloadUrl: '/certs/archive/IPC_QML_2025.pdf'
      }
    ]
  },
  {
    id: 'doc-rohs-009',
    certNumber: 'COC-ROHS3-REACH-2026-Q3',
    title: 'RoHS 3 (EU 2015/863) & REACH (EC 1907/2006 SVHC-240) Master CoC',
    standard: 'RoHS / REACH CoC',
    category: 'Environmental/Safety',
    issuingBody: 'Nexgile Corporate Compliance Laboratory',
    facility: 'Enterprise Global (All Sites)',
    facilitySiteId: 'all',
    issueDate: '2026-07-01',
    expiryDate: '2027-06-30',
    status: 'valid',
    owner: 'Priya Patel',
    ownerEmail: 'p.patel@nexgile.com',
    scope: 'Enterprise Certificate of Compliance validating lead-free (<0.1% Pb), halogen-free, and REACH candidate list SVHC substance declarations.',
    fileSize: '6.5 MB',
    downloadUrl: '/certs/Master_RoHS3_REACH_SVHC240_CoC.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 2026.3',
    versionHistory: [
      {
        version: 'Rev 2026.3',
        changeDate: '2026-07-01',
        changedBy: 'Priya Patel',
        summary: 'Updated to include 5 new SVHC chemicals published in ECHA July 2026 candidate list.',
        fileSize: '6.5 MB',
        downloadUrl: '/certs/archive/RoHS_REACH_2026_Q3.pdf'
      }
    ]
  },
  {
    id: 'doc-iso14001-010',
    certNumber: 'EMS-ISO14001-99201',
    title: 'ISO 14001:2015 Environmental & ISO 45001 Health & Safety',
    standard: 'ISO 14001:2015',
    category: 'Environmental/Safety',
    issuingBody: 'DNV GL Business Assurance',
    facility: 'Penang Plant-4 (Bayan Lepas, Malaysia)',
    facilitySiteId: 'penang',
    issueDate: '2024-09-12',
    expiryDate: '2027-09-11',
    status: 'valid',
    owner: 'Chai Hock Boon',
    ownerEmail: 'hb.chai@nexgile.com',
    scope: 'Hazardous chemical handling, flux extraction scrubbers, zero-landfill e-waste recycling, and clean-air emissions compliance.',
    fileSize: '3.1 MB',
    downloadUrl: '/certs/ISO14001_45001_Penang.pdf',
    auditReadiness: 'Audit Ready',
    currentVersion: 'Rev 3.0',
    versionHistory: [
      {
        version: 'Rev 3.0',
        changeDate: '2024-09-12',
        changedBy: 'Chai Hock Boon',
        summary: 'Recertification with zero reportable environmental incidents across 36 consecutive months.',
        fileSize: '3.1 MB',
        downloadUrl: '/certs/archive/ISO14001_2024.pdf'
      }
    ]
  }
];

export const mockRenewalTasks: RenewalTask[] = [
  {
    id: 'task-ren-001',
    certId: 'doc-iso9001-006',
    certTitle: 'ISO 9001:2015 Quality Management Systems (Enterprise Global)',
    standard: 'ISO 9001:2015',
    facility: 'Guadalajara Tech-3 (Jalisco, Mexico)',
    expiryDate: '2026-09-15',
    daysRemaining: 19,
    alertLevel: 'critical',
    assignedLead: 'Ing. Mateo Alvarez',
    assignedLeadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    stage: 'Internal Pre-Audit',
    progressPercent: 78,
    targetAuditDate: '2026-09-08',
    notes: 'Pre-audit gap closure completed for warehouse ESD audits. Registrar auditor (LRQA) opening meeting scheduled for Sept 8.',
    checklistCount: { completed: 18, total: 22 }
  },
  {
    id: 'task-ren-002',
    certId: 'doc-iso13485-002',
    certTitle: 'ISO 13485:2016 Medical Devices Quality Management',
    standard: 'ISO 13485:2016',
    facility: 'Fremont Mega-2 (California, USA)',
    expiryDate: '2026-09-30',
    daysRemaining: 34,
    alertLevel: 'warning',
    assignedLead: 'Sarah Lin, CQE',
    assignedLeadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    stage: 'Registrar Scheduled',
    progressPercent: 65,
    targetAuditDate: '2026-09-22',
    notes: 'BSI lead auditor confirmed Stage 2 surveillance. Cleanroom ISO 14644 certification valid through Q4 2026.',
    checklistCount: { completed: 22, total: 30 }
  },
  {
    id: 'task-ren-003',
    certId: 'doc-nadcap-004',
    certTitle: 'NADCAP Electronics - Printed Board Assemblies (AC7119)',
    standard: 'NADCAP Electronics',
    facility: 'Penang Plant-4 (Bayan Lepas, Malaysia)',
    expiryDate: '2026-10-31',
    daysRemaining: 65,
    alertLevel: 'warning',
    assignedLead: 'Chai Hock Boon',
    assignedLeadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    stage: 'Gap Analysis',
    progressPercent: 42,
    targetAuditDate: '2026-10-14',
    notes: 'Reviewing cross-section metallurgical micro-section sample prep reports for automated conformal coat thickness.',
    checklistCount: { completed: 14, total: 28 }
  },
  {
    id: 'task-ren-004',
    certId: 'doc-fda-005',
    certTitle: 'FDA 21 CFR Part 820 Annual Establishment Renewal',
    standard: 'FDA 21 CFR Part 820',
    facility: 'Fremont Mega-2 (California, USA)',
    expiryDate: '2026-12-31',
    daysRemaining: 126,
    alertLevel: 'info',
    assignedLead: 'Sarah Lin, CQE',
    assignedLeadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    stage: 'Gap Analysis',
    progressPercent: 20,
    targetAuditDate: '2026-11-15',
    notes: 'FDA ESG portal submission packet being drafted for 2027 fiscal year registration fee and device listing update.',
    checklistCount: { completed: 4, total: 15 }
  },
  {
    id: 'task-ren-005',
    certId: 'doc-iatf-001',
    certTitle: 'IATF 16949:2016 Annual Surveillance Audit',
    standard: 'IATF 16949:2016',
    facility: 'Austin Giga-1 (Texas, USA)',
    expiryDate: '2027-03-14',
    daysRemaining: 199,
    alertLevel: 'info',
    assignedLead: 'Dr. Anita Joshi',
    assignedLeadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    stage: 'Recertification Issued',
    progressPercent: 95,
    targetAuditDate: '2027-02-20',
    notes: 'Surveillance 1 passed. Year 2 milestone metrics tracking cleanly on Cp/Cpk automotive targets.',
    checklistCount: { completed: 32, total: 32 }
  }
];

export const mockAuditBundles: AuditBundle[] = [
  {
    id: 'bundle-001',
    name: 'Automotive IATF 16949 Audit Compliance Package',
    standard: 'IATF 16949:2016 + Customer CSRs',
    facility: 'Austin Giga-1 (Texas, USA)',
    description: 'Complete audit-ready bundle including Quality Manual, pFMEA, Control Plans, MSA Gage R&R, Calibration records, and 12-month SPC capability studies.',
    includedDocsCount: 14,
    packageSize: '42.6 MB',
    lastUpdated: '2026-08-20',
    docTypes: ['IATF Cert', 'Process Control Plans', 'pFMEA Rev 5', 'MSA Gage R&R Log', 'Layered Audit Logs', 'Supplier PPAP Level 3']
  },
  {
    id: 'bundle-002',
    name: 'Medical Device ISO 13485 & FDA Part 820 Audit Dossier',
    standard: 'ISO 13485:2016 / 21 CFR Part 820',
    facility: 'Fremont Mega-2 (California, USA)',
    description: 'Cleanroom ISO-7 validation logs, Device Master Record (DMR) indexes, Bioburden test certificates, sterilization validation, and CAPA effectiveness reports.',
    includedDocsCount: 18,
    packageSize: '58.2 MB',
    lastUpdated: '2026-08-15',
    docTypes: ['ISO 13485 Cert', 'Cleanroom Particle Count Logs', 'DMR Matrix', 'CAPA Closure Sign-offs', 'Operator Training Records']
  },
  {
    id: 'bundle-003',
    name: 'Aerospace AS9100D & NADCAP Special Process Package',
    standard: 'AS9100 Rev D + NADCAP AC7119',
    facility: 'Austin & Penang Facilities',
    description: 'Counterfeit avoidance plan (AS6174), FOD prevention audit records, thermal profile certifications, X-Ray voiding micro-sections, and FAIs (AS9102 Rev C).',
    includedDocsCount: 16,
    packageSize: '51.0 MB',
    lastUpdated: '2026-08-18',
    docTypes: ['AS9100D Cert', 'NADCAP Accreditation', 'AS9102 FAI Forms 1-3', 'X-Ray Microsections', 'FOD Audit Sheets']
  },
  {
    id: 'bundle-004',
    name: 'Environmental & Hazardous Substances Compliance Bundle',
    standard: 'RoHS 3 / REACH SVHC-240 / Conflict Minerals',
    facility: 'Enterprise Global (All Sites)',
    description: 'Full material disclosures (FMD), IPC-1752A declarations, lab ICP-OES test reports, and CMRT (Conflict Minerals Reporting Template Rev 6.3).',
    includedDocsCount: 9,
    packageSize: '24.4 MB',
    lastUpdated: '2026-07-28',
    docTypes: ['Master RoHS3 CoC', 'REACH 240 SVHC Declaration', 'CMRT Rev 6.3 Form', 'SGS Lab ICP Test Reports']
  }
];

export const mockNCRCAPARecords: NCRCAPARecord[] = [
  {
    id: 'CAPA-2026-029',
    recordType: 'CAPA',
    title: 'Solder Bridging & Solder Balling on 0.4mm Pitch BGA Power Inverter IC',
    programCode: 'NX-VM-BMS-G3',
    programName: 'NextGen EV Battery Management System (BMS Gen-3)',
    customerName: 'VoltMobility EV',
    facility: 'Austin Giga-1 (Texas, USA)',
    productionLine: 'SMT Line 1 - High-Speed Surface Mount',
    severity: 'Critical',
    status: 'Action Implemented',
    createdDate: '2026-08-12',
    targetClosureDate: '2026-09-10',
    owner: 'Dr. Anita Joshi',
    defectCategory: 'Solder Defect / Bridging',
    affectedQuantity: 420,
    scrappedQuantity: 12,
    reworkedQuantity: 408,
    costImpactUSD: 8400,
    customerVisible: true,
    eightD: {
      d1_team: {
        champion: 'Michael Reynolds (VP Quality)',
        leader: 'Dr. Anita Joshi (Senior Quality Engineer)',
        members: [
          'Carlos Mendez (Plant Ops)',
          'David Chen (SMT Process Engineer)',
          'Sarah Lin (Quality Assurance)',
          'Hans Schneider (Equipment Maintenance)'
        ],
        customerRepresentative: 'Dr. Elena Rostova (VoltMobility Quality Lead)'
      },
      d2_problem: {
        description: 'During 3D-AOI and Nordson 3D-AXI X-Ray inspection of Lot #VM-20260811-BMS, 14 units exhibited solder bridging across fine-pitch (0.4mm) BGA power driver pins U12 and U14, leading to high-voltage isolation failure in functional test.',
        whatOccurred: 'Micro-bridging under BGA package causing pin-to-pin short circuit.',
        whereDetected: 'Austin Giga-1, SMT Line 1, post-reflow 3D-AXI X-Ray chamber.',
        whenDetected: '2026-08-11 Shift 2 (21:30 CST)',
        defectQuantity: 14,
        lotNumber: 'LOT-VM-BMS-0811-A',
        photos: [
          {
            name: 'X-Ray BGA Voiding & Solder Bridge',
            url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
            caption: '3D-AXI cross-sectional radiograph showing 0.08mm solder bridge across pins 18-19.'
          },
          {
            name: 'Solder Paste Inspection (SPI) Height Map',
            url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
            caption: 'CyberOptics 3D-SPI showing stencil aperture clogging and paste smearing.'
          }
        ]
      },
      d3_containment: {
        actions: [
          {
            id: 'cont-1',
            action: 'Immediate 100% quarantine of Lot #VM-20260811-BMS (420 units) in Secure Cage QA-3.',
            owner: 'Carlos Mendez',
            targetDate: '2026-08-12',
            status: 'completed',
            verifiedBy: 'Dr. Anita Joshi'
          },
          {
            id: 'cont-2',
            action: '100% 3D-AXI X-Ray re-screening of finished goods inventory (1,250 units in shipping staging).',
            owner: 'David Chen',
            targetDate: '2026-08-13',
            status: 'completed',
            verifiedBy: 'Dr. Anita Joshi'
          },
          {
            id: 'cont-3',
            action: 'Automated stencil cleaner cycle frequency reduced from every 15 boards to every 5 boards.',
            owner: 'Hans Schneider',
            targetDate: '2026-08-12',
            status: 'completed',
            verifiedBy: 'David Chen'
          }
        ],
        quarantineQty: 420,
        sortingResults: '406 units passed 3D-AXI re-inspection; 14 units required precision IR-rework station pad desoldering and re-balling.',
        customerNotificationSent: true
      },
      d4_rootCause: {
        primaryRootCause: 'Laser-cut nanocoated stencil aperture worn beyond 100k print cycle life limit without replacement, causing paste volume smearing and excessive deposit height (>155 µm vs nominal 120 µm).',
        escapePointRootCause: 'Pre-reflow SPI warning threshold was set to ±35% instead of automotive ±20% IPC Class 3 tolerance, allowing over-pasted PCBAs to advance to pick-and-place.',
        fiveWhys: [
          {
            step: 1,
            question: 'Why did solder bridging occur on 0.4mm pitch BGA pins?',
            answer: 'Excess solder paste volume (>155 µm) collapsed during reflow liquidus phase and coalesced adjacent solder spheres.',
            verified: true
          },
          {
            step: 2,
            question: 'Why was excessive solder paste deposited on the PCB pads?',
            answer: 'Solder paste leaked beneath the stencil foil due to aperture wear and edge degradation.',
            verified: true
          },
          {
            step: 3,
            question: 'Why was the stencil aperture worn and degrading?',
            answer: 'The laser-cut stencil had accumulated 114,800 squeegee strokes, exceeding its 100,000 rated life cycle.',
            verified: true
          },
          {
            step: 4,
            question: 'Why was the stencil not retired when reaching 100,000 strokes?',
            answer: 'The MES automated tooling stroke counter had not linked its threshold interlock to the DEK printer cycle lock.',
            verified: true
          },
          {
            step: 5,
            question: 'Why was there no automated MES software interlock on stencil life limit?',
            answer: 'Tooling preventive maintenance SOP relied on manual shift checklist logs rather than automated RFID machine interlock.',
            verified: true
          }
        ],
        fishbone: {
          man: ['Operator did not visually verify stencil tension gauge during shift start.'],
          machine: ['MES printer software lacked automated hard-stop interlock when stencil life exceeded 100k strokes.', 'Under-stencil wipe vacuum pressure dropped by 18% due to clogged air line.'],
          method: ['SPI tolerance threshold was set too loose (±35% instead of ±20% IPC Class 3 standard).', 'Manual log entry permitted stroke over-run.'],
          material: ['Type 4 SAC305 solder paste rheology viscosity slightly decreased after 8 hours in ambient 24°C.'],
          measurement: ['CyberOptics SPI algorithm auto-calibrated against nominal target but did not flag consecutive positive offset drift.'],
          environment: ['Cleanroom humidity spiked to 62% RH for 45 minutes during HVAC compressor filter cycle.']
        }
      },
      d5_correctiveActions: [
        {
          id: 'ca-1',
          action: 'Install new Electroformed Fine-Grain Nickel Stencil with Plasma Nanocoating (ID #STN-BMS-092) and calibrate print thickness.',
          owner: 'David Chen',
          targetDate: '2026-08-14',
          status: 'completed',
          validationPlan: 'Run 50-board CPK qualification study measuring solder paste height & volume.'
        },
        {
          id: 'ca-2',
          action: 'Implement MES RFID Tooling Hardware Interlock: DEK printer automatically locks out if stencil exceeds 95,000 strokes.',
          owner: 'Hans Schneider',
          targetDate: '2026-08-18',
          status: 'completed',
          validationPlan: 'Simulate end-of-life stencil test in staging environment; confirm printer lockout.'
        },
        {
          id: 'ca-3',
          action: 'Tighten SPI volume & height limits in CyberOptics recipe from ±35% to ±18% for all 0.4mm pitch components.',
          owner: 'Dr. Anita Joshi',
          targetDate: '2026-08-16',
          status: 'completed',
          validationPlan: 'Verify 0 false rejects on 3 consecutive production lots while detecting artificial 130% paste defect board.'
        }
      ],
      d6_implementation: {
        implementationDate: '2026-08-20',
        measuredPPM: 18,
        pFMEAUpdated: true,
        controlPlanUpdated: true,
        resultsSummary: 'Post-implementation validation across 3,400 production boards achieved 0 solder bridging defects (PPM dropped from 420 to 18). Cpk for solder paste height improved from 1.12 to 1.74.'
      },
      d7_preventiveActions: {
        systemicActions: [
          'Transferred RFID stencil lifecycle tracking software to Guadalajara Tech-3 and Penang Plant-4 SMT lines.',
          'Updated Global SMT Work Instruction WI-SMT-302: Under-stencil solvent wash cycle frequency standardized to 8 prints.',
          'Added quarterly optical stencil aperture profilometry check to master calibration schedule.'
        ],
        lessonsLearnedLogged: true,
        sopUpdated: true,
        crossPlantTransferred: true
      },
      d8_closure: {
        signOffDate: undefined,
        qaManagerApproval: 'Dr. Anita Joshi (Lead QA Sign-Off)',
        customerApproval: 'Dr. Elena Rostova (VoltMobility QA - Preliminary Approved)',
        verificationStatus: 'Monitoring (30-Day)',
        effectivenessDays: 14,
        finalNotes: 'Final sign-off scheduled after 30 consecutive production days (Sept 10, 2026) with zero field or in-line bridging incidents.'
      }
    }
  },
  {
    id: 'NCR-2026-084',
    recordType: 'NCR',
    title: 'Under-Torque on Titanium Fasteners of NeuroPulse Hermetic Enclosure',
    programCode: 'NX-NP-NEURO-V2',
    programName: 'Implantable Neuro-Stimulator (PulseGen-V2)',
    customerName: 'NeuroPulse Health',
    facility: 'Fremont Mega-2 (California, USA)',
    productionLine: 'Cleanroom ISO-7 Medical Line',
    severity: 'Major',
    status: 'RCA In Progress',
    createdDate: '2026-08-22',
    targetClosureDate: '2026-09-05',
    owner: 'Sarah Lin, CQE',
    defectCategory: 'Mechanical / Fastening Torque',
    affectedQuantity: 85,
    scrappedQuantity: 0,
    reworkedQuantity: 85,
    costImpactUSD: 3200,
    customerVisible: true,
    eightD: {
      d1_team: {
        champion: 'Sarah Lin (Quality Lead)',
        leader: 'Marcus Vance (Senior Medical Device Engineer)',
        members: ['Elena Rostova', 'Kenji Sato', 'Rachel Kim']
      },
      d2_problem: {
        description: 'During IP68 Helium mass-spectrometer leak testing, 6 of 85 implantable pulse generators failed fine-leak threshold (<1.0x10^-8 mbar*l/s). Calibrated torque check revealed fasteners torqued to 0.42 Nm vs specified 0.65 ± 0.05 Nm.',
        whatOccurred: 'Sub-optimal torque resulting in incomplete silicone gasket compression.',
        whereDetected: 'Fremont Mega-2, Cleanroom Bay 4, station LEAK-02.',
        whenDetected: '2026-08-22 Shift 1 (10:15 PST)',
        defectQuantity: 6,
        lotNumber: 'LOT-NP-0822-CR',
        photos: [
          {
            name: 'Helium Leak Detector Chamber Log',
            url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
            caption: 'Helium spectrometer leak rate graph indicating gasket bypass.'
          }
        ]
      },
      d3_containment: {
        actions: [
          {
            id: 'cont-201',
            action: 'Quarantined all 85 units from Lot #NP-0822-CR in cleanroom staging desiccator.',
            owner: 'Marcus Vance',
            targetDate: '2026-08-22',
            status: 'completed',
            verifiedBy: 'Sarah Lin'
          },
          {
            id: 'cont-202',
            action: 'Calibrated digital electric torque screwdrivers on all 4 cleanroom assembly stations.',
            owner: 'Kenji Sato',
            targetDate: '2026-08-23',
            status: 'completed',
            verifiedBy: 'Marcus Vance'
          }
        ],
        quarantineQty: 85,
        sortingResults: 'All 85 units disassembled under laminar flow hood, gaskets inspected and replaced, re-torqued using calibrated digital driver.',
        customerNotificationSent: true
      },
      d4_rootCause: {
        primaryRootCause: 'Smart electric torque driver clutch spring relaxed after 14,000 cycles, causing early torque shutoff before target 0.65 Nm was attained.',
        escapePointRootCause: 'Pre-shift torque verification was conducted using an analog dial tester with ±0.1 Nm resolution which masked the 0.23 Nm deficiency.',
        fiveWhys: [
          {
            step: 1,
            question: 'Why did the hermetic seal fail Helium leak testing?',
            answer: 'Silicone seal gasket was under-compressed along the top perimeter.',
            verified: true
          },
          {
            step: 2,
            question: 'Why was the gasket under-compressed?',
            answer: 'Fastener torque was 0.42 Nm instead of the required 0.65 Nm.',
            verified: true
          },
          {
            step: 3,
            question: 'Why did the operator torque to 0.42 Nm?',
            answer: 'The electric torque screwdriver auto-shutoff indicated green light at 0.42 Nm.',
            verified: true
          },
          {
            step: 4,
            question: 'Why did the screwdriver shutoff early?',
            answer: 'Clutch tension calibration drifted due to cycle fatigue and micro-wear.',
            verified: true
          },
          {
            step: 5,
            question: 'Why was the tool calibration drift not caught at shift start?',
            answer: 'Shift-start verification jig was an analog spring gauge rather than a digital transducer with angle-torque curve verification.',
            verified: true
          }
        ],
        fishbone: {
          man: ['Operator relied strictly on tool LED indicator without secondary digital angle readout.'],
          machine: ['Torque screwdriver transducer calibration drifted over 14,000 continuous cycles.'],
          method: ['Daily calibration verification SOP lacked minimum resolution specification.'],
          material: ['Grade 5 Titanium screws with micro-fluoropolymer patch caused minor friction variance.'],
          measurement: ['Analog dial calibration fixture had 15% parallax error.'],
          environment: ['Cleanroom positive pressure laminar air flow temperature steady at 20.5°C (no impact).']
        }
      },
      d5_correctiveActions: [
        {
          id: 'ca-201',
          action: 'Replace all cleanroom torque drivers with Atlas Copco MicroTorque smart screwdrivers featuring real-time wireless torque/angle feedback and MES interlock.',
          owner: 'Marcus Vance',
          targetDate: '2026-08-28',
          status: 'in_progress',
          validationPlan: 'Complete 30-day continuous Gage R&R study with <5% error.'
        }
      ],
      d6_implementation: {
        implementationDate: '2026-08-28',
        measuredPPM: 0,
        pFMEAUpdated: true,
        controlPlanUpdated: false,
        resultsSummary: 'New smart torque drivers staged and undergoing IT network integration.'
      },
      d7_preventiveActions: {
        systemicActions: [
          'Mandate digital transducer calibration verification at the start of every shift (Poka-Yoke).',
          'Add automatic torque-out threshold to MES station routing (no PCBA advances if torque is out of 0.60-0.70 Nm range).'
        ],
        lessonsLearnedLogged: true,
        sopUpdated: false,
        crossPlantTransferred: false
      },
      d8_closure: {
        verificationStatus: 'Pending Sign-Off',
        qaManagerApproval: 'Sarah Lin, CQE',
        effectivenessDays: 5,
        finalNotes: 'Awaiting completion of CA-201 smart screwdriver rollout.'
      }
    }
  },
  {
    id: 'CAPA-2026-018',
    recordType: 'CAPA',
    title: 'Conformal Coating Thickness Non-Uniformity on Aerospace Flight Computer',
    programCode: 'NX-OR-ROBO-X1',
    programName: 'Autonomous Mobile Robot Controller (AMR-Drive-X1)',
    customerName: 'Orion Warehouse Robotics',
    facility: 'Penang Plant-4 (Bayan Lepas, Malaysia)',
    productionLine: 'High-Reliability Box Build Line 4',
    severity: 'Minor',
    status: 'Closed',
    createdDate: '2026-06-18',
    targetClosureDate: '2026-07-20',
    closedDate: '2026-07-19',
    owner: 'Chai Hock Boon',
    defectCategory: 'Conformal Coating / Thickness',
    affectedQuantity: 210,
    scrappedQuantity: 0,
    reworkedQuantity: 210,
    costImpactUSD: 2400,
    customerVisible: true,
    eightD: {
      d1_team: {
        champion: 'Chai Hock Boon (QA Manager)',
        leader: 'Wong Kah Wei (Process Engineer)',
        members: ['Priya Patel', 'Tan Mei Ling']
      },
      d2_problem: {
        description: 'UV fluorescence optical inspection identified conformal coating thickness variation (18 µm vs specified 35-50 µm IPC-CC-830 standard) around tall electrolytic capacitors.',
        whatOccurred: 'Shadowing effect during robotic spray atomization.',
        whereDetected: 'Penang Plant-4, Conformal Coating Cell #2.',
        whenDetected: '2026-06-18 Shift 1',
        defectQuantity: 18,
        lotNumber: 'LOT-AMR-0618-C',
        photos: []
      },
      d3_containment: {
        actions: [
          {
            id: 'cont-301',
            action: 'Touch-up manual brush coating applied under UV inspection booth to all affected units.',
            owner: 'Wong Kah Wei',
            targetDate: '2026-06-19',
            status: 'completed',
            verifiedBy: 'Chai Hock Boon'
          }
        ],
        quarantineQty: 210,
        sortingResults: '100% re-inspected using eddy current thickness gauge; verified 42 µm thickness.',
        customerNotificationSent: false
      },
      d4_rootCause: {
        primaryRootCause: 'Nordson Asymtek spray valve robotic path lacked 4-axis tilt articulation, causing tall component shadowing.',
        escapePointRootCause: 'Manual UV inspection was performed at 45 degree angle only.',
        fiveWhys: [
          {
            step: 1,
            question: 'Why was coating thickness below 25 µm near capacitors?',
            answer: 'Spray pattern was blocked by the 16mm tall capacitor body.',
            verified: true
          },
          {
            step: 2,
            question: 'Why was the spray nozzle not angled around the capacitor?',
            answer: 'The CNC robotic trajectory program was 3-axis linear only.',
            verified: true
          },
          {
            step: 3,
            question: 'Why was the 4th tilt axis not enabled in the CNC program?',
            answer: 'Initial NPI recipe was programmed without 3D CAD collision model simulation.',
            verified: true
          },
          {
            step: 4,
            question: 'Why was 3D CAD simulation skipped during NPI?',
            answer: 'Prototype time compression bypassed 3D path optimization checklist.',
            verified: true
          },
          {
            step: 5,
            question: 'Why did NPI stage gate allow bypass?',
            answer: 'Process FMEA did not list component aspect ratio > 1.5 as high risk trigger.',
            verified: true
          }
        ],
        fishbone: {
          man: ['NPI programmer did not consult height clearance table.'],
          machine: ['Robotic valve tilt axis had not been unlocked in machine firmware.'],
          method: ['Missing CAD height obstacle checking rule in NPI design review.'],
          material: ['HumiSeal 1B73 acrylic coating viscosity was within nominal 250 cPs.'],
          measurement: ['Eddy current probe had difficulty reaching recessed pad geometry.'],
          environment: ['Exhaust airflow velocity was calibrated at 100 FPM.']
        }
      },
      d5_correctiveActions: [
        {
          id: 'ca-301',
          action: 'Reprogram robotic coating path with 30-degree multi-axis nozzle tilt pass around all components > 10mm height.',
          owner: 'Wong Kah Wei',
          targetDate: '2026-06-25',
          status: 'completed',
          validationPlan: 'Measure 10 cross-sectioned boards under UV microscope.'
        }
      ],
      d6_implementation: {
        implementationDate: '2026-06-26',
        measuredPPM: 0,
        pFMEAUpdated: true,
        controlPlanUpdated: true,
        resultsSummary: 'Multi-axis path validated. 100% of tested boards demonstrated uniform 38-46 µm coating thickness across 360 degrees of tall components.'
      },
      d7_preventiveActions: {
        systemicActions: [
          'Added automatic CAD component height clearance audit in Global NPI checklist.',
          'Updated standard recipe library in all 3 manufacturing plants.'
        ],
        lessonsLearnedLogged: true,
        sopUpdated: true,
        crossPlantTransferred: true
      },
      d8_closure: {
        signOffDate: '2026-07-19',
        qaManagerApproval: 'Chai Hock Boon (QA Manager)',
        customerApproval: 'Rachel Kim (Orion After-Sales / Quality)',
        verificationStatus: 'Verified Effective',
        effectivenessDays: 45,
        finalNotes: 'Zero conformal coating issues observed across 6,200 production units over 45 days. CAPA successfully closed.'
      }
    }
  }
];

export const mockProcessCapabilities: ProcessCapabilityItem[] = [
  {
    id: 'spc-solder-height',
    characteristicName: 'Solder Paste Deposit Height',
    stationName: 'CyberOptics 3D-SPI Cell A',
    lineName: 'SMT Line 1 (Austin)',
    facility: 'Austin Giga-1 (Texas, USA)',
    programCode: 'NX-VM-BMS-G3',
    unit: 'µm',
    usl: 145.0,
    lsl: 95.0,
    nominal: 120.0,
    ucl: 132.8,
    lcl: 107.2,
    cl: 120.4,
    cp: 1.84,
    cpk: 1.68,
    pp: 1.76,
    ppk: 1.61,
    mean: 120.4,
    stdDev: 4.52,
    sampleCount: 30,
    status: 'capable',
    distributionHistogram: [
      { binRange: '95-101 µm', count: 0, normalDensity: 0.002 },
      { binRange: '102-107 µm', count: 1, normalDensity: 0.018 },
      { binRange: '108-113 µm', count: 4, normalDensity: 0.095 },
      { binRange: '114-119 µm', count: 9, normalDensity: 0.285 },
      { binRange: '120-125 µm', count: 11, normalDensity: 0.380 },
      { binRange: '126-131 µm', count: 4, normalDensity: 0.175 },
      { binRange: '132-137 µm', count: 1, normalDensity: 0.040 },
      { binRange: '138-145 µm', count: 0, normalDensity: 0.005 }
    ],
    measurements: [
      { sampleId: 1, timestamp: '08:00', subgroupValues: [119, 121, 120, 118, 122], xBar: 120.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 2, timestamp: '08:30', subgroupValues: [122, 124, 119, 121, 123], xBar: 121.8, rangeR: 5, stdDev: 1.92, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 3, timestamp: '09:00', subgroupValues: [118, 120, 117, 119, 121], xBar: 119.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 4, timestamp: '09:30', subgroupValues: [123, 125, 122, 121, 124], xBar: 123.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 5, timestamp: '10:00', subgroupValues: [121, 120, 122, 119, 120], xBar: 120.4, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 6, timestamp: '10:30', subgroupValues: [125, 126, 124, 123, 127], xBar: 125.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 7, timestamp: '11:00', subgroupValues: [128, 129, 127, 126, 130], xBar: 128.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 8, timestamp: '11:30', subgroupValues: [131, 133, 130, 132, 134], xBar: 132.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 9, timestamp: '12:00', subgroupValues: [134, 135, 133, 136, 135], xBar: 134.6, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: true, violationRule: 'Rule 1: Point beyond Upper Control Limit (134.6 > 132.8)' },
      { sampleId: 10, timestamp: '12:30', subgroupValues: [122, 120, 121, 123, 119], xBar: 121.0, rangeR: 4, stdDev: 1.58, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 11, timestamp: '13:00', subgroupValues: [119, 120, 118, 121, 120], xBar: 119.6, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 12, timestamp: '13:30', subgroupValues: [120, 122, 119, 121, 120], xBar: 120.4, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 13, timestamp: '14:00', subgroupValues: [121, 120, 122, 119, 120], xBar: 120.4, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 14, timestamp: '14:30', subgroupValues: [118, 119, 117, 120, 119], xBar: 118.6, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false },
      { sampleId: 15, timestamp: '15:00', subgroupValues: [122, 121, 123, 120, 122], xBar: 121.6, rangeR: 3, stdDev: 1.14, ucl: 132.8, lcl: 107.2, cl: 120.4, usl: 145, lsl: 95, nominal: 120, isViolation: false }
    ]
  },
  {
    id: 'spc-bga-voiding',
    characteristicName: 'BGA Solder Ball Voiding Ratio',
    stationName: 'Nordson Dage 3D-AXI X-Ray',
    lineName: 'SMT Line 2 (Austin)',
    facility: 'Austin Giga-1 (Texas, USA)',
    programCode: 'NX-VM-BMS-G3',
    unit: '%',
    usl: 15.0,
    lsl: 0.0,
    nominal: 5.0,
    ucl: 9.8,
    lcl: 1.2,
    cl: 5.5,
    cp: 1.72,
    cpk: 1.55,
    pp: 1.65,
    ppk: 1.48,
    mean: 5.5,
    stdDev: 1.45,
    sampleCount: 25,
    status: 'capable',
    distributionHistogram: [
      { binRange: '0-2 %', count: 2, normalDensity: 0.08 },
      { binRange: '2-4 %', count: 6, normalDensity: 0.24 },
      { binRange: '4-6 %', count: 11, normalDensity: 0.39 },
      { binRange: '6-8 %', count: 5, normalDensity: 0.22 },
      { binRange: '8-10 %', count: 1, normalDensity: 0.06 },
      { binRange: '>10 %', count: 0, normalDensity: 0.01 }
    ],
    measurements: [
      { sampleId: 1, timestamp: '08:00', subgroupValues: [5.2, 4.8, 6.1, 5.0, 5.4], xBar: 5.3, rangeR: 1.3, stdDev: 0.50, ucl: 9.8, lcl: 1.2, cl: 5.5, usl: 15.0, lsl: 0, nominal: 5.0, isViolation: false },
      { sampleId: 2, timestamp: '09:00', subgroupValues: [5.8, 6.2, 5.5, 5.9, 6.1], xBar: 5.9, rangeR: 0.7, stdDev: 0.27, ucl: 9.8, lcl: 1.2, cl: 5.5, usl: 15.0, lsl: 0, nominal: 5.0, isViolation: false },
      { sampleId: 3, timestamp: '10:00', subgroupValues: [4.9, 5.1, 4.8, 5.3, 5.0], xBar: 5.0, rangeR: 0.5, stdDev: 0.19, ucl: 9.8, lcl: 1.2, cl: 5.5, usl: 15.0, lsl: 0, nominal: 5.0, isViolation: false },
      { sampleId: 4, timestamp: '11:00', subgroupValues: [6.5, 6.8, 6.2, 7.0, 6.4], xBar: 6.6, rangeR: 0.8, stdDev: 0.31, ucl: 9.8, lcl: 1.2, cl: 5.5, usl: 15.0, lsl: 0, nominal: 5.0, isViolation: false },
      { sampleId: 5, timestamp: '12:00', subgroupValues: [5.3, 5.6, 5.2, 5.4, 5.5], xBar: 5.4, rangeR: 0.4, stdDev: 0.16, ucl: 9.8, lcl: 1.2, cl: 5.5, usl: 15.0, lsl: 0, nominal: 5.0, isViolation: false },
      { sampleId: 6, timestamp: '13:00', subgroupValues: [5.1, 4.9, 5.3, 5.0, 5.2], xBar: 5.1, rangeR: 0.4, stdDev: 0.15, ucl: 9.8, lcl: 1.2, cl: 5.5, usl: 15.0, lsl: 0, nominal: 5.0, isViolation: false }
    ]
  },
  {
    id: 'spc-voltage-delta',
    characteristicName: 'BMS High-Precision Voltage Sense Delta',
    stationName: 'Automated Test Equipment ATE-03',
    lineName: 'Box Build Line 1 (Austin)',
    facility: 'Austin Giga-1 (Texas, USA)',
    programCode: 'NX-VM-BMS-G3',
    unit: 'mV',
    usl: 2.0,
    lsl: -2.0,
    nominal: 0.0,
    ucl: 1.45,
    lcl: -1.45,
    cl: 0.08,
    cp: 1.95,
    cpk: 1.88,
    pp: 1.89,
    ppk: 1.81,
    mean: 0.08,
    stdDev: 0.34,
    sampleCount: 20,
    status: 'capable',
    distributionHistogram: [
      { binRange: '-2.0 to -1.2 mV', count: 0, normalDensity: 0.01 },
      { binRange: '-1.2 to -0.4 mV', count: 3, normalDensity: 0.18 },
      { binRange: '-0.4 to +0.4 mV', count: 12, normalDensity: 0.62 },
      { binRange: '+0.4 to +1.2 mV', count: 4, normalDensity: 0.17 },
      { binRange: '+1.2 to +2.0 mV', count: 1, normalDensity: 0.02 }
    ],
    measurements: [
      { sampleId: 1, timestamp: '08:00', subgroupValues: [0.1, -0.2, 0.0, 0.3, -0.1], xBar: 0.02, rangeR: 0.5, stdDev: 0.19, ucl: 1.45, lcl: -1.45, cl: 0.08, usl: 2.0, lsl: -2.0, nominal: 0, isViolation: false },
      { sampleId: 2, timestamp: '09:00', subgroupValues: [0.2, 0.1, -0.1, 0.0, 0.2], xBar: 0.08, rangeR: 0.3, stdDev: 0.13, ucl: 1.45, lcl: -1.45, cl: 0.08, usl: 2.0, lsl: -2.0, nominal: 0, isViolation: false },
      { sampleId: 3, timestamp: '10:00', subgroupValues: [-0.3, 0.1, 0.2, -0.1, 0.0], xBar: -0.02, rangeR: 0.5, stdDev: 0.20, ucl: 1.45, lcl: -1.45, cl: 0.08, usl: 2.0, lsl: -2.0, nominal: 0, isViolation: false }
    ]
  }
];

export const mockYieldTrends: YieldTrendPoint[] = [
  { date: 'Aug 14', smtFirstPassYield: 98.4, ictYield: 99.1, fctYield: 98.9, finalRolledYield: 96.5, targetYield: 98.0 },
  { date: 'Aug 15', smtFirstPassYield: 98.6, ictYield: 99.2, fctYield: 99.0, finalRolledYield: 96.8, targetYield: 98.0 },
  { date: 'Aug 16', smtFirstPassYield: 98.1, ictYield: 98.9, fctYield: 98.7, finalRolledYield: 95.8, targetYield: 98.0 },
  { date: 'Aug 17', smtFirstPassYield: 98.7, ictYield: 99.3, fctYield: 99.1, finalRolledYield: 97.2, targetYield: 98.0 },
  { date: 'Aug 18', smtFirstPassYield: 99.0, ictYield: 99.4, fctYield: 99.2, finalRolledYield: 97.6, targetYield: 98.0 },
  { date: 'Aug 19', smtFirstPassYield: 98.9, ictYield: 99.5, fctYield: 99.3, finalRolledYield: 97.7, targetYield: 98.0 },
  { date: 'Aug 20', smtFirstPassYield: 99.2, ictYield: 99.6, fctYield: 99.4, finalRolledYield: 98.2, targetYield: 98.0 },
  { date: 'Aug 21', smtFirstPassYield: 99.1, ictYield: 99.5, fctYield: 99.4, finalRolledYield: 98.0, targetYield: 98.0 },
  { date: 'Aug 22', smtFirstPassYield: 99.3, ictYield: 99.7, fctYield: 99.5, finalRolledYield: 98.5, targetYield: 98.0 },
  { date: 'Aug 23', smtFirstPassYield: 99.4, ictYield: 99.7, fctYield: 99.6, finalRolledYield: 98.7, targetYield: 98.0 },
  { date: 'Aug 24', smtFirstPassYield: 99.2, ictYield: 99.6, fctYield: 99.5, finalRolledYield: 98.3, targetYield: 98.0 },
  { date: 'Aug 25', smtFirstPassYield: 99.5, ictYield: 99.8, fctYield: 99.7, finalRolledYield: 99.0, targetYield: 98.0 },
  { date: 'Aug 26', smtFirstPassYield: 99.4, ictYield: 99.7, fctYield: 99.6, finalRolledYield: 98.7, targetYield: 98.0 },
  { date: 'Aug 27', smtFirstPassYield: 99.6, ictYield: 99.8, fctYield: 99.7, finalRolledYield: 99.1, targetYield: 98.0 }
];

export const mockEscapedDefects: EscapedDefectRecord[] = [
  { month: 'Mar 2026', internalDefectPPM: 380, customerEscapesPPM: 14, targetPPM: 25, customerRMAUnits: 2, criticalEscapes: 0, topEscapeCause: 'Fine-pitch resistor soldering tombstone' },
  { month: 'Apr 2026', internalDefectPPM: 340, customerEscapesPPM: 9, targetPPM: 25, customerRMAUnits: 1, criticalEscapes: 0, topEscapeCause: 'Connector latch retention clip loose' },
  { month: 'May 2026', internalDefectPPM: 290, customerEscapesPPM: 12, targetPPM: 25, customerRMAUnits: 2, criticalEscapes: 0, topEscapeCause: 'Conformal coating pinhole near sensor' },
  { month: 'Jun 2026', internalDefectPPM: 240, customerEscapesPPM: 6, targetPPM: 20, customerRMAUnits: 1, criticalEscapes: 0, topEscapeCause: 'Firmware checksum mismatch in bootloader' },
  { month: 'Jul 2026', internalDefectPPM: 195, customerEscapesPPM: 4, targetPPM: 20, customerRMAUnits: 0, criticalEscapes: 0, topEscapeCause: 'Minor label barcode scuffing' },
  { month: 'Aug 2026', internalDefectPPM: 165, customerEscapesPPM: 2, targetPPM: 20, customerRMAUnits: 0, criticalEscapes: 0, topEscapeCause: 'Zero functional customer escapes (best-in-class)' }
];

export const mockQualityAudits: QualityAuditSchedule[] = [
  {
    id: 'audit-001',
    auditTitle: 'TÜV SÜD IATF 16949 Annual Automotive Surveillance Audit',
    auditType: 'Registrar ISO/IATF',
    standard: 'IATF 16949:2016',
    facility: 'Austin Giga-1 (Texas, USA)',
    scheduledDate: '2026-09-18',
    durationDays: 3,
    leadAuditor: 'Klaus Brandstetter (TÜV SÜD Lead Auditor)',
    auditingBody: 'TÜV SÜD Management Service GmbH',
    status: 'Scheduled',
    overallScore: undefined,
    totalCheckpoints: 48,
    completedCheckpoints: 0,
    findingsSummary: { major: 0, minor: 0, ofi: 0 },
    scopeSummary: 'Comprehensive multi-line evaluation of Austin Giga-1 SMT, Box-Build, and automated EOL test cells for powertrain battery electronics.',
    checklists: [
      { id: 'chk-1', section: 'Section 4: Context of the Organization', clause: '4.4.1.2 Product Safety', question: 'Are special characteristics for automotive safety identified, flow-charted into pFMEA, and controlled in manufacturing Control Plans?', evidence: 'Review BMS High-Voltage Isolation Control Plan & pFMEA rev 5.', result: 'Pending', auditorNotes: 'Pre-audit documents assembled in Audit Package #1.' },
      { id: 'chk-2', section: 'Section 7: Support & Resources', clause: '7.1.5.1.1 Measurement Systems Analysis (MSA)', question: 'Are Gage R&R studies conducted for all automated optical inspection (AOI) and X-ray systems with GRR < 10%?', evidence: 'Review 3D-SPI and 3D-AXI Gage R&R study reports.', result: 'Pending', auditorNotes: 'Gage R&R studies updated on 2026-08-15; %GRR is 6.8%.' },
      { id: 'chk-3', section: 'Section 8: Operation', clause: '8.5.1.1 Control Plan', question: 'Do production line setup sheets match current engineering drawings and ECO revision levels at line stations?', evidence: 'Shopfloor station walk audits on Lines SMT-1 and SMT-2.', result: 'Pending', auditorNotes: 'Digital MES tablet display verifies automated recipe match.' },
      { id: 'chk-4', section: 'Section 10: Improvement', clause: '10.2.3 Problem Solving', question: 'Are 8D root-cause corrective action methodologies applied with statistical verification prior to CAPA closure?', evidence: 'Review closed CAPA-2026-018 and active CAPA-2026-029.', result: 'Pending', auditorNotes: '8D reports contain verified 5-Why and Fishbone charts.' }
    ],
    findings: []
  },
  {
    id: 'audit-002',
    auditTitle: 'VoltMobility Customer Supplier Quality Quarterly Audit',
    auditType: 'Customer Audit',
    standard: 'VoltMobility Supplier Quality Manual Rev 4',
    facility: 'Austin Giga-1 (Texas, USA)',
    scheduledDate: '2026-08-20',
    durationDays: 2,
    leadAuditor: 'Dr. Elena Rostova (VoltMobility QA Lead)',
    auditingBody: 'VoltMobility EV Quality Operations',
    status: 'In Progress',
    overallScore: 96.4,
    totalCheckpoints: 30,
    completedCheckpoints: 26,
    findingsSummary: { major: 0, minor: 1, ofi: 2 },
    scopeSummary: 'Customer on-site deep-dive on BMS Gen-3 manufacturing line, traceability logs, ESD protection, and component baking registers.',
    checklists: [
      { id: 'chk-101', section: 'Traceability & Serialization', clause: 'VM-SQM-4.2', question: 'Can each finished BMS PCBA trace individual IC date codes, reels, and reflow peak temperatures within 60 seconds?', evidence: 'Live laser barcode scan test on Line 1 PCBA.', result: 'Conforming', auditorNotes: 'MES returned complete component reel tree and reflow thermal profile in 14 seconds.' },
      { id: 'chk-102', section: 'ESD Control ANSI/ESD S20.20', clause: 'VM-SQM-5.1', question: 'Are continuous wrist-strap and grounding heel-strap continuous monitors functional and calibrated within 30 days?', evidence: 'Physical multimeter resistance test on 8 operator benches.', result: 'Conforming', auditorNotes: 'Continuous monitor resistance verified at 1.2 megohms.' },
      { id: 'chk-103', section: 'Baking & Moisture Sensitive Devices (MSD)', clause: 'VM-SQM-6.4', question: 'Are MSL 3/4 components tracked in dry-cabinet software with floor life countdown alarms?', evidence: 'Totech Dry Cabinet #3 log inspection.', result: 'Minor NC', auditorNotes: 'Found one open reel of MCU ICs in dry box lacking manual physical backup tag; digital barcode was logged properly.' },
      { id: 'chk-104', section: 'Foreign Object Debris (FOD)', clause: 'VM-SQM-7.3', question: 'Are protective covers placed on open PCBA staging carts during shift transitions?', evidence: 'Observation during Shift 1 to Shift 2 handover.', result: 'OFI', auditorNotes: 'Recommend installing anti-static clear vinyl drape curtains on staging buffer rack B.' }
    ],
    findings: [
      {
        id: 'fnd-001',
        auditId: 'audit-002',
        code: 'NC-VM-2026-01',
        severity: 'Minor NC',
        clause: 'VM-SQM-6.4 Moisture Sensitive Device Handling',
        title: 'Physical Backup Label Missing on MSL 3 Dry Storage Reel',
        description: 'Reel #REEL-MCU-0814 in Dry Cabinet #3 had digital RFID entry but was missing the secondary visual physical color-coded floor life sticker.',
        assignedOwner: 'David Chen (SMT Process Engineer)',
        targetDueDate: '2026-09-02',
        status: 'CAPA Assigned',
        linkedCapaId: 'CAPA-2026-031'
      },
      {
        id: 'fnd-002',
        auditId: 'audit-002',
        code: 'OFI-VM-2026-01',
        severity: 'OFI',
        clause: 'VM-SQM-7.3 FOD Prevention in Buffer Staging',
        title: 'Install Anti-Static Dust Covers on Staging Rack B',
        description: 'Recommendation to add transparent dissipative drapes on intermediate WIP buffer carts to prevent airborne lint accumulation.',
        assignedOwner: 'Carlos Mendez (Plant Ops)',
        targetDueDate: '2026-09-15',
        status: 'Open'
      }
    ]
  },
  {
    id: 'audit-003',
    auditTitle: 'ISO 13485 Internal Cleanroom System Audit',
    auditType: 'Internal System Audit',
    standard: 'ISO 13485:2016 Clauses 6.4 & 7.5',
    facility: 'Fremont Mega-2 (California, USA)',
    scheduledDate: '2026-07-25',
    durationDays: 1,
    leadAuditor: 'Sarah Lin, CQE',
    auditingBody: 'Nexgile Internal Quality Audit Team',
    status: 'Completed',
    overallScore: 98.2,
    totalCheckpoints: 24,
    completedCheckpoints: 24,
    findingsSummary: { major: 0, minor: 0, ofi: 1 },
    scopeSummary: 'Internal audit of Fremont ISO-7 Cleanroom environmental controls, gowning protocol compliance, and DI water filtration purity.',
    checklists: [
      { id: 'chk-201', section: 'Cleanroom Environmental Control', clause: '6.4.2 Contamination Control', question: 'Are differential air pressure monitors maintaining >15 Pa across cleanroom airlocks?', evidence: 'Magnehelic gauge logs and digital BMS telemetry.', result: 'Conforming', auditorNotes: 'Average pressure maintained at 22.4 Pa throughout test period.' }
    ],
    findings: [
      {
        id: 'fnd-003',
        auditId: 'audit-003',
        code: 'OFI-ISO13485-0726',
        severity: 'OFI',
        clause: '6.4.1 Gowning Protocol',
        title: 'Upgrade Gowning Room Mirror with Step-by-Step Pictorial Checklist',
        description: 'Provide enhanced visual aids for shoe cover and bouffant cap positioning in airlock entry.',
        assignedOwner: 'Elena Rostova',
        targetDueDate: '2026-08-30',
        status: 'Closed'
      }
    ]
  }
];

export const mockCalibrationGages: CalibrationGageRecord[] = [
  {
    id: 'gage-001',
    assetTag: 'GAGE-CMM-004',
    equipmentName: 'Zeiss CONTURA 3D Coordinate Measuring Machine (CMM)',
    type: 'CMM 3D Coordinate',
    facility: 'Austin Giga-1 (Texas, USA)',
    locationBay: 'Metrology Lab - Temp Controlled (20.0°C)',
    lastCalDate: '2026-02-14',
    nextCalDue: '2027-02-13',
    status: 'Calibrated',
    grrPercent: 5.4,
    grrRating: 'Acceptable (<10%)',
    standardRef: 'NIST Traceable Master Step Gauge #NIST-8841',
    technician: 'Zeiss Field Calibration Service',
    certificateRef: 'CERT-ZEISS-2026-9921'
  },
  {
    id: 'gage-002',
    assetTag: 'GAGE-SPI-012',
    equipmentName: 'CyberOptics SQ3000 3D Automated Solder Paste Inspection',
    type: '3D Optical Profiler',
    facility: 'Austin Giga-1 (Texas, USA)',
    locationBay: 'SMT Line 1 - Print Bay',
    lastCalDate: '2026-08-01',
    nextCalDue: '2026-09-01',
    status: 'Due Soon',
    grrPercent: 6.8,
    grrRating: 'Acceptable (<10%)',
    standardRef: 'CyberOptics Glass Target Calibration Standard #CGT-440',
    technician: 'David Chen (Certified Metrologist)',
    certificateRef: 'CAL-SPI-2026-08'
  },
  {
    id: 'gage-003',
    assetTag: 'GAGE-TRQ-088',
    equipmentName: 'Atlas Copco MicroTorque Smart Transducer Screwdriver',
    type: 'Torque Driver 0.1-1.0 Nm',
    facility: 'Fremont Mega-2 (California, USA)',
    locationBay: 'Cleanroom ISO-7 Assembly Bay 4',
    lastCalDate: '2026-08-23',
    nextCalDue: '2026-11-23',
    status: 'Calibrated',
    grrPercent: 4.2,
    grrRating: 'Acceptable (<10%)',
    standardRef: 'Crane Electronics Dynamic Torque Calibrator #CTC-10',
    technician: 'Kenji Sato',
    certificateRef: 'CERT-TRQ-2026-0823'
  },
  {
    id: 'gage-004',
    assetTag: 'GAGE-THP-003',
    equipmentName: 'KIC K2 Thermal Reflow Profiler 9-Channel',
    type: 'Reflow Thermal Profiler',
    facility: 'Penang Plant-4 (Bayan Lepas, Malaysia)',
    locationBay: 'SMT Line 3 - Reflow Oven Bay',
    lastCalDate: '2026-05-10',
    nextCalDue: '2026-11-09',
    status: 'Calibrated',
    grrPercent: 7.1,
    grrRating: 'Acceptable (<10%)',
    standardRef: 'Omega Precision Thermocouple Calibration Standard',
    technician: 'KIC Southeast Asia Regional Service',
    certificateRef: 'CERT-KIC-2026-0510'
  },
  {
    id: 'gage-005',
    assetTag: 'GAGE-CAL-045',
    equipmentName: 'Mitutoyo Digimatic Caliper 0-150mm (0.01mm res)',
    type: 'Digital Caliper',
    facility: 'Guadalajara Tech-3 (Jalisco, Mexico)',
    locationBay: 'Mechanical Incoming QA Inspection Bay',
    lastCalDate: '2025-08-15',
    nextCalDue: '2026-08-15',
    status: 'Overdue',
    grrPercent: 12.8,
    grrRating: 'Marginal (10-30%)',
    standardRef: 'Mitutoyo Grade 0 Gauge Block Set #GB-9910',
    technician: 'Ing. Mateo Alvarez',
    certificateRef: 'CAL-MIT-2025-08'
  },
  {
    id: 'gage-006',
    assetTag: 'GAGE-XRF-002',
    equipmentName: 'Hitachi EA1000AIII RoHS Screening XRF Spectrometer',
    type: 'X-Ray Fluorescence (RoHS/Halogen)',
    facility: 'Enterprise Global (Austin Central QA Lab)',
    locationBay: 'Hazardous Substances Screening Bay',
    lastCalDate: '2026-04-18',
    nextCalDue: '2027-04-17',
    status: 'Calibrated',
    grrPercent: 3.8,
    grrRating: 'Acceptable (<10%)',
    standardRef: 'NIST Standard Reference Material SRM-680 (High Purity Lead)',
    technician: 'Hitachi High-Tech Science Certified Specialist',
    certificateRef: 'CERT-XRF-2026-0418'
  }
];

export const mockAuditFindings: AuditFinding[] = mockQualityAudits.flatMap(a => a.findings);

// Convenient alias exports
export {
  mockComplianceDocuments as complianceDocuments,
  mockRenewalTasks as renewalTasks,
  mockAuditBundles as auditBundles,
  mockNCRCAPARecords as ncrCapaRecords,
  mockProcessCapabilities as spcParameterSeries,
  mockProcessCapabilities as processCapabilities,
  mockYieldTrends as yieldTrendData,
  mockYieldTrends as yieldTrends,
  mockEscapedDefects as escapedDefectMetrics,
  mockEscapedDefects as escapedDefects,
  mockQualityAudits as auditSchedules,
  mockQualityAudits as qualityAudits,
  mockAuditFindings as auditFindings,
  mockCalibrationGages as calibrationRecords,
  mockCalibrationGages as calibrationGages
};

