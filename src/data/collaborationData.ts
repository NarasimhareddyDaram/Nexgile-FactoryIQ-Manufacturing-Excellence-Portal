import {
  ProjectThread,
  CollaborationDocument,
  Cad3DModel,
  GerberProject,
  BomComponent,
  KnowledgeArticle,
  FaqItem,
  ContactSla
} from '../types';

export const INITIAL_PROJECT_THREADS: ProjectThread[] = [
  {
    id: 'TH-AVN-001',
    programId: 'prog-avn-401',
    programCode: 'PRG-AVN-401',
    programName: 'Avionics Gen-4 Control Unit',
    title: 'DFM Clearance: 0.4mm BGA Escape Routing & Underfill Gap on Layer 3',
    category: 'DFM & Design',
    status: 'open',
    priority: 'high',
    createdBy: 'David Kim (Senior DFM Engineer)',
    createdAt: '2026-08-25T08:30:00Z',
    lastActivity: '2026-08-27T07:15:00Z',
    participants: [
      { id: 'usr-dfm-01', name: 'David Kim', role: 'DFM Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: 'usr-cust-01', name: 'Dr. Marcus Vance', role: 'Chief Avionics Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { id: 'usr-smt-02', name: 'Sarah Chen', role: 'SMT Process Specialist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
    ],
    commentsCount: 4,
    unread: true,
    tags: ['DFM', 'BGA', 'Underfill', 'DO-254'],
    comments: [
      {
        id: 'cmt-101',
        threadId: 'TH-AVN-001',
        authorId: 'usr-dfm-01',
        authorName: 'David Kim',
        authorRole: 'Senior DFM Engineer',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Reviewing Rev 2.1 Gerber release for U102 (UltraScale+ FPGA). The current standoff height between the bottom of the BGA substrate and the adjacent 0201 decoupling caps is 0.28mm, which is below our automated underfill dispensing needle clearance threshold of 0.45mm. Recommend shifting C104-C112 out by 0.2mm.',
        mentions: ['Dr. Marcus Vance'],
        attachments: [
          {
            id: 'att-01',
            fileName: 'U102_BGA_Dispense_Clearance_Overlay.pdf',
            fileSize: '2.4 MB',
            fileType: 'PDF',
            uploadedBy: 'David Kim',
            uploadedAt: '2026-08-25T08:32:00Z'
          },
          {
            id: 'att-02',
            fileName: 'Gerber_L3_Clearance_Check.png',
            fileSize: '840 KB',
            fileType: 'PNG',
            uploadedBy: 'David Kim',
            uploadedAt: '2026-08-25T08:35:00Z'
          }
        ],
        reactions: [
          { emoji: '👍', count: 3, users: ['Sarah Chen', 'Dr. Marcus Vance', 'Elena Rostova'] },
          { emoji: '🔍', count: 2, users: ['Dr. Marcus Vance', 'Alex Morgan'] }
        ],
        createdAt: '2026-08-25T08:35:00Z'
      },
      {
        id: 'cmt-102',
        threadId: 'TH-AVN-001',
        authorId: 'usr-cust-01',
        authorName: 'Dr. Marcus Vance',
        authorRole: 'Chief Avionics Architect',
        authorCompany: 'AeroSys Defense',
        content: '@David Kim Thanks for flagging early. Shifting C104-C112 by +0.22mm will increase loop inductance by only 0.04nH, which is well within our PDN jitter tolerance budget for the 1.2V core rail. We will push Rev 2.2 ECAD files by 14:00 UTC.',
        mentions: ['David Kim', 'Sarah Chen'],
        attachments: [
          {
            id: 'att-03',
            fileName: 'PDN_Inductance_Simulation_Delta.pdf',
            fileSize: '1.8 MB',
            fileType: 'PDF',
            uploadedBy: 'Dr. Marcus Vance',
            uploadedAt: '2026-08-25T11:10:00Z'
          }
        ],
        reactions: [
          { emoji: '🚀', count: 4, users: ['David Kim', 'Sarah Chen', 'Michael Chang', 'Elena Rostova'] }
        ],
        createdAt: '2026-08-25T11:12:00Z'
      },
      {
        id: 'cmt-103',
        threadId: 'TH-AVN-001',
        authorId: 'usr-smt-02',
        authorName: 'Sarah Chen',
        authorRole: 'SMT Process Specialist',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Acknowledged. We have pre-configured our Asymtek Dispenser with 27-gauge chamfered precision nozzles and Lord Thermoset ME-525 underfill. As soon as Rev 2.2 Gerbers are uploaded, we will run the dry dispense verification on SMT Line 2.',
        mentions: ['Dr. Marcus Vance', 'David Kim'],
        attachments: [],
        reactions: [
          { emoji: '✅', count: 2, users: ['David Kim', 'Dr. Marcus Vance'] }
        ],
        createdAt: '2026-08-26T04:20:00Z'
      },
      {
        id: 'cmt-104',
        threadId: 'TH-AVN-001',
        authorId: 'usr-dfm-01',
        authorName: 'David Kim',
        authorRole: 'Senior DFM Engineer',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Rev 2.2 files received and verified. Solder mask dam width expanded to 3.8 mil and all keepout zones passed DFM automated rule check. Closing action item.',
        mentions: ['Dr. Marcus Vance'],
        attachments: [],
        reactions: [
          { emoji: '🎉', count: 3, users: ['Dr. Marcus Vance', 'Sarah Chen', 'Elena Rostova'] }
        ],
        createdAt: '2026-08-27T07:15:00Z'
      }
    ]
  },
  {
    id: 'TH-MED-002',
    programId: 'prog-med-202',
    programCode: 'PRG-MED-202',
    programName: 'CardioPulse Medical Monitor',
    title: 'ISO 13485 Biocompatibility Traceability & Silicone Gasket Lot Sign-Off',
    category: 'Quality & CAPA',
    status: 'in_review',
    priority: 'urgent',
    createdBy: 'Elena Rostova (Quality Director)',
    createdAt: '2026-08-26T09:00:00Z',
    lastActivity: '2026-08-27T06:40:00Z',
    participants: [
      { id: 'usr-qual-01', name: 'Elena Rostova', role: 'Quality Director', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
      { id: 'usr-med-03', name: 'Claire Dubois', role: 'Medical Regulatory Officer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' }
    ],
    commentsCount: 2,
    unread: false,
    tags: ['ISO13485', 'Biocompatibility', 'FDA Class II', 'Traceability'],
    comments: [
      {
        id: 'cmt-201',
        threadId: 'TH-MED-002',
        authorId: 'usr-qual-01',
        authorName: 'Elena Rostova',
        authorRole: 'Quality Director',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Lot #GSK-2026-881 for the perimeter IP67 silicone seal has arrived with USP Class VI certificate from Saint-Gobain. DHR (Device History Record) template has been updated for Cleanroom Bay 3.',
        mentions: ['Claire Dubois'],
        attachments: [
          {
            id: 'att-04',
            fileName: 'CoC_SaintGobain_USP_Class_VI_Gasket.pdf',
            fileSize: '3.1 MB',
            fileType: 'PDF',
            uploadedBy: 'Elena Rostova',
            uploadedAt: '2026-08-26T09:05:00Z'
          }
        ],
        reactions: [
          { emoji: '📋', count: 2, users: ['Claire Dubois', 'Sarah Chen'] }
        ],
        createdAt: '2026-08-26T09:10:00Z'
      },
      {
        id: 'cmt-202',
        threadId: 'TH-MED-002',
        authorId: 'usr-med-03',
        authorName: 'Claire Dubois',
        authorRole: 'Medical Regulatory Officer',
        authorCompany: 'CardioPulse Therapeutics',
        content: 'Reviewing CoC against FDA 510(k) master file. Everything aligns. Pending formal sign-off in the baseline release step.',
        mentions: ['Elena Rostova'],
        attachments: [],
        reactions: [
          { emoji: '👍', count: 1, users: ['Elena Rostova'] }
        ],
        createdAt: '2026-08-27T06:40:00Z'
      }
    ]
  },
  {
    id: 'TH-IOT-003',
    programId: 'prog-iot-801',
    programCode: 'PRG-IOT-801',
    programName: 'Industrial Edge IoT Gateway',
    title: 'Cellular Module (Quectel EG915N) Global Allocation & Alternate Footprint',
    category: 'Supply Chain',
    status: 'open',
    priority: 'medium',
    createdBy: 'Michael Chang (Lead Sourcing Manager)',
    createdAt: '2026-08-24T14:15:00Z',
    lastActivity: '2026-08-26T16:00:00Z',
    participants: [
      { id: 'usr-sc-01', name: 'Michael Chang', role: 'Global Sourcing Desk', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { id: 'usr-iot-02', name: 'Jordan Hayes', role: 'Hardware PM', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' }
    ],
    commentsCount: 3,
    unread: false,
    tags: ['BOM', 'Alternate Part', 'LTE Cat-1', 'Lead Time'],
    comments: [
      {
        id: 'cmt-301',
        threadId: 'TH-IOT-003',
        authorId: 'usr-sc-01',
        authorName: 'Michael Chang',
        authorRole: 'Global Sourcing Desk',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Lead time for primary Quectel EG915N-EU extended from 6 weeks to 18 weeks due to baseband foundry switch. We have secured 2,500 units of Telit Cinterion ELS62-W (pin-compatible with dual-pad solder land).',
        mentions: ['Jordan Hayes'],
        attachments: [
          {
            id: 'att-05',
            fileName: 'Telit_vs_Quectel_Dual_Footprint_Fit.pdf',
            fileSize: '4.2 MB',
            fileType: 'PDF',
            uploadedBy: 'Michael Chang',
            uploadedAt: '2026-08-24T14:20:00Z'
          }
        ],
        reactions: [
          { emoji: '💡', count: 2, users: ['Jordan Hayes', 'David Kim'] }
        ],
        createdAt: '2026-08-24T14:25:00Z'
      },
      {
        id: 'cmt-302',
        threadId: 'TH-IOT-003',
        authorId: 'usr-iot-02',
        authorName: 'Jordan Hayes',
        authorRole: 'Hardware PM',
        authorCompany: 'OmniGrid Networks',
        content: 'Our firmware team verified AT command set compatibility over UART2. Telit ELS62-W approved as second-source alternate in the interactive BOM.',
        mentions: ['Michael Chang'],
        attachments: [],
        reactions: [
          { emoji: '🤝', count: 3, users: ['Michael Chang', 'David Kim', 'Sarah Chen'] }
        ],
        createdAt: '2026-08-25T10:15:00Z'
      },
      {
        id: 'cmt-303',
        threadId: 'TH-IOT-003',
        authorId: 'usr-sc-01',
        authorName: 'Michael Chang',
        authorRole: 'Global Sourcing Desk',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Purchase order #PO-2026-9042 issued. Stock arriving at Austin Depot by Sept 4th.',
        mentions: ['Jordan Hayes'],
        attachments: [],
        reactions: [
          { emoji: '📦', count: 1, users: ['Jordan Hayes'] }
        ],
        createdAt: '2026-08-26T16:00:00Z'
      }
    ]
  },
  {
    id: 'TH-ROB-004',
    programId: 'prog-rob-101',
    programCode: 'PRG-ROB-101',
    programName: 'RoboArm Multi-Axis Servo Drive',
    title: 'Hi-Pot Test Spec & Isolation Creepage Distance on Motor Phase Connectors',
    category: 'Assembly & NPI',
    status: 'resolved',
    priority: 'low',
    createdBy: 'Alex Morgan (Test Systems Lead)',
    createdAt: '2026-08-22T11:00:00Z',
    lastActivity: '2026-08-23T15:30:00Z',
    participants: [
      { id: 'usr-test-01', name: 'Alex Morgan', role: 'Test Systems Lead', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
      { id: 'usr-rob-02', name: 'Kenji Sato', role: 'Power Electronics PM', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' }
    ],
    commentsCount: 2,
    unread: false,
    tags: ['Hi-Pot', '3.0kV Isolation', 'Creepage', 'IEC 61800-5-1'],
    comments: [
      {
        id: 'cmt-401',
        threadId: 'TH-ROB-004',
        authorId: 'usr-test-01',
        authorName: 'Alex Morgan',
        authorRole: 'Test Systems Lead',
        authorCompany: 'Nexgile Manufacturing',
        content: 'Verified 3.0kV AC 60s withstand test fixture on Bay 4. Measured phase-to-chassis leakage current is 42 uA (well below the 1000 uA ceiling).',
        mentions: ['Kenji Sato'],
        attachments: [
          {
            id: 'att-06',
            fileName: 'HiPot_Dielectric_Withstand_Log_Sample_12.csv',
            fileSize: '450 KB',
            fileType: 'CSV',
            uploadedBy: 'Alex Morgan',
            uploadedAt: '2026-08-22T11:05:00Z'
          }
        ],
        reactions: [
          { emoji: '⚡', count: 2, users: ['Kenji Sato', 'Elena Rostova'] }
        ],
        createdAt: '2026-08-22T11:10:00Z'
      },
      {
        id: 'cmt-402',
        threadId: 'TH-ROB-004',
        authorId: 'usr-rob-02',
        authorName: 'Kenji Sato',
        authorRole: 'Power Electronics PM',
        authorCompany: 'RoboKinetic Automation',
        content: 'Excellent results. Test fixture test plan approved for PVT pilot build.',
        mentions: ['Alex Morgan'],
        attachments: [],
        reactions: [
          { emoji: '🎯', count: 1, users: ['Alex Morgan'] }
        ],
        createdAt: '2026-08-23T15:30:00Z'
      }
    ]
  }
];

export const INITIAL_COLLABORATION_DOCUMENTS: CollaborationDocument[] = [
  {
    id: 'DOC-AVN-2026-01',
    documentNumber: 'DOC-AVN-STEP-4012',
    title: 'Avionics Gen-4 Master Mechanical 3D CAD Assembly & Thermal Enclosure',
    programId: 'prog-avn-401',
    programCode: 'PRG-AVN-401',
    programName: 'Avionics Gen-4 Control Unit',
    category: 'CAD & Mechanical',
    fileType: 'STEP',
    currentVersion: 'v2.2 Baseline',
    isBaselineLocked: true,
    status: 'Baseline Released',
    ownerName: 'David Kim',
    ownerRole: 'Senior DFM Engineer',
    lastModified: '2026-08-27T06:15:00Z',
    description: 'Complete 3D solid model including CNC milled 6061-T6 aluminum heatsink, conformal coating masks, M12 Mil-Spec circular connectors, and internal RF isolation shield cans.',
    securityClassification: 'Customer Confidential',
    versions: [
      {
        version: 'v2.2 Baseline',
        releaseDate: '2026-08-27T06:00:00Z',
        authorName: 'David Kim',
        authorRole: 'DFM Lead',
        changeSummary: 'Baseline release after underfill standoff spacing adjustment (+0.22mm) and thermal pad thickness revision to 1.5mm.',
        fileSize: '48.6 MB',
        isBaseline: true,
        baselineApprovedBy: 'Dr. Marcus Vance (Chief Architect)',
        baselineDate: '2026-08-27T06:15:00Z'
      },
      {
        version: 'v2.1',
        releaseDate: '2026-08-20T14:30:00Z',
        authorName: 'David Kim',
        authorRole: 'DFM Lead',
        changeSummary: 'Added thermal ribbing on chassis rear; adjusted connector mounting boss torque specs.',
        fileSize: '47.9 MB',
        isBaseline: false
      },
      {
        version: 'v2.0',
        releaseDate: '2026-08-10T09:15:00Z',
        authorName: 'Elena Rostova',
        authorRole: 'Quality Director',
        changeSummary: 'Initial DVT release for tooling review.',
        fileSize: '46.2 MB',
        isBaseline: false
      }
    ],
    approvals: [
      {
        id: 'APP-01',
        roleTitle: 'DFM Engineering Lead',
        approverName: 'David Kim',
        status: 'approved',
        signedAt: '2026-08-27T06:05:00Z',
        notes: 'Tooling draft angles and CNC rib accessibility cleared for Austin plant.'
      },
      {
        id: 'APP-02',
        roleTitle: 'Customer Chief Architect',
        approverName: 'Dr. Marcus Vance',
        status: 'approved',
        signedAt: '2026-08-27T06:12:00Z',
        notes: 'Formal baseline sign-off for DO-254 Flight Test Unit build.'
      },
      {
        id: 'APP-03',
        roleTitle: 'Quality Assurance Director',
        approverName: 'Elena Rostova',
        status: 'approved',
        signedAt: '2026-08-27T06:15:00Z',
        notes: 'AS9100 Rev D audit trail verified and locked.'
      }
    ],
    annotations: [
      {
        id: 'ANN-01',
        documentId: 'DOC-AVN-2026-01',
        version: 'v2.2 Baseline',
        authorName: 'Sarah Chen',
        authorRole: 'SMT Process Specialist',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        xPercent: 42.5,
        yPercent: 38.0,
        pageNumber: 1,
        type: 'pin',
        comment: 'Verify Bergquist Gap Pad 5000S35 compression ratio does not exert > 12 psi on FPGA die corner solder balls.',
        createdAt: '2026-08-27T06:20:00Z',
        status: 'resolved',
        replies: [
          {
            id: 'rep-01',
            authorName: 'David Kim',
            authorRole: 'DFM Lead',
            text: 'FEM FEA simulation confirmed max stress is 7.4 psi at full torque clamping.',
            createdAt: '2026-08-27T06:30:00Z'
          }
        ]
      },
      {
        id: 'ANN-02',
        documentId: 'DOC-AVN-2026-01',
        version: 'v2.2 Baseline',
        authorName: 'Dr. Marcus Vance',
        authorRole: 'Chief Avionics Architect',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        xPercent: 68.0,
        yPercent: 74.0,
        pageNumber: 1,
        type: 'box',
        widthPercent: 18.0,
        heightPercent: 12.0,
        comment: 'Keepout clearance around SMA RF connector mounting threads passed 3.5mm safety margin.',
        createdAt: '2026-08-27T06:45:00Z',
        status: 'open',
        replies: []
      }
    ]
  },
  {
    id: 'DOC-AVN-2026-02',
    documentNumber: 'DOC-AVN-GERB-4014',
    title: 'Avionics Gen-4 12-Layer High-Speed Rigid-Flex Gerber & ODB++ Data Package',
    programId: 'prog-avn-401',
    programCode: 'PRG-AVN-401',
    programName: 'Avionics Gen-4 Control Unit',
    category: 'PCB & Gerber EDA',
    fileType: 'GERBER',
    currentVersion: 'v2.2 Baseline',
    isBaselineLocked: true,
    status: 'Baseline Released',
    ownerName: 'David Kim',
    ownerRole: 'Senior DFM Engineer',
    lastModified: '2026-08-27T07:00:00Z',
    description: '12-layer stackup with Nelco N4000-13 high-speed laminate, controlled impedance 50-ohm single ended / 100-ohm diff pairs, blind & buried microvias (L1-L2, L11-L12).',
    securityClassification: 'Customer Confidential',
    versions: [
      {
        version: 'v2.2 Baseline',
        releaseDate: '2026-08-27T07:00:00Z',
        authorName: 'David Kim',
        authorRole: 'DFM Lead',
        changeSummary: 'Adjusted solder mask dam clearance to 3.8 mil around U102 BGA; finalized drill table.',
        fileSize: '14.2 MB',
        isBaseline: true,
        baselineApprovedBy: 'Dr. Marcus Vance',
        baselineDate: '2026-08-27T07:05:00Z'
      },
      {
        version: 'v2.1',
        releaseDate: '2026-08-24T18:00:00Z',
        authorName: 'David Kim',
        authorRole: 'DFM Lead',
        changeSummary: 'Updated testpoint keepouts for Flying Probe ICT fixture.',
        fileSize: '13.9 MB',
        isBaseline: false
      }
    ],
    approvals: [
      {
        id: 'APP-04',
        roleTitle: 'PCB Fabrication CAM Engineer',
        approverName: 'Hao Zhang',
        status: 'approved',
        signedAt: '2026-08-27T07:02:00Z',
        notes: 'IPC-6012 Class 3 / MIL-PRF-31032 CAM verification complete.'
      },
      {
        id: 'APP-05',
        roleTitle: 'Test Engineering Lead',
        approverName: 'Alex Morgan',
        status: 'approved',
        signedAt: '2026-08-27T07:04:00Z',
        notes: '99.4% testpoint coverage on unmasked pads.'
      }
    ],
    annotations: []
  },
  {
    id: 'DOC-AVN-2026-03',
    documentNumber: 'DOC-AVN-BOM-4018',
    title: 'Master Engineering Bill of Materials (eBOM & mBOM with Sourcing Signals)',
    programId: 'prog-avn-401',
    programCode: 'PRG-AVN-401',
    programName: 'Avionics Gen-4 Control Unit',
    category: 'BOM & Schematics',
    fileType: 'BOM_CSV',
    currentVersion: 'v2.2 Baseline',
    isBaselineLocked: true,
    status: 'Baseline Released',
    ownerName: 'Michael Chang',
    ownerRole: 'Global Sourcing Desk',
    lastModified: '2026-08-27T07:30:00Z',
    description: 'Consolidated 248-line Bill of Materials with live distributor API inventory signals, lifecycle health indicators, second-source qualification flags, and RoHS/REACH certificates.',
    securityClassification: 'Customer Confidential',
    versions: [
      {
        version: 'v2.2 Baseline',
        releaseDate: '2026-08-27T07:30:00Z',
        authorName: 'Michael Chang',
        authorRole: 'Global Sourcing Desk',
        changeSummary: 'Second source alternate locked for U304 buck converter and clock buffer ICs.',
        fileSize: '820 KB',
        isBaseline: true,
        baselineApprovedBy: 'Michael Chang & Dr. Marcus Vance',
        baselineDate: '2026-08-27T07:35:00Z'
      }
    ],
    approvals: [
      {
        id: 'APP-06',
        roleTitle: 'Component Engineering',
        approverName: 'Michael Chang',
        status: 'approved',
        signedAt: '2026-08-27T07:32:00Z',
        notes: '100% active lifecycle parts; no single-source critical items without 18-month stock buffers.'
      }
    ],
    annotations: []
  },
  {
    id: 'DOC-MED-2026-01',
    documentNumber: 'DOC-MED-WI-2021',
    title: 'CardioPulse Medical Cleanroom SMT Assembly & Automated Optical Inspection Work Instructions',
    programId: 'prog-med-202',
    programCode: 'PRG-MED-202',
    programName: 'CardioPulse Medical Monitor',
    category: 'Work Instructions',
    fileType: 'PDF',
    currentVersion: 'v1.4',
    isBaselineLocked: false,
    status: 'Under Review',
    ownerName: 'Sarah Chen',
    ownerRole: 'SMT Process Specialist',
    lastModified: '2026-08-26T14:10:00Z',
    description: 'ISO 13485 compliant step-by-step manufacturing SOP for ISO Class 7 Cleanroom Bay 3, including solder paste inspection parameters, Koh Young 3D AOI algorithm tolerances, and robotic conformal coating.',
    securityClassification: 'Plant Restricted',
    versions: [
      {
        version: 'v1.4',
        releaseDate: '2026-08-26T14:00:00Z',
        authorName: 'Sarah Chen',
        authorRole: 'SMT Process Specialist',
        changeSummary: 'Updated ESD wrist-strap continuous monitor check frequency and HumiSeal 1A33 cure profile.',
        fileSize: '18.5 MB',
        isBaseline: false
      },
      {
        version: 'v1.3',
        releaseDate: '2026-08-12T10:00:00Z',
        authorName: 'Sarah Chen',
        authorRole: 'SMT Process Specialist',
        changeSummary: 'Initial release for IQ/OQ/PQ validation run.',
        fileSize: '17.8 MB',
        isBaseline: false
      }
    ],
    approvals: [
      {
        id: 'APP-07',
        roleTitle: 'Quality Assurance Director',
        approverName: 'Elena Rostova',
        status: 'approved',
        signedAt: '2026-08-26T16:00:00Z',
        notes: 'Compliant with GMP 21 CFR Part 820.'
      },
      {
        id: 'APP-08',
        roleTitle: 'Medical Regulatory Officer',
        approverName: 'Claire Dubois',
        status: 'pending',
        notes: 'Reviewing biocompatibility section 4.2.'
      }
    ],
    annotations: [
      {
        id: 'ANN-03',
        documentId: 'DOC-MED-2026-01',
        version: 'v1.4',
        authorName: 'Claire Dubois',
        authorRole: 'Medical Regulatory Officer',
        xPercent: 50.0,
        yPercent: 62.0,
        pageNumber: 4,
        type: 'highlight',
        comment: 'Please verify that the batch number of HumiSeal 1A33 is logged in the electronic DHR prior to curing.',
        createdAt: '2026-08-26T17:20:00Z',
        status: 'open',
        replies: []
      }
    ]
  },
  {
    id: 'DOC-IOT-2026-01',
    documentNumber: 'DOC-IOT-TEST-8011',
    title: 'Industrial Edge IoT Gateway End-of-Line Functional & Environmental Test Plan',
    programId: 'prog-iot-801',
    programCode: 'PRG-IOT-801',
    programName: 'Industrial Edge IoT Gateway',
    category: 'Quality & Test Plans',
    fileType: 'PDF',
    currentVersion: 'v2.0 Baseline',
    isBaselineLocked: true,
    status: 'Baseline Released',
    ownerName: 'Alex Morgan',
    ownerRole: 'Test Systems Lead',
    lastModified: '2026-08-25T11:00:00Z',
    description: 'Complete EOL automated test sequence: LTE Cat-1 RSSI calibration, RS485 transceiver loopback, Secure Boot cryptographic hash validation, and 4-hour thermal soak chamber cycling (-40C to +85C).',
    securityClassification: 'Customer Confidential',
    versions: [
      {
        version: 'v2.0 Baseline',
        releaseDate: '2026-08-25T11:00:00Z',
        authorName: 'Alex Morgan',
        authorRole: 'Test Systems Lead',
        changeSummary: 'Baseline signoff for mass production ramp.',
        fileSize: '8.4 MB',
        isBaseline: true,
        baselineApprovedBy: 'Alex Morgan & Jordan Hayes',
        baselineDate: '2026-08-25T11:30:00Z'
      }
    ],
    approvals: [
      {
        id: 'APP-09',
        roleTitle: 'Hardware PM',
        approverName: 'Jordan Hayes',
        status: 'approved',
        signedAt: '2026-08-25T11:20:00Z'
      }
    ],
    annotations: []
  }
];

export const INITIAL_CAD_MODELS: Cad3DModel[] = [
  {
    id: 'CAD-AVN-401',
    name: 'Avionics Gen-4 Flight Enclosure & PCBA Assembly',
    programCode: 'PRG-AVN-401',
    revision: 'Rev 2.2 Baseline',
    format: 'STEP AP242 / SolidWorks 2026',
    polyCount: 142850,
    dimensions: '185mm x 142mm x 38mm (L x W x H)',
    description: 'Fully detailed electro-mechanical assembly including ruggedized IP67 CNC chassis, thermal conduction interface, 12-layer rigid-flex PCBA, FPGA shield can, and Mil-Spec circular I/O.',
    parts: [
      {
        id: 'part-top-shell',
        name: 'Top Enclosure Cover (6061-T6 Alodine)',
        category: 'Enclosure',
        material: 'Aluminum 6061-T6 Hard Anodized',
        weightGrams: 285,
        color: '#64748b',
        isVisible: true,
        opacity: 0.92,
        positionOffset: [0, 45, 0]
      },
      {
        id: 'part-heatsink',
        name: 'Thermal Coldplate & Micro-Ribs',
        category: 'Heatsink',
        material: 'Copper-Alloy C11000 Coldplate',
        weightGrams: 142,
        color: '#d97706',
        isVisible: true,
        opacity: 1.0,
        positionOffset: [0, 25, 0]
      },
      {
        id: 'part-rf-shield',
        name: 'RF / EMI Shield Canister Frame',
        category: 'Hardware',
        material: 'Nickel Silver Alloy 770',
        weightGrams: 24,
        color: '#94a3b8',
        isVisible: true,
        opacity: 0.85,
        positionOffset: [0, 14, 0]
      },
      {
        id: 'part-main-pcba',
        name: 'Main Logic Board (12-Layer Rigid-Flex)',
        category: 'PCB',
        material: 'Nelco N4000-13 / Polyimide Flex Core',
        weightGrams: 98,
        color: '#059669',
        isVisible: true,
        opacity: 1.0,
        positionOffset: [0, 0, 0]
      },
      {
        id: 'part-fpga-soc',
        name: 'UltraScale+ FPGA SoC (U102 BGA)',
        category: 'IC',
        material: 'FCBGA 1156 Ceramic Substrate',
        weightGrams: 18,
        color: '#1e293b',
        isVisible: true,
        opacity: 1.0,
        positionOffset: [-15, 2, -10]
      },
      {
        id: 'part-connectors',
        name: 'Mil-Spec D38999 Circular Connectors (J1/J2)',
        category: 'Connector',
        material: 'Stainless Steel / Gold Plated Brass Pins',
        weightGrams: 64,
        color: '#e2e8f0',
        isVisible: true,
        opacity: 1.0,
        positionOffset: [75, 0, 0]
      },
      {
        id: 'part-bottom-tray',
        name: 'Chassis Baseplate & Mounting Flanges',
        category: 'Enclosure',
        material: 'Aluminum 6061-T6 with MIL-DTL-5541 Chem Film',
        weightGrams: 310,
        color: '#475569',
        isVisible: true,
        opacity: 1.0,
        positionOffset: [0, -35, 0]
      }
    ]
  }
];

export const INITIAL_GERBER_PROJECT: GerberProject = {
  id: 'GERB-AVN-401',
  programCode: 'PRG-AVN-401',
  boardName: 'AVN_GEN4_MAIN_LOGIC_REV2.2',
  layerCount: 12,
  thicknessMm: 1.6,
  minTraceClearanceMil: 3.5,
  drcWarningsCount: 0,
  activeNets: [
    '+3V3_SYS_PWR',
    '+1V2_FPGA_CORE',
    'GND_ANALOG_PLANE',
    'GND_DIGITAL_PLANE',
    'SPI_CLK_100M',
    'SPI_MOSI',
    'ETH_TX_DIFF_P',
    'ETH_TX_DIFF_N',
    'CAN_BUS_HIGH',
    'CAN_BUS_LOW',
    'I2C_SDA_SENSORS'
  ],
  layers: [
    {
      id: 'layer-f-silk',
      name: 'Top Silkscreen (F.SilkS)',
      layerCode: 'F.SilkS',
      type: 'silkscreen',
      color: '#f8fafc',
      isVisible: true,
      opacity: 0.9,
      dcodeCount: 1840
    },
    {
      id: 'layer-f-mask',
      name: 'Top Solder Mask (F.Mask)',
      layerCode: 'F.Mask',
      type: 'solder_mask',
      color: '#10b981',
      isVisible: true,
      opacity: 0.75,
      dcodeCount: 3420
    },
    {
      id: 'layer-f-cu',
      name: 'Layer 1: Top Copper High-Speed (F.Cu)',
      layerCode: 'L1 (F.Cu)',
      type: 'top_copper',
      color: '#f59e0b',
      isVisible: true,
      opacity: 1.0,
      dcodeCount: 6890
    },
    {
      id: 'layer-f-paste',
      name: 'Top Solder Paste Stencil (F.Paste)',
      layerCode: 'F.Paste',
      type: 'solder_paste',
      color: '#94a3b8',
      isVisible: false,
      opacity: 0.8,
      dcodeCount: 2950
    },
    {
      id: 'layer-drill',
      name: 'Plated & Non-Plated Drill Holes (PTH / NPTH)',
      layerCode: 'Excellon Drill',
      type: 'drill_holes',
      color: '#38bdf8',
      isVisible: true,
      opacity: 1.0,
      dcodeCount: 4210
    },
    {
      id: 'layer-b-cu',
      name: 'Layer 12: Bottom Ground / Signal (B.Cu)',
      layerCode: 'L12 (B.Cu)',
      type: 'bottom_copper',
      color: '#3b82f6',
      isVisible: true,
      opacity: 0.6,
      dcodeCount: 5120
    }
  ]
};

export const INITIAL_BOM_COMPONENTS: BomComponent[] = [
  {
    id: 'BOM-001',
    refDes: 'U102',
    mpn: 'XCKU040-2FFVA1156I',
    manufacturer: 'AMD / Xilinx',
    description: 'Kintex UltraScale+ FPGA, 1156-FCBGA, Industrial Temp (-40C to 100C)',
    packageFootprint: 'FCBGA-1156 (35x35mm)',
    quantityPerBoard: 1,
    unitCostUSD: 685.00,
    availabilitySignal: 'In Stock',
    leadTimeWeeks: 4,
    globalStockQty: 450,
    secondSourceAvailable: false,
    singleSourceRisk: 'Moderate',
    rohsCompliant: true,
    automotiveGrade: false
  },
  {
    id: 'BOM-002',
    refDes: 'U105',
    mpn: 'STM32H753BIT6',
    manufacturer: 'STMicroelectronics',
    description: 'High-performance ARM Cortex-M7 MCU, 480MHz, 2MB Flash, LQFP-208',
    packageFootprint: 'LQFP-208',
    quantityPerBoard: 1,
    unitCostUSD: 24.50,
    availabilitySignal: 'In Stock',
    leadTimeWeeks: 6,
    globalStockQty: 18200,
    secondSourceAvailable: true,
    secondSourceMpn: 'STM32H743BIT6 (Drop-In)',
    singleSourceRisk: 'None',
    rohsCompliant: true,
    automotiveGrade: true
  },
  {
    id: 'BOM-003',
    refDes: 'U304',
    mpn: 'TPS546D24ARVFR',
    manufacturer: 'Texas Instruments',
    description: 'Synchronous Step-Down DC-DC Converter 40A with PMBus Interface',
    packageFootprint: 'VQFN-40 (5x7mm)',
    quantityPerBoard: 2,
    unitCostUSD: 8.90,
    availabilitySignal: 'Low Stock',
    leadTimeWeeks: 14,
    globalStockQty: 680,
    secondSourceAvailable: true,
    secondSourceMpn: 'LTC3888 (Requires minor rework layout)',
    singleSourceRisk: 'Moderate',
    rohsCompliant: true,
    automotiveGrade: true
  },
  {
    id: 'BOM-004',
    refDes: 'U401',
    mpn: 'KSZ9031RNXIC',
    manufacturer: 'Microchip Technology',
    description: 'Gigabit Ethernet Transceiver PHY, RGMII, 48-QFN',
    packageFootprint: 'QFN-48 (7x7mm)',
    quantityPerBoard: 2,
    unitCostUSD: 4.80,
    availabilitySignal: 'In Stock',
    leadTimeWeeks: 8,
    globalStockQty: 34500,
    secondSourceAvailable: true,
    secondSourceMpn: 'DP83867CRRGZ (TI Pin-Compatible)',
    singleSourceRisk: 'None',
    rohsCompliant: true,
    automotiveGrade: true
  },
  {
    id: 'BOM-005',
    refDes: 'U501',
    mpn: 'MAX3051EKA+T',
    manufacturer: 'Analog Devices / Maxim',
    description: '+3.3V Low-Supply-Current CAN Transceiver, SOT-23-8',
    packageFootprint: 'SOT-23-8',
    quantityPerBoard: 4,
    unitCostUSD: 1.75,
    availabilitySignal: 'In Stock',
    leadTimeWeeks: 2,
    globalStockQty: 84000,
    secondSourceAvailable: true,
    secondSourceMpn: 'TCAN330GD (Texas Instruments)',
    singleSourceRisk: 'None',
    rohsCompliant: true,
    automotiveGrade: true
  },
  {
    id: 'BOM-006',
    refDes: 'C104-C112',
    mpn: 'GRM033R60J105MEA2D',
    manufacturer: 'Murata Manufacturing',
    description: '1.0uF 6.3V 0201 X5R Multi-Layer Ceramic Capacitor (MLCC)',
    packageFootprint: '0201 (0603 Metric)',
    quantityPerBoard: 36,
    unitCostUSD: 0.014,
    availabilitySignal: 'In Stock',
    leadTimeWeeks: 1,
    globalStockQty: 4200000,
    secondSourceAvailable: true,
    secondSourceMpn: 'CL03A105MQ3CSNC (Samsung)',
    singleSourceRisk: 'None',
    rohsCompliant: true,
    automotiveGrade: false
  },
  {
    id: 'BOM-007',
    refDes: 'J1, J2',
    mpn: 'D38999/20WB35PN',
    manufacturer: 'Amphenol Aerospace',
    description: 'Mil-DTL-38999 Series III Receptacle, Olive Drab Cadmium, 13 Contacts',
    packageFootprint: 'Flange Mount Circular',
    quantityPerBoard: 2,
    unitCostUSD: 82.40,
    availabilitySignal: 'Lead Time Alert',
    leadTimeWeeks: 22,
    globalStockQty: 85,
    secondSourceAvailable: true,
    secondSourceMpn: 'MS27467T11B35P (Glenair)',
    singleSourceRisk: 'Critical High',
    rohsCompliant: false,
    automotiveGrade: false
  },
  {
    id: 'BOM-008',
    refDes: 'Q201-Q204',
    mpn: 'CSD18534Q5A',
    manufacturer: 'Texas Instruments',
    description: '60V N-Channel NexFET Power MOSFET, 7.8 mOhm, SON-8',
    packageFootprint: 'SON-8 (5x6mm)',
    quantityPerBoard: 8,
    unitCostUSD: 1.15,
    availabilitySignal: 'In Stock',
    leadTimeWeeks: 5,
    globalStockQty: 125000,
    secondSourceAvailable: true,
    secondSourceMpn: 'IRFH5300TRPBF (Infineon)',
    singleSourceRisk: 'None',
    rohsCompliant: true,
    automotiveGrade: true
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-ART-001',
    slug: 'smt-lead-free-reflow-profiling',
    title: 'Lead-Free SMT Reflow Profiling & Thermal Soak Optimization (SAC305 / Sn96.5Ag3.0Cu0.5)',
    category: 'Manufacturing Processes',
    authorName: 'Sarah Chen',
    authorRole: 'SMT Process Specialist',
    lastUpdated: '2026-08-26',
    version: 'v3.2',
    readTimeMinutes: 6,
    tags: ['SMT', 'Reflow', 'SAC305', 'Thermal Profiling', 'IPC-J-STD-001'],
    isFeatured: true,
    viewsCount: 1420,
    helpfulVotes: 218,
    summary: 'Standard operating guideline for setting 10-zone convection reflow ovens with lead-free SAC305 paste, preventing head-in-pillow (HIP) defects, voiding in QFN thermal pads, and tombstoning on 0201 chips.',
    contentMarkdown: `### 1. Overview of SAC305 Thermal Dynamics
Lead-free alloy **SAC305** melts at **217°C**. Establishing a reliable thermal profile requires balancing flux activation without boiling off volatile solvents prematurely, while ensuring all component bodies remain within maximum package temperature ratings ($\le 260^\circ\\text{C}$).

### 2. Standard 10-Zone Target Parameters
| Stage | Target Temperature Window | Target Ramp Rate / Dwell Time | Critical Control Objectives |
| :--- | :--- | :--- | :--- |
| **Pre-Heat** | Ambient $\\rightarrow 150^\\circ\\text{C}$ | $1.2 - 2.0^\\circ\\text{C}/\\text{sec}$ | Evaporate volatile solvents smoothly; avoid thermal shock on ceramic MLCCs |
| **Thermal Soak** | $150^\\circ\\text{C} \\rightarrow 200^\\circ\\text{C}$ | $60 - 90\\text{ seconds}$ | Equalize temperature between large BGA packages and small chip resistors; activate flux |
| **Peak Reflow (TAL)** | $235^\\circ\\text{C} - 245^\\circ\\text{C}$ | Time Above Liquidus (TAL): $45 - 75\\text{s}$ | Achieve full wetting and intermetallic compound (IMC) thickness of $1 - 3\\,\\mu\\text{m}$ |
| **Cooling** | $245^\\circ\\text{C} \\rightarrow 100^\\circ\\text{C}$ | $-2.5 - -4.0^\\circ\\text{C}/\\text{sec}$ | Form fine grain crystalline microstructure; prevent joint embrittlement |

### 3. Mitigating Common Defects
* **Head-in-Pillow (HIP) on Fine-Pitch BGAs**: Maintain soak time under 90s to avoid exhausting active flux before liquidus. Ensure PCB warpage stays $< 0.5\\%$.
* **QFN Thermal Pad Voiding ($< 15\\%$)**: Use window-pane stencil apertures with $50\\% - 70\\%$ area coverage rather than a solid aperture block.
* **0201 Tombstoning**: Verify thermal symmetry across both pads. Ensure copper traces entering each pad are equalized in trace width or have thermal relief neckdowns.`
  },
  {
    id: 'KB-ART-002',
    slug: 'iso-13485-cleanroom-traceability',
    title: 'ISO 13485 Medical Device Cleanroom Controls & DHR Electronic Traceability',
    category: 'Quality Standards',
    authorName: 'Elena Rostova',
    authorRole: 'Quality Assurance Director',
    lastUpdated: '2026-08-25',
    version: 'v2.8',
    readTimeMinutes: 8,
    tags: ['ISO13485', 'Cleanroom', 'FDA', 'DHR', 'Class 7', 'ESD'],
    isFeatured: true,
    viewsCount: 980,
    helpfulVotes: 164,
    summary: 'Detailed operational protocol for Class 7 (ISO 10,000) cleanroom bays, particulate counting telemetry, gowning validations, and automated Device History Record (eDHR) serialization.',
    contentMarkdown: `### 1. Cleanroom Environmental Limits (ISO Class 7)
* **Maximum Airborne Particles**: $\\le 352,000\\text{ particles}/\\text{m}^3$ at $\\ge 0.5\\,\\mu\\text{m}$; $\\le 83,200\\text{ particles}/\\text{m}^3$ at $\\ge 1.0\\,\\mu\\text{m}$.
* **Positive Differential Pressure**: $\\ge 15\\text{ Pascals}$ relative to gowning anterooms.
* **Continuous Monitoring**: Particle counters sample every 60 seconds. Any spike above $250,000/\\text{m}^3$ triggers automated line hold.

### 2. Device History Record (eDHR) Serial Tracking
Every PCBA traveling through the medical line must have:
1. **2D DataMatrix (ECC200)** laser-etched directly onto PCB top edge.
2. **Component-to-Board Binding**: Pick-and-place feeders scan barcode reels to guarantee lot trace.
3. **Automated Torque & Potting Records**: Screwdriver digital controllers log exact torque ($N\\cdot m$) and angle into the central MES database.`
  },
  {
    id: 'KB-ART-003',
    slug: 'flying-probe-vs-bed-of-nails-ict',
    title: 'Test Engineering: Flying Probe vs. Bed-of-Nails ICT Setup & Coverage Optimization',
    category: 'Test Procedures',
    authorName: 'Alex Morgan',
    authorRole: 'Test Systems Lead',
    lastUpdated: '2026-08-24',
    version: 'v1.9',
    readTimeMinutes: 5,
    tags: ['Testing', 'ICT', 'Flying Probe', 'Bed-of-Nails', 'Boundary Scan', 'DFT'],
    isFeatured: false,
    viewsCount: 750,
    helpfulVotes: 112,
    summary: 'Decision matrix and DFM testpoint design guidelines comparing high-mix flying probe testing (Takaya APT-1400F) against high-volume vacuum bed-of-nails fixtures.',
    contentMarkdown: `### 1. Method Comparison
* **Flying Probe (Takaya APT-1400F)**:
  * NRE Cost: **$0 fixture cost**; software generation in 4-8 hours.
  * Cycle Time: 45 - 180 seconds per board.
  * Best for: Prototype spins, EVT/DVT batches, and board volumes $< 2,000\\text{ units/year}$.
* **Bed-of-Nails (Keysight i3070 / Teradyne)**:
  * NRE Cost: $8,000 - $18,000 custom mechanical test fixture.
  * Cycle Time: 8 - 18 seconds per board.
  * Best for: Mass Production (PVT & Ramp), high volume $> 10,000\\text{ units/year}$.

### 2. DFT (Design for Test) Layout Rules
* Minimum testpad diameter: **28 mil (0.71mm)** for flying probe, **35 mil (0.89mm)** for bed-of-nails.
* Testpad-to-component body clearance: $\\ge 20\\text{ mil}$ to prevent probe collision with tall inductors or electrolytic caps.`
  },
  {
    id: 'KB-ART-004',
    slug: 'ems-high-density-01005-placement',
    title: 'EMS Plant Capabilities: 01005 Chip Placement, 0.3mm BGA Pitch & High-Speed SMT Capabilities',
    category: 'EMS Capabilities',
    authorName: 'David Kim',
    authorRole: 'Senior DFM Engineer',
    lastUpdated: '2026-08-20',
    version: 'v4.0',
    readTimeMinutes: 7,
    tags: ['EMS Capabilities', '01005', 'MicroBGA', '3D AOI', 'Plant Specs'],
    isFeatured: false,
    viewsCount: 1890,
    helpfulVotes: 340,
    summary: 'Technical specifications, machine tolerances, feeder capacities, and inspection limits across Austin, Guadalajara, and Penang facilities.',
    contentMarkdown: `### SMT & Assembly Machine Specifications
* **Pick & Place**: Panasonic NPM-D3 / ASM Siplace TX2 with $25\\,\\mu\\text{m}$ placement accuracy @ 3-sigma.
* **Component Capabilities**: 01005 (0402 Metric), 0201, 0.3mm pitch Micro-BGA, PoP (Package-on-Package), odd-form connectors.
* **Automated Inspection**: Koh Young KY8030-3 3D SPI (Solder Paste Inspection) & Zenith 3D AOI with true 3D height profiling.
* **Conformal Coating**: Nordson Asymtek Select Coat SL-940 with dual-atomizing swirl spray and UV tracer inspection.`
  }
];

export const INITIAL_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'FAQ-01',
    category: 'DFM & Engineering',
    question: 'What is the standard turnaround time for a complete DFM (Design for Manufacturability) Review?',
    answer: 'Standard DFM turnaround is 24 to 48 hours from receipt of complete EDA Gerber / ODB++ packages and Bill of Materials. For expedited NPI prototypes, our fast-track DFM review desk offers an express 4-hour review SLA.',
    relatedArticleId: 'KB-ART-004',
    lastVerified: '2026-08-20'
  },
  {
    id: 'FAQ-02',
    category: 'DFM & Engineering',
    question: 'What file formats are preferred for 3D Mechanical and PCBA verification?',
    answer: 'We prefer native STEP AP242 / AP214 format for 3D CAD models, ODB++ or IPC-2581 for PCB layout, and Excel / CSV for Bill of Materials with explicit Manufacturer Part Numbers (MPN) and Reference Designators.',
    relatedArticleId: 'KB-ART-004',
    lastVerified: '2026-08-22'
  },
  {
    id: 'FAQ-03',
    category: 'Production & SMT',
    question: 'How do you prevent solder voids in high-power QFN thermal pads and bottom-terminated components?',
    answer: 'We utilize laser-cut electro-polished stepped stencils with window-pane aperture reductions (50% to 70% paste area coverage) coupled with multi-zone vacuum reflow (Ersa EXOS) reducing thermal pad voiding to under 8%.',
    relatedArticleId: 'KB-ART-001',
    lastVerified: '2026-08-24'
  },
  {
    id: 'FAQ-04',
    category: 'Quality & PPAP',
    question: 'What quality documentation is included with First Article Inspection (FAI) reports?',
    answer: 'Each FAI package includes AS9102 / IPC-A-610 compliant dimensional balloon drawings, 3D SPI height distribution histograms, cross-section microsection solder joint metallurgical photos, component RoHs/REACH material declarations, and signed Certificates of Conformance.',
    relatedArticleId: 'KB-ART-002',
    lastVerified: '2026-08-25'
  },
  {
    id: 'FAQ-05',
    category: 'RMA & Reverse Logistics',
    question: 'What is the standard Turnaround Time (TAT) for depot-level warranty diagnostics and repairs?',
    answer: 'Standard warranty depot repair TAT is 5 business days from dock intake to final QA outgoing inspection. Expedited 48-hour TAT is available under Tier 1 Mission-Critical SLA agreements.',
    lastVerified: '2026-08-26'
  }
];

export const INITIAL_CONTACT_SLAS: ContactSla[] = [
  {
    id: 'SLA-01',
    teamName: 'DFM & Engineering Review Desk',
    department: 'NPI Engineering',
    primaryContact: 'David Kim (Lead DFM Engineer)',
    email: 'dfm-desk@nexgile-manufacturing.com',
    phone: '+1 (512) 890-4100',
    location: 'Austin NPI Tech Center',
    timeZone: 'CST (UTC-6)',
    availabilityStatus: 'Available',
    responseSlaHours: 4,
    urgentEscalationSlaHours: 1,
    coverageWindow: '24/5 Global Coverage',
    responsibilities: [
      'Gerber & ODB++ CAM Rule Verification',
      'BGA Escape & Solder Mask Clearance Checks',
      '3D Mechanical Interference & Heatsink Fit',
      'Panelization & Tooling Rails Optimization'
    ],
    activeTicketsCount: 3
  },
  {
    id: 'SLA-02',
    teamName: 'NPI Launch & Program Management',
    department: 'Customer Operations',
    primaryContact: 'Sarah Chen (Senior NPI Program Lead)',
    email: 'npi-ops@nexgile-manufacturing.com',
    phone: '+1 (512) 890-4220',
    location: 'Austin Plant & Global Ops',
    timeZone: 'CST (UTC-6)',
    availabilityStatus: 'On Shift',
    responseSlaHours: 2,
    urgentEscalationSlaHours: 0.5,
    coverageWindow: '24/7 Priority Support',
    responsibilities: [
      'Gantt Milestone Tracking & EVT/DVT/PVT Gates',
      'Line Staging, SMT Feeder Scheduling & Build Slots',
      'Engineering Change Order (ECN) Execution',
      'Executive Milestone Status Briefings'
    ],
    activeTicketsCount: 5
  },
  {
    id: 'SLA-03',
    teamName: 'Global Component Sourcing & Allocation Desk',
    department: 'Supply Chain',
    primaryContact: 'Michael Chang (Lead Sourcing Manager)',
    email: 'sourcing-desk@nexgile-manufacturing.com',
    phone: '+1 (512) 890-4350',
    location: 'Austin & Singapore Procurement Hub',
    timeZone: 'EST / SGT (24h)',
    availabilityStatus: 'Available',
    responseSlaHours: 4,
    urgentEscalationSlaHours: 2,
    coverageWindow: '24/5 Procurement Window',
    responsibilities: [
      'BOM Lead Time Scrubbing & Allocation Mitigation',
      'Form-Fit-Function (FFF) Alternate Qualifications',
      'Long-Time-Buy (LTB) Nitrogen Vault Storage Contracts',
      'Tier-1 Semiconductor Direct Foundry Allocations'
    ],
    activeTicketsCount: 8
  },
  {
    id: 'SLA-04',
    teamName: 'Quality, Regulatory & Cleanroom QA',
    department: 'Quality Assurance',
    primaryContact: 'Elena Rostova (Quality Director)',
    email: 'quality-compliance@nexgile-manufacturing.com',
    phone: '+1 (512) 890-4480',
    location: 'Austin Cleanroom Complex Bay 3',
    timeZone: 'CST (UTC-6)',
    availabilityStatus: 'In DFM Review',
    responseSlaHours: 6,
    urgentEscalationSlaHours: 2,
    coverageWindow: '07:00 - 19:00 CST',
    responsibilities: [
      'ISO 13485 / AS9100 / IATF 16949 Audits',
      'First Article Inspection (FAI) & PPAP Level 3 Packs',
      '8D Root Cause Corrective Action (CAPA)',
      'Cleanroom Differential Pressure & Particle Telemetry'
    ],
    activeTicketsCount: 2
  },
  {
    id: 'SLA-05',
    teamName: 'Test Systems & ICT Development',
    department: 'Test Engineering',
    primaryContact: 'Alex Morgan (Senior Test Lead)',
    email: 'test-systems@nexgile-manufacturing.com',
    phone: '+1 (512) 890-4590',
    location: 'Austin Test Bay 4',
    timeZone: 'CST (UTC-6)',
    availabilityStatus: 'Available',
    responseSlaHours: 6,
    urgentEscalationSlaHours: 2,
    coverageWindow: '08:00 - 18:00 CST',
    responsibilities: [
      'Flying Probe & Bed-of-Nails Fixture Programming',
      'Boundary Scan (JTAG / IEEE 1149.1) Coverage',
      '3.0kV Hi-Pot & Dielectric Isolation Fixtures',
      'Burn-In Thermal Soak Chamber Programming'
    ],
    activeTicketsCount: 4
  }
];
