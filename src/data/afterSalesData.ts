import {
  RMARequest,
  RepairRecord,
  WarrantyLookupRecord,
  WarrantyClaim,
  FailureTrendDataPoint,
  SparePart,
  SparePartOrder,
  EOLNotice,
  LTBProgram,
  LongTermStorageItem,
  RedesignMigrationProject
} from '../types';

// ==========================================
// 1. RMA REQUESTS & TRIAGE MOCK DATA
// ==========================================

export const mockRMARequests: RMARequest[] = [
  {
    id: 'rma-001',
    rmaNumber: 'RMA-2026-0891',
    customerName: 'AeroDynamics Global Corp',
    programCode: 'PRG-AVIONIC-09',
    productName: 'Flight Navigation Controller Mainboard (Rev D)',
    partNumber: '700-0921-04',
    serialNumber: 'SN-AV-2024-8891',
    lotCode: 'LOT-2024-W38',
    requestDate: '2026-08-18',
    reasonCode: 'Field Operational Failure',
    customerNotes: 'Unit experienced intermittent power rail drop-outs while operating under high vibration in flight test bench. Error code ERR_3301 logged.',
    failureSymptoms: '3.3V rail falls below 2.85V threshold during high current draw; MCU enters brownout reset loop.',
    operatingHours: 1420,
    environmentCondition: 'Avionics bay pressurized chassis, 45°C ambient, random vibration profile.',
    warrantyStatus: 'Under Extended Gold SLA',
    triageStatus: 'In Repair / Rework Bay',
    triageAssignedTo: 'Marcus Vance (Senior Avionics Repair Tech)',
    depotFacility: 'austin',
    priority: 'Critical (AOG / Line Stop)',
    estimatedRepairDays: 3,
    shippingLabel: {
      trackingNumber: '7946 9912 3014',
      carrier: 'FedEx Priority',
      serviceSpeed: 'First Overnight AOG Priority',
      shipFrom: {
        name: 'David Sterling',
        company: 'AeroDynamics Global Testing Depot',
        address: '8400 Aviation Way, Hangar 4',
        city: 'Seattle, WA 98108',
        country: 'USA',
        contactPhone: '+1 (206) 555-0192'
      },
      shipTo: {
        facilityName: 'Austin Giga-1 EMS Depot & Repair Hub',
        address: '10800 Tech Center Blvd, Dock 4A',
        dockCode: 'DOCK-4A-AOG',
        attention: 'Attn: RMA Depot Triage - RMA-2026-0891'
      },
      barcodeValue: 'RMA-2026-0891*794699123014*PRG-AVIONIC-09',
      labelCreatedDate: '2026-08-18',
      packageWeightKg: 1.85,
      customsDeclarationValueUSD: 4200
    },
    workflowSteps: [
      { stepName: 'RMA Request Submitted', timestamp: '2026-08-18 09:15', completedBy: 'David Sterling (Customer)', status: 'completed' },
      { stepName: 'Technical Triage & Authorization', timestamp: '2026-08-18 10:40', completedBy: 'Austin RMA Triage Engineer', notes: 'Verified Gold SLA contract & serial pedigree. Approved for AOG fast-track.', status: 'completed' },
      { stepName: 'Prepaid AOG Shipping Label Issued', timestamp: '2026-08-18 10:45', completedBy: 'Automated Depot Logistics', status: 'completed' },
      { stepName: 'Inbound In-Transit to Austin Depot', timestamp: '2026-08-19 08:30', completedBy: 'FedEx Priority', notes: 'Delivered at Austin Inbound Dock 4A', status: 'completed' },
      { stepName: 'Depot Intake & De-casing Inspection', timestamp: '2026-08-19 11:15', completedBy: 'Marcus Vance', notes: 'No external physical casing damage. ESD seals intact.', status: 'completed' },
      { stepName: 'Failure Analysis & Automated Diagnostics', timestamp: '2026-08-20 14:00', completedBy: 'Diagnostics Lab (Station D-03)', notes: 'Root cause confirmed: Buck regulator switching MOSFET Q14 thermal fatigue.', status: 'completed' },
      { stepName: 'Component Rework & Solder Replacement', timestamp: '2026-08-21 16:30', completedBy: 'Marcus Vance', notes: 'Replaced Q14 and filter capacitor C102. Conformal coating recoated.', status: 'completed' },
      { stepName: 'Final Test & 24hr Burn-In Testing', timestamp: 'In Progress (18/24 hrs)', completedBy: 'QA Test Bench #4', notes: 'Passed ICT & Functional. Currently under 50°C thermal cycle chamber.', status: 'in_progress' },
      { stepName: 'QA Release & Outbound Dispatch', status: 'pending' }
    ]
  },
  {
    id: 'rma-002',
    rmaNumber: 'RMA-2026-0892',
    customerName: 'MediPulse Therapeutics',
    programCode: 'PRG-MED-04',
    productName: 'Smart Infusion Pump Core Telemetry Board',
    partNumber: '820-4100-02',
    serialNumber: 'SN-MED-9921',
    lotCode: 'LOT-2025-W12',
    requestDate: '2026-08-20',
    reasonCode: 'Calibration / Sensor Drift',
    customerNotes: 'Clinic reported flow rate measurement variance exceeding ±2.5% ISO threshold during annual field re-certification.',
    failureSymptoms: 'Optical flow sensor transducer channel B reports +4.1% offset at low infusion flow rates (10 mL/hr).',
    operatingHours: 3600,
    environmentCondition: 'Hospital ICU bedside ward, cleanroom Class 100k equivalent.',
    warrantyStatus: 'Under Standard Warranty',
    triageStatus: 'Bench Testing / Diagnostics',
    triageAssignedTo: 'Elena Rostova (Biomedical Systems QA Specialist)',
    depotFacility: 'austin',
    priority: 'High',
    estimatedRepairDays: 4,
    shippingLabel: {
      trackingNumber: '1Z992A0102938192',
      carrier: 'UPS Worldwide',
      serviceSpeed: 'UPS 2nd Day Air Medical',
      shipFrom: {
        name: 'Rachel Adams',
        company: 'St. Jude Biomedical Engineering Lab',
        address: '262 Danny Thomas Pl',
        city: 'Memphis, TN 38105',
        country: 'USA',
        contactPhone: '+1 (901) 555-3211'
      },
      shipTo: {
        facilityName: 'Austin Giga-1 Medical ISO 13485 Service Bay',
        address: '10800 Tech Center Blvd, Bay Med-2',
        dockCode: 'DOCK-MED-13485',
        attention: 'Attn: Medical Device RMA Intake - RMA-2026-0892'
      },
      barcodeValue: 'RMA-2026-0892*1Z992A0102938192*PRG-MED-04',
      labelCreatedDate: '2026-08-20',
      packageWeightKg: 0.95,
      customsDeclarationValueUSD: 2800
    },
    workflowSteps: [
      { stepName: 'RMA Request Submitted', timestamp: '2026-08-20 14:10', completedBy: 'Rachel Adams (Customer)', status: 'completed' },
      { stepName: 'Technical Triage & Authorization', timestamp: '2026-08-21 08:30', completedBy: 'Medical Service Mgr', status: 'completed' },
      { stepName: 'Prepaid Medical Return Label Issued', timestamp: '2026-08-21 08:35', completedBy: 'Automated Depot Logistics', status: 'completed' },
      { stepName: 'Received at Austin Depot', timestamp: '2026-08-24 10:20', completedBy: 'Elena Rostova', status: 'completed' },
      { stepName: 'Biomedical Decontamination & Verification', timestamp: '2026-08-24 13:00', completedBy: 'Elena Rostova', notes: 'Cleaned and certified safe for handling.', status: 'completed' },
      { stepName: 'Optoelectronic Sensor Calibration Bench', timestamp: 'In Progress', completedBy: 'Elena Rostova', notes: 'Running 5-point NIST traceable micro-flow laser calibration.', status: 'in_progress' },
      { stepName: 'Sensor Replacement or Recalibration', status: 'pending' },
      { stepName: 'ISO 13485 Medical Re-verification & Sign-off', status: 'pending' }
    ]
  },
  {
    id: 'rma-003',
    rmaNumber: 'RMA-2026-0893',
    customerName: 'VoltDrive EV Technologies',
    programCode: 'PRG-AUTO-02',
    productName: 'Automotive LiDAR Front Array Sensor Unit',
    partNumber: '610-8800-05',
    serialNumber: 'SN-LDR-7731',
    lotCode: 'LOT-2024-W49',
    requestDate: '2026-08-22',
    reasonCode: 'Physical / Connector Damage',
    customerNotes: 'Automotive vehicle wiring harness was forcibly disconnected during vehicle body servicing, damaging the 24-pin high-density automotive connector.',
    failureSymptoms: 'Pins #7, #8 bent, locking latch tab fractured. Internal PCB undamaged.',
    operatingHours: 850,
    environmentCondition: 'Automotive front bumper cavity, exterior IP67 rated enclosure.',
    warrantyStatus: 'Out of Warranty (Billable)',
    triageStatus: 'Received at Depot',
    triageAssignedTo: 'Carlos Mendoza (Automotive Rework Specialist)',
    depotFacility: 'guadalajara',
    priority: 'Standard',
    estimatedRepairDays: 5,
    shippingLabel: {
      trackingNumber: 'DHL-EX-990218293',
      carrier: 'DHL Express',
      serviceSpeed: 'DHL Express Worldwide',
      shipFrom: {
        name: 'Hector Gomez',
        company: 'VoltDrive Assembly Plant #2',
        address: 'Parque Industrial Milenio 400',
        city: 'Monterrey, NL',
        country: 'Mexico',
        contactPhone: '+52 (81) 555-8910'
      },
      shipTo: {
        facilityName: 'Guadalajara Tech-3 EMS Service Center',
        address: 'Carretera a El Castillo 2100, NAVE 3',
        dockCode: 'DOCK-REPAIR-G3',
        attention: 'Attn: Automotive Service RMA-2026-0893'
      },
      barcodeValue: 'RMA-2026-0893*DHL990218293*PRG-AUTO-02',
      labelCreatedDate: '2026-08-22',
      packageWeightKg: 2.4,
      customsDeclarationValueUSD: 3600
    },
    workflowSteps: [
      { stepName: 'RMA Request Submitted', timestamp: '2026-08-22 11:00', completedBy: 'Hector Gomez (Customer)', status: 'completed' },
      { stepName: 'Out-of-Warranty Billable Review', timestamp: '2026-08-23 09:30', completedBy: 'Guadalajara Service Lead', notes: 'Connector replacement quote $210 USD generated for customer PO.', status: 'completed' },
      { stepName: 'Label Issued & Shipped', timestamp: '2026-08-23 15:00', completedBy: 'DHL Express', status: 'completed' },
      { stepName: 'Received at Guadalajara Depot', timestamp: '2026-08-25 14:10', completedBy: 'Carlos Mendoza', notes: 'Physical intake inspection confirmed pin damage.', status: 'completed' },
      { stepName: 'Quotation Acceptance by Customer', timestamp: 'Pending Customer PO', status: 'in_progress' },
      { stepName: 'Desoldering & Connector SMT Rework', status: 'pending' },
      { stepName: 'IP67 Helium Leak Pressure Test', status: 'pending' }
    ]
  },
  {
    id: 'rma-004',
    rmaNumber: 'RMA-2026-0894',
    customerName: 'NexWave Energy Solutions',
    programCode: 'PRG-IOT-07',
    productName: 'Smart Grid Cellular Gateway & Meter Concentrator',
    partNumber: '500-3310-01',
    serialNumber: 'SN-IOT-4410',
    lotCode: 'LOT-2025-W04',
    requestDate: '2026-08-24',
    reasonCode: 'Firmware / Boot Error',
    customerNotes: 'Device failed OTA cellular firmware upgrade in utility substation; stuck in bootloader recovery loop with rapid orange LED flashing.',
    failureSymptoms: 'SPI flash checksum failure during NOR flash bank partition switch. System hangs at U-Boot v2024.04.',
    operatingHours: 2100,
    environmentCondition: 'Outdoor NEMA 4X weather enclosure, -20°C to +65°C.',
    warrantyStatus: 'Under Standard Warranty',
    triageStatus: 'RMA Approved & Label Issued',
    triageAssignedTo: 'Penang Service Center Queue',
    depotFacility: 'penang',
    priority: 'Standard',
    estimatedRepairDays: 2,
    shippingLabel: {
      trackingNumber: '7829 1102 9940',
      carrier: 'FedEx Priority',
      serviceSpeed: 'FedEx International Priority',
      shipFrom: {
        name: 'Li Wei Tan',
        company: 'NexWave Singapore Field Operations',
        address: '15 Changi Business Park Central 1',
        city: 'Singapore 486057',
        country: 'Singapore',
        contactPhone: '+65 6789 0123'
      },
      shipTo: {
        facilityName: 'Penang Plant-4 RMA & RMA Depot',
        address: 'Bayan Lepas Free Industrial Zone Phase 3',
        dockCode: 'DOCK-PEN-RMA',
        attention: 'Attn: IoT RMA Intake - RMA-2026-0894'
      },
      barcodeValue: 'RMA-2026-0894*782911029940*PRG-IOT-07',
      labelCreatedDate: '2026-08-24',
      packageWeightKg: 0.7,
      customsDeclarationValueUSD: 850
    },
    workflowSteps: [
      { stepName: 'RMA Request Submitted', timestamp: '2026-08-24 16:20', completedBy: 'Li Wei Tan', status: 'completed' },
      { stepName: 'Automated Warranty Verification', timestamp: '2026-08-24 16:22', completedBy: 'FactoryIQ Warranty Engine', notes: 'Active warranty valid through 2027-01-15.', status: 'completed' },
      { stepName: 'Prepaid Return Waybill Issued', timestamp: '2026-08-24 16:25', completedBy: 'Automated Depot Logistics', status: 'completed' },
      { stepName: 'Awaiting Inbound Courier Pickup', status: 'in_progress' },
      { stepName: 'Depot Intake & JTAG Flash Recovery', status: 'pending' },
      { stepName: 'Full Functional Network Cellular Test', status: 'pending' }
    ]
  },
  {
    id: 'rma-005',
    rmaNumber: 'RMA-2026-0895',
    customerName: 'AeroDynamics Global Corp',
    programCode: 'PRG-AVIONIC-09',
    productName: 'Flight Navigation Controller Mainboard (Rev D)',
    partNumber: '700-0921-04',
    serialNumber: 'SN-AV-2023-7102',
    lotCode: 'LOT-2023-W40',
    requestDate: '2026-08-10',
    reasonCode: 'DOA (Dead on Arrival)',
    customerNotes: 'Spares inventory unit pulled from warehouse shelf would not power on during bench pre-installation check.',
    failureSymptoms: 'Zero current draw on 28V DC bus; input transient protection TVS diode shorted to ground.',
    operatingHours: 0,
    environmentCondition: 'Storage in static-shielded moisture barrier bag.',
    warrantyStatus: 'Under Extended Gold SLA',
    triageStatus: 'Outbound Shipped',
    triageAssignedTo: 'Marcus Vance',
    depotFacility: 'austin',
    priority: 'Critical (AOG / Line Stop)',
    estimatedRepairDays: 2,
    shippingLabel: {
      trackingNumber: '7946 9912 8821',
      carrier: 'FedEx Priority',
      serviceSpeed: 'Priority Overnight AOG',
      shipFrom: {
        name: 'Marcus Vance',
        company: 'Austin Giga-1 EMS Depot & Repair Hub',
        address: '10800 Tech Center Blvd, Dock 4A',
        city: 'Austin, TX 78758',
        country: 'USA',
        contactPhone: '+1 (512) 555-0100'
      },
      shipTo: {
        facilityName: 'AeroDynamics Seattle Flight Depot',
        address: '8400 Aviation Way, Hangar 4',
        dockCode: 'DOCK-4',
        attention: 'Attn: David Sterling'
      },
      barcodeValue: 'RMA-2026-0895*794699128821*RETURN',
      labelCreatedDate: '2026-08-15',
      packageWeightKg: 1.85,
      customsDeclarationValueUSD: 4200
    },
    workflowSteps: [
      { stepName: 'RMA Request Submitted', timestamp: '2026-08-10 08:00', completedBy: 'David Sterling', status: 'completed' },
      { stepName: 'Technical Triage & Authorization', timestamp: '2026-08-10 08:30', completedBy: 'Austin Triage', status: 'completed' },
      { stepName: 'Inbound Received & Inspected', timestamp: '2026-08-11 10:15', completedBy: 'Marcus Vance', status: 'completed' },
      { stepName: 'Failure Analysis & Rework Completed', timestamp: '2026-08-12 15:45', completedBy: 'Marcus Vance', notes: 'Replaced defective TVS diode D4 and upstream fuse F1. Recoated silicone barrier.', status: 'completed' },
      { stepName: '48hr Thermal Burn-In & QA Cert Sign-off', timestamp: '2026-08-14 17:00', completedBy: 'Avionics QA Inspector #102', notes: '100% Pass. FAA 8130-3 Certificate of Conformance generated.', status: 'completed' },
      { stepName: 'Outbound Shipped via FedEx Overnight', timestamp: '2026-08-15 08:00', completedBy: 'Depot Shipping Dock', notes: 'Delivered safely to customer depot on 2026-08-16.', status: 'completed' }
    ]
  }
];

// ==========================================
// 2. REPAIR RECORDS & WORKFLOWS
// ==========================================

export const mockRepairRecords: RepairRecord[] = [
  {
    id: 'rep-001',
    rmaId: 'rma-001',
    rmaNumber: 'RMA-2026-0891',
    serialNumber: 'SN-AV-2024-8891',
    productName: 'Flight Navigation Controller Mainboard (Rev D)',
    customerName: 'AeroDynamics Global Corp',
    technicianName: 'Marcus Vance (IPC-7711/7721 Master Specialist)',
    repairBay: 'Bay AV-04 (High-Reliability Avionics Clean Bay)',
    stage: 'Final Functional & Safety Testing',
    progressPercent: 88,
    diagnostics: {
      failureCategory: 'Power Management Circuit Degradation',
      rootCauseSummary: 'Buck regulator dual-channel MOSFET (Q14) experienced localized gate-dielectric micro-fissure under combined thermal and high-frequency PWM switching stress, causing 3.3V rail voltage droop during max transponder burst transmission.',
      faultyComponents: [
        {
          refDes: 'Q14',
          partNumber: '200-4820-01',
          mpn: 'CSD18534Q5A',
          defectType: 'Blown Silicon Die',
          severity: 'Critical'
        },
        {
          refDes: 'C102',
          partNumber: '100-3301-09',
          mpn: 'GRM31CR61E476KE15L',
          defectType: 'Component Degradation',
          severity: 'Moderate'
        }
      ],
      opticalXrayNotes: '3D X-Ray Inspection on Nordson Dage Quadra 5: Verified no solder voiding or bridging under surrounding BGA microcontroller U1. Solder fillet on Q14 power pad exhibited 14% micro-voids prior to rework.',
      thermalImagingResult: 'FLIR Thermal camera revealed localized hotspot reaching 118°C on Q14 under 4.0A load before rework (nominal is 68°C). Post-rework temperature stabilized at 62°C.',
      logsAnalyzed: 'Onboard NVRAM crash dump analyzed via JTAG interface: Confirmed 14 occurrences of VDD_CORE_UNDERVOLTAGE interrupt triggered at 3.3V power regulator output.'
    },
    quoteApproval: {
      isBillable: false,
      laborHours: 3.5,
      laborRateUSD: 140,
      partsCostUSD: 48,
      totalQuoteUSD: 538,
      approvalStatus: 'Under Warranty (No Charge)',
      approvedBy: 'Gold SLA Auto-Authorization',
      approvedAt: '2026-08-18 10:40'
    },
    repairActionsLog: [
      {
        id: 'act-01',
        actionName: 'Precision De-soldering of Q14 and C102',
        performedBy: 'Marcus Vance',
        timestamp: '2026-08-20 15:30',
        partsReplaced: ['Q14 (TI CSD18534Q5A)', 'C102 (Murata 47uF X5R)'],
        equipmentUsed: 'JBC Nano Rework Station + Hakko Hot Air Pre-heater',
        notes: 'Safely desoldered Q14 without thermal shock to adjacent 0201 decoupling passives.'
      },
      {
        id: 'act-02',
        actionName: 'Pad Preparation & Ultrasonic Flux Cleaning',
        performedBy: 'Marcus Vance',
        timestamp: '2026-08-20 16:15',
        partsReplaced: [],
        equipmentUsed: 'Microscope Vision Mantis Elite + Techspray IPA Cleaner',
        notes: 'Pads inspected under 20x magnification; zero trace lift or copper damage.'
      },
      {
        id: 'act-03',
        actionName: 'New Component Placement & Solder Reflow',
        performedBy: 'Marcus Vance',
        timestamp: '2026-08-21 09:45',
        partsReplaced: ['Q14 New Date Code 2026-W08', 'C102 New'],
        equipmentUsed: 'Finetech Fineplacer Core SMD Rework System',
        notes: 'Applied Indium SAC305 solder paste via laser-cut mini-stencil. Reflow profile verified.'
      },
      {
        id: 'act-04',
        actionName: 'Conformal Coating Re-application & UV Curing',
        performedBy: 'Marcus Vance',
        timestamp: '2026-08-21 14:00',
        partsReplaced: [],
        equipmentUsed: 'Humiseal 1B31 Acrylic Coating + UV Blacklight Chamber',
        notes: 'Coating thickness verified at 55 microns across reworked quadrant.'
      }
    ],
    finalTestResults: {
      ictTest: 'Passed',
      functionalTest: 'Passed',
      burnInDurationHours: 24,
      burnInResult: 'Passed',
      hiPotSafetyTest: 'Passed (3.0kV Isolation)',
      calibrationLog: 'All voltage rails calibrated: 3.302V (±0.05%), 1.800V (±0.02%), 1.050V (±0.01%). Transponder RF output power 48.2 dBm.',
      qaInspectorBadge: 'QA-AV-9918 (Certified FAA Inspector)',
      completionDate: '2026-08-22',
      certificateOfConformanceUrl: 'https://docs.nexgile.internal/certs/COC-RMA-2026-0891.pdf'
    },
    outboundShipment: {
      carrier: 'FedEx Priority Overnight',
      trackingNumber: '7946 9912 4490',
      shipmentDate: '2026-08-27',
      estimatedArrival: '2026-08-28 09:00 AM',
      recipientAddress: 'AeroDynamics Flight Testing Facility, 8400 Aviation Way, Seattle WA',
      packingSlipNumber: 'PS-RMA-0891-OUT',
      status: 'Preparing Dispatch'
    }
  },
  {
    id: 'rep-002',
    rmaId: 'rma-002',
    rmaNumber: 'RMA-2026-0892',
    serialNumber: 'SN-MED-9921',
    productName: 'Smart Infusion Pump Core Telemetry Board',
    customerName: 'MediPulse Therapeutics',
    technicianName: 'Elena Rostova (Biomedical QA Tech)',
    repairBay: 'Bay MED-01 (ISO Class 7 Cleanroom)',
    stage: 'Failure Analysis & Root Cause',
    progressPercent: 42,
    diagnostics: {
      failureCategory: 'Optical Transducer Photodiode Drift',
      rootCauseSummary: 'Silicon phototransistor emitter LED in the bubble-detection optical channel degraded by 12% luminous intensity over 3,600 operating hours, causing optical comparator reference threshold shift.',
      faultyComponents: [
        {
          refDes: 'OPT1',
          partNumber: '250-1010-04',
          mpn: 'OPB980T51Z',
          defectType: 'Component Degradation',
          severity: 'Moderate'
        }
      ],
      opticalXrayNotes: 'Optical aperture clean; no foreign particulate contamination. Emitter output power measured at 0.88 mW (nominal is 1.15 mW).',
      thermalImagingResult: 'Thermal profile nominal throughout whole board (< 42°C max at power supply).',
      logsAnalyzed: 'Internal calibration memory: zero drift recorded on pressure sensors; flow rate error isolated 100% to optical detector channel B.'
    },
    quoteApproval: {
      isBillable: false,
      laborHours: 2.0,
      laborRateUSD: 160,
      partsCostUSD: 34,
      totalQuoteUSD: 354,
      approvalStatus: 'Under Warranty (No Charge)',
      approvedBy: 'Standard Medical Warranty SLA',
      approvedAt: '2026-08-21 08:30'
    },
    repairActionsLog: [
      {
        id: 'act-11',
        actionName: 'Precision Desolder of Optical Sensor OPT1',
        performedBy: 'Elena Rostova',
        timestamp: '2026-08-25 10:00',
        partsReplaced: ['OPT1 (TT Electronics Optical Transducer)'],
        equipmentUsed: 'Weller WXsmart Soldering Station',
        notes: 'Clean removal from dual-sided flex-rigid PCB junction.'
      }
    ],
    finalTestResults: {
      ictTest: 'Passed',
      functionalTest: 'N/A',
      burnInDurationHours: 12,
      burnInResult: 'N/A',
      hiPotSafetyTest: 'Passed (3.0kV Isolation)',
      calibrationLog: 'Pending replacement sensor installation & NIST micro-flow validation.',
      qaInspectorBadge: 'QA-MED-4402',
      completionDate: 'Estimated 2026-08-28'
    }
  },
  {
    id: 'rep-003',
    rmaId: 'rma-003',
    rmaNumber: 'RMA-2026-0893',
    serialNumber: 'SN-LDR-7731',
    productName: 'Automotive LiDAR Front Array Sensor Unit',
    customerName: 'VoltDrive EV Technologies',
    technicianName: 'Carlos Mendoza (Automotive Specialist)',
    repairBay: 'Bay AUTO-03 (Automotive Electro-Optics)',
    stage: 'Quotation & Customer Approval',
    progressPercent: 30,
    diagnostics: {
      failureCategory: 'Mechanical Connector Physical Damage',
      rootCauseSummary: 'Severe mechanical tension pulled cable harness at a 60-degree angle, shearing retention ears and bending signal pins 7 and 8 on the main automotive Deutsch automotive connector.',
      faultyComponents: [
        {
          refDes: 'J1',
          partNumber: '300-9940-02',
          mpn: 'TE Connectivity 2304910-1',
          defectType: 'Mechanical Fracturing',
          severity: 'Critical'
        }
      ],
      opticalXrayNotes: 'Internal solder joints on PCB showed zero fractured solder balls under X-Ray. Damage is isolated strictly to the connector shell and header.',
      thermalImagingResult: 'N/A - Unpowered inspection.',
      logsAnalyzed: 'No electrical short recorded prior to cable shear event.'
    },
    quoteApproval: {
      isBillable: true,
      laborHours: 1.5,
      laborRateUSD: 110,
      partsCostUSD: 45,
      totalQuoteUSD: 210,
      approvalStatus: 'Pending Customer Approval',
      approvedBy: 'Awaiting VoltDrive Purchasing PO #VD-9921',
      approvedAt: 'Pending'
    },
    repairActionsLog: [],
    finalTestResults: {
      ictTest: 'N/A',
      functionalTest: 'N/A',
      burnInDurationHours: 8,
      burnInResult: 'N/A',
      hiPotSafetyTest: 'N/A',
      calibrationLog: 'Awaiting connector rework prior to laser optical alignment check.',
      qaInspectorBadge: 'QA-AUTO-8819',
      completionDate: 'Estimated 2026-08-30'
    }
  }
];

// ==========================================
// 3. WARRANTY COVERAGE & CLAIMS MOCK DATA
// ==========================================

export const mockWarrantyLookupDatabase: Record<string, WarrantyLookupRecord> = {
  'SN-AV-2024-8891': {
    serialNumber: 'SN-AV-2024-8891',
    productName: 'Flight Navigation Controller Mainboard (Rev D)',
    partNumber: '700-0921-04',
    manufacturingDate: '2024-09-15',
    shipDate: '2024-10-02',
    facilityBorn: 'Austin Giga-1 (SMT Line A1)',
    customerName: 'AeroDynamics Global Corp',
    warrantyTier: 'Mission-Critical Gold (60 Months)',
    warrantyStartDate: '2024-10-02',
    warrantyEndDate: '2029-10-02',
    warrantyStatus: 'Active',
    claimHistoryCount: 1,
    contractId: 'SLA-GOLD-AVIONICS-2024-001',
    serviceAgreementLevel: 'AOG 24/7 Priority Depot Turnaround (72hr SLA) + Free Advance Spares'
  },
  'SN-MED-9921': {
    serialNumber: 'SN-MED-9921',
    productName: 'Smart Infusion Pump Core Telemetry Board',
    partNumber: '820-4100-02',
    manufacturingDate: '2025-03-10',
    shipDate: '2025-03-28',
    facilityBorn: 'Austin Giga-1 (Cleanroom Med-1)',
    customerName: 'MediPulse Therapeutics',
    warrantyTier: 'Extended Enterprise (36 Months)',
    warrantyStartDate: '2025-03-28',
    warrantyEndDate: '2028-03-28',
    warrantyStatus: 'Active',
    claimHistoryCount: 0,
    contractId: 'SLA-MED-2025-449',
    serviceAgreementLevel: 'Standard Medical Warranty (5-Day Depot Turnaround + Recalibration)'
  },
  'SN-LDR-7731': {
    serialNumber: 'SN-LDR-7731',
    productName: 'Automotive LiDAR Front Array Sensor Unit',
    partNumber: '610-8800-05',
    manufacturingDate: '2024-12-01',
    shipDate: '2024-12-18',
    facilityBorn: 'Guadalajara Tech-3 (Line MX-2)',
    customerName: 'VoltDrive EV Technologies',
    warrantyTier: 'Standard OEM (12 Months)',
    warrantyStartDate: '2024-12-18',
    warrantyEndDate: '2025-12-18',
    warrantyStatus: 'Expired',
    claimHistoryCount: 0,
    contractId: 'OEM-AUTO-2024-911',
    serviceAgreementLevel: 'Factory T&M (Time and Materials) Repair Standard'
  },
  'SN-IOT-4410': {
    serialNumber: 'SN-IOT-4410',
    productName: 'Smart Grid Cellular Gateway & Meter Concentrator',
    partNumber: '500-3310-01',
    manufacturingDate: '2025-01-20',
    shipDate: '2025-02-05',
    facilityBorn: 'Penang Plant-4 (Line MY-1)',
    customerName: 'NexWave Energy Solutions',
    warrantyTier: 'Extended Enterprise (36 Months)',
    warrantyStartDate: '2025-02-05',
    warrantyEndDate: '2028-02-05',
    warrantyStatus: 'Active',
    claimHistoryCount: 0,
    contractId: 'SLA-IOT-2025-882',
    serviceAgreementLevel: 'Depot Repair & Advanced Warranty Replacement'
  },
  'SN-AV-2021-1002': {
    serialNumber: 'SN-AV-2021-1002',
    productName: 'Cockpit Flight Display Interface Unit (Rev B)',
    partNumber: '700-0400-02',
    manufacturingDate: '2021-04-12',
    shipDate: '2021-05-01',
    facilityBorn: 'Austin Giga-1',
    customerName: 'AeroDynamics Global Corp',
    warrantyTier: 'Standard OEM (12 Months)',
    warrantyStartDate: '2021-05-01',
    warrantyEndDate: '2022-05-01',
    warrantyStatus: 'Expired',
    claimHistoryCount: 2,
    contractId: 'SLA-LEGACY-2021',
    serviceAgreementLevel: 'EOL Out-of-Warranty Support (Billable)'
  }
};

export const mockWarrantyClaims: WarrantyClaim[] = [
  {
    id: 'clm-001',
    claimNumber: 'CLM-2026-0142',
    serialNumber: 'SN-AV-2024-8891',
    productName: 'Flight Navigation Controller Mainboard (Rev D)',
    customerName: 'AeroDynamics Global Corp',
    claimType: 'Warranty Depot Repair',
    status: 'Approved - RMA Issued',
    claimAmountUSD: 538,
    submittedDate: '2026-08-18',
    reviewerName: 'Warren Hastings (VP Quality & Service)',
    justification: 'Failure occurred within 22 months of 60-month Mission-Critical Gold SLA contract. Component failure Q14 confirmed non-abuse.',
    approvalHistory: [
      { role: 'Automated Warranty Engine', approver: 'System Rule Engine', status: 'Approved', date: '2026-08-18 09:16', comment: 'Active Gold SLA contract validated.' },
      { role: 'Service Operations Manager', approver: 'Warren Hastings', status: 'Approved', date: '2026-08-18 10:35', comment: 'Approved for priority Austin depot repair.' }
    ]
  },
  {
    id: 'clm-002',
    claimNumber: 'CLM-2026-0143',
    serialNumber: 'SN-MED-9921',
    productName: 'Smart Infusion Pump Core Telemetry Board',
    customerName: 'MediPulse Therapeutics',
    claimType: 'Warranty Depot Repair',
    status: 'Approved - RMA Issued',
    claimAmountUSD: 354,
    submittedDate: '2026-08-20',
    reviewerName: 'Sarah Jenkins (Medical Quality Lead)',
    justification: 'Optical sensor drift observed prior to 18-month warranty window expiration. Device is unaltered.',
    approvalHistory: [
      { role: 'Medical Quality Lead', approver: 'Sarah Jenkins', status: 'Approved', date: '2026-08-21 08:25', comment: 'Medical ISO 13485 service procedure authorized.' }
    ]
  },
  {
    id: 'clm-003',
    claimNumber: 'CLM-2026-0144',
    serialNumber: 'SN-LDR-7731',
    productName: 'Automotive LiDAR Front Array Sensor Unit',
    customerName: 'VoltDrive EV Technologies',
    claimType: 'Warranty Depot Repair',
    status: 'Rejected',
    claimAmountUSD: 210,
    submittedDate: '2026-08-22',
    reviewerName: 'Jorge Almonte (Automotive Warranty Auditor)',
    justification: 'Failure analysis revealed customer harness physical mechanical tear-out; not a manufacturing or component defect. Reclassified as Billable T&M.',
    approvalHistory: [
      { role: 'Automotive Warranty Auditor', approver: 'Jorge Almonte', status: 'Rejected', date: '2026-08-23 09:15', comment: 'Customer mechanical damage. Converted to billable repair quote.' }
    ]
  },
  {
    id: 'clm-004',
    claimNumber: 'CLM-2026-0145',
    serialNumber: 'SN-IOT-4410',
    productName: 'Smart Grid Cellular Gateway & Meter Concentrator',
    claimType: 'Advance Hardware Replacement',
    customerName: 'NexWave Energy Solutions',
    status: 'Under Technical Evaluation',
    claimAmountUSD: 850,
    submittedDate: '2026-08-24',
    reviewerName: 'Kavita Sundaram (Penang Technical Services)',
    justification: 'Customer requested immediate advance hardware swap for critical substation node while failed unit is in transit.',
    approvalHistory: [
      { role: 'Regional Service Lead', approver: 'Kavita Sundaram', status: 'Pending', comment: 'Verifying advance spares buffer stock in Singapore hub.' }
    ]
  }
];

export const mockFailureTrendData: FailureTrendDataPoint[] = [
  { category: 'Solder Joint Fatigue / Micro-Cracks', count: 42, percentage: 34.4, avgLaborHours: 2.8, topComp: 'BGA MCU / Power MOSFETs' },
  { category: 'Power Rail / MOSFET Die Breakdown', count: 28, percentage: 23.0, avgLaborHours: 3.2, topComp: 'Buck Regulators (Q14, Q12)' },
  { category: 'Sensor & Optoelectronic Drift', count: 21, percentage: 17.2, avgLaborHours: 2.1, topComp: 'Optical Photodiodes / Pressure' },
  { category: 'Connector / Mechanical Strain Damage', count: 16, percentage: 13.1, avgLaborHours: 1.4, topComp: 'Automotive Headers, USB-C' },
  { category: 'Firmware Partition / Corrupted Flash', count: 10, percentage: 8.2, avgLaborHours: 0.9, topComp: 'SPI NOR Flash (U8)' },
  { category: 'TVS / ESD Protection Clamp Damage', count: 5, percentage: 4.1, avgLaborHours: 1.1, topComp: 'Input Diodes (D4, D5)' }
];

// ==========================================
// 4. SPARE PARTS CATALOG & CROSS-REFERENCE
// ==========================================

export const mockSpareParts: SparePart[] = [
  {
    id: 'sp-01',
    partNumber: '700-0921-FRU',
    mpn: 'FRU-AVIONIC-09-D',
    name: 'Flight Navigation Controller Complete FRU Assembly (Rev D)',
    category: 'PCB Assemblies (FRU)',
    compatiblePrograms: ['PRG-AVIONIC-09'],
    unitPriceUSD: 3850,
    onHandQty: 18,
    allocatedQty: 4,
    availableQty: 14,
    leadTimeDays: 2,
    stockStatus: 'In Stock',
    warehouseLocation: 'Austin Giga-1 (Vault Spares-A1)',
    minOrderQty: 1,
    description: 'Fully tested, FAA 8130-3 certified complete flight computer field replaceable unit with conformal coating and calibrated IMU.',
    alternateEquivalents: [
      {
        partNumber: '700-0921-FRU-C',
        mpn: 'FRU-AVIONIC-09-C',
        manufacturer: 'Nexgile EMS Solutions',
        compatibilityLevel: '100% Drop-In',
        priceUSD: 3600,
        stockQty: 6
      }
    ]
  },
  {
    id: 'sp-02',
    partNumber: '200-4820-01',
    mpn: 'CSD18534Q5A',
    name: 'N-Channel 60V 50A NexFET Power MOSFET (SON-8)',
    category: 'Sub-modules & Sensors',
    compatiblePrograms: ['PRG-AVIONIC-09', 'PRG-AUTO-02', 'PRG-IOT-07'],
    unitPriceUSD: 4.85,
    onHandQty: 4200,
    allocatedQty: 800,
    availableQty: 3400,
    leadTimeDays: 1,
    stockStatus: 'In Stock',
    warehouseLocation: 'Austin Giga-1 (Reel Bin R-04-12)',
    minOrderQty: 10,
    description: 'Ultra-low RDS(on) power MOSFET for primary 3.3V / 5.0V step-down synchronous buck converters.',
    alternateEquivalents: [
      {
        partNumber: '200-4820-ALT',
        mpn: 'BSC030N08NS5',
        manufacturer: 'Infineon Technologies',
        compatibilityLevel: '100% Drop-In',
        priceUSD: 5.10,
        stockQty: 1850
      },
      {
        partNumber: '200-4820-VSH',
        mpn: 'SI7148DP-T1-GE3',
        manufacturer: 'Vishay Siliconix',
        compatibilityLevel: '100% Drop-In',
        priceUSD: 4.90,
        stockQty: 920
      }
    ]
  },
  {
    id: 'sp-03',
    partNumber: '820-4100-FRU',
    mpn: 'FRU-MED-04-CORE',
    name: 'Smart Infusion Pump Core Telemetry & Motor Controller Module',
    category: 'PCB Assemblies (FRU)',
    compatiblePrograms: ['PRG-MED-04'],
    unitPriceUSD: 1450,
    onHandQty: 32,
    allocatedQty: 6,
    availableQty: 26,
    leadTimeDays: 3,
    stockStatus: 'In Stock',
    warehouseLocation: 'Austin Giga-1 (Cleanroom Spares Vault)',
    minOrderQty: 1,
    description: 'ISO 13485 certified core assembly with calibrated dual-channel optical sensors and precision stepper motor driver circuitry.',
    alternateEquivalents: []
  },
  {
    id: 'sp-04',
    partNumber: '250-1010-04',
    mpn: 'OPB980T51Z',
    name: 'Precision Slotted Photomicrosensor Optical Transducer',
    category: 'Sub-modules & Sensors',
    compatiblePrograms: ['PRG-MED-04'],
    unitPriceUSD: 18.50,
    onHandQty: 450,
    allocatedQty: 120,
    availableQty: 330,
    leadTimeDays: 5,
    stockStatus: 'In Stock',
    warehouseLocation: 'Austin Giga-1 (Bin M-14-02)',
    minOrderQty: 5,
    description: 'NIST traceable precision optical flow sensor with Schmitt trigger output and phototransistor receiver.',
    alternateEquivalents: [
      {
        partNumber: '250-1010-ALT',
        mpn: 'EE-SX950-W 1M',
        manufacturer: 'Omron Automation',
        compatibilityLevel: 'Requires Adapter Bracket',
        priceUSD: 22.00,
        stockQty: 150
      }
    ]
  },
  {
    id: 'sp-05',
    partNumber: '610-8800-FRU',
    mpn: 'FRU-LIDAR-02',
    name: 'Automotive LiDAR Laser Emitter & Receiver Optical Head Assembly',
    category: 'PCB Assemblies (FRU)',
    compatiblePrograms: ['PRG-AUTO-02'],
    unitPriceUSD: 2950,
    onHandQty: 8,
    allocatedQty: 5,
    availableQty: 3,
    leadTimeDays: 7,
    stockStatus: 'Low Stock',
    warehouseLocation: 'Guadalajara Tech-3 (Optics Vault)',
    minOrderQty: 1,
    description: '905nm pulsed laser diode matrix with silicon photomultiplier (SiPM) receiver array and IP67 hermetic housing.',
    alternateEquivalents: []
  },
  {
    id: 'sp-06',
    partNumber: '300-9940-02',
    mpn: '2304910-1',
    name: '24-Pin Sealed Automotive Wire-to-Board Header Connector',
    category: 'Cables & Harnesses',
    compatiblePrograms: ['PRG-AUTO-02'],
    unitPriceUSD: 12.80,
    onHandQty: 680,
    allocatedQty: 150,
    availableQty: 530,
    leadTimeDays: 2,
    stockStatus: 'In Stock',
    warehouseLocation: 'Guadalajara Tech-3 (Bin MX-Conn-09)',
    minOrderQty: 5,
    description: 'Automotive gold-plated high-retention header with silicone perimeter moisture seal.',
    alternateEquivalents: [
      {
        partNumber: '300-9940-MOX',
        mpn: '34824-0240',
        manufacturer: 'Molex Automotive',
        compatibilityLevel: '100% Drop-In',
        priceUSD: 13.20,
        stockQty: 400
      }
    ]
  },
  {
    id: 'sp-07',
    partNumber: '500-3310-FRU',
    mpn: 'FRU-IOT-GATEWAY-07',
    name: 'Smart Grid Cellular Gateway Complete Core Engine Board',
    category: 'PCB Assemblies (FRU)',
    compatiblePrograms: ['PRG-IOT-07'],
    unitPriceUSD: 420,
    onHandQty: 65,
    allocatedQty: 10,
    availableQty: 55,
    leadTimeDays: 3,
    stockStatus: 'In Stock',
    warehouseLocation: 'Penang Plant-4 (Spares Depot Bay 2)',
    minOrderQty: 1,
    description: 'LTE-M / NB-IoT dual SIM industrial gateway PCBA with ARM Cortex-A7 MCU and hardware crypto engine.',
    alternateEquivalents: []
  },
  {
    id: 'sp-08',
    partNumber: '900-1102-08',
    mpn: 'ENC-AVIONIC-09-SEAL',
    name: 'IP67 Conductive EMI Fluorosilicone Perimeter Gasket Kit',
    category: 'Consumables & Gaskets',
    compatiblePrograms: ['PRG-AVIONIC-09'],
    unitPriceUSD: 24.50,
    onHandQty: 320,
    allocatedQty: 40,
    availableQty: 280,
    leadTimeDays: 1,
    stockStatus: 'In Stock',
    warehouseLocation: 'Austin Giga-1 (Gasket Vault)',
    minOrderQty: 5,
    description: 'Die-cut silver-aluminum filled fluorosilicone conductive environmental seal for avionics chassis.',
    alternateEquivalents: []
  }
];

export const mockSparePartOrders: SparePartOrder[] = [
  {
    id: 'spo-001',
    orderNumber: 'SPO-2026-0941',
    customerName: 'AeroDynamics Global Corp',
    poReference: 'PO-AD-SPARE-4481',
    orderDate: '2026-08-25',
    items: [
      { partNumber: '700-0921-FRU', name: 'Flight Navigation Controller FRU Assembly', quantity: 2, unitPriceUSD: 3850, lineTotalUSD: 7700 },
      { partNumber: '900-1102-08', name: 'Conductive EMI Fluorosilicone Gasket Kit', quantity: 10, unitPriceUSD: 24.50, lineTotalUSD: 245 }
    ],
    totalAmountUSD: 7945,
    shippingSpeed: 'Priority Courier (Next Day)',
    destinationAddress: 'AeroDynamics Seattle Main Hangar, 8400 Aviation Way, Seattle WA 98108',
    status: 'Shipped & In-Transit',
    carrier: 'FedEx Priority Overnight',
    trackingNumber: '7946 8812 3901',
    estimatedDelivery: '2026-08-27 10:30 AM'
  },
  {
    id: 'spo-002',
    orderNumber: 'SPO-2026-0942',
    customerName: 'MediPulse Therapeutics',
    poReference: 'PO-MED-CLINIC-881',
    orderDate: '2026-08-26',
    items: [
      { partNumber: '820-4100-FRU', name: 'Smart Infusion Pump Core Telemetry Module', quantity: 5, unitPriceUSD: 1450, lineTotalUSD: 7250 }
    ],
    totalAmountUSD: 7250,
    shippingSpeed: 'Standard Air (3-5 Days)',
    destinationAddress: 'MediPulse Central Depot, 100 Medical Center Dr, Boston MA 02115',
    status: 'Picking & Packing',
    carrier: 'UPS 2nd Day Air',
    trackingNumber: '1Z992A0102948190',
    estimatedDelivery: '2026-08-29 03:00 PM'
  }
];

// ==========================================
// 5. EOL NOTICES, LTB & LONG-TERM STORAGE
// ==========================================

export const mockEOLNotices: EOLNotice[] = [
  {
    id: 'eol-001',
    noticeNumber: 'PCN-2026-042',
    productFamily: 'Gen-1 Industrial Power Inverter Controller PCBA',
    affectedAssemblies: ['400-1002-01', '400-1002-02', '400-1002-03'],
    affectedCustomers: ['NexWave Energy Solutions', 'AeroDynamics Global Corp'],
    announcementDate: '2026-05-15',
    lastTimeBuyDate: '2026-11-30',
    lastTimeShipDate: '2027-05-31',
    endOfServiceDate: '2032-05-31',
    reason: 'Primary microchip MCU supplier (NXP) announced discontinuation of 8-bit ColdFire silicon architecture.',
    migrationPath: 'Drop-in Rev E assembly based on 32-bit ARM Cortex-M4 (Program PRG-ECO-099).',
    replacementProduct: 'Gen-2 Power Inverter Controller (Rev E / 400-2002-01)',
    status: 'LTB Window Open'
  },
  {
    id: 'eol-002',
    noticeNumber: 'PCN-2025-089',
    productFamily: 'Legacy CAN-Bus Telemetry Interface Board (Rev B)',
    affectedAssemblies: ['700-0400-02'],
    affectedCustomers: ['AeroDynamics Global Corp'],
    announcementDate: '2025-10-01',
    lastTimeBuyDate: '2026-03-31',
    lastTimeShipDate: '2026-09-30',
    endOfServiceDate: '2031-09-30',
    reason: 'Optocoupler isolation IC package obsolescence (EOL announced by Broadcom).',
    migrationPath: 'Digital isolator redesign (Silicon Labs Si86xx).',
    replacementProduct: 'Isolated CAN-FD Transceiver Module (700-0450-01)',
    status: 'LTB Closed / Production Phasing'
  }
];

export const mockLTBPrograms: LTBProgram[] = [
  {
    id: 'ltb-001',
    noticeId: 'eol-001',
    productName: 'Gen-1 Industrial Power Inverter Controller PCBA',
    partNumber: '400-1002-02',
    customerName: 'NexWave Energy Solutions',
    targetBufferYears: 5,
    forecastedSupportUnits: 1200,
    committedLTBUnits: 1200,
    unitCostUSD: 185,
    totalCommitmentUSD: 222000,
    productionBatchDate: '2026-10-15',
    status: 'Contract Signed'
  },
  {
    id: 'ltb-002',
    noticeId: 'eol-002',
    productName: 'Legacy CAN-Bus Telemetry Interface Board (Rev B)',
    partNumber: '700-0400-02',
    customerName: 'AeroDynamics Global Corp',
    targetBufferYears: 7,
    forecastedSupportUnits: 450,
    committedLTBUnits: 450,
    unitCostUSD: 420,
    totalCommitmentUSD: 189000,
    productionBatchDate: '2026-07-20',
    status: 'Transferred to Long-Term Storage'
  }
];

export const mockLongTermStorageItems: LongTermStorageItem[] = [
  {
    id: 'lts-001',
    lotNumber: 'LOT-LTS-2026-01',
    partNumber: '700-0400-02',
    description: 'Legacy CAN-Bus Telemetry Interface Board (AeroDynamics Spares Reserve)',
    facility: 'austin',
    vaultLocation: 'Nitrogen Vault N2-Bay-07 (Chamber 3)',
    storedUnits: 450,
    storageStartDate: '2026-07-25',
    storageCommitmentYears: 7,
    storageEnvironment: 'N2 Purged Constant, < 3% Relative Humidity, 20.5°C ± 1.0°C',
    moistureBarrierSealDate: '2026-07-24',
    nextDesiccantInspection: '2027-07-24',
    annualStorageFeeUSD: 4800,
    ownershipModel: 'Customer Dedicated Consignment'
  },
  {
    id: 'lts-002',
    lotNumber: 'LOT-LTS-2025-09',
    partNumber: '200-9910-01',
    description: 'Critical Obsolete DSP Microcontrollers (TMS320F28335 Tray Stock)',
    facility: 'austin',
    vaultLocation: 'Nitrogen Vault N2-Bay-02 (JEDEC Tray Vault)',
    storedUnits: 3200,
    storageStartDate: '2025-11-10',
    storageCommitmentYears: 10,
    storageEnvironment: 'Ultra-Pure N2 Gas Environment, < 2% RH, ESD Safe Conductive Trays',
    moistureBarrierSealDate: '2025-11-09',
    nextDesiccantInspection: '2026-11-09',
    annualStorageFeeUSD: 6500,
    ownershipModel: 'EMS Guaranteed Buffer'
  },
  {
    id: 'lts-003',
    lotNumber: 'LOT-LTS-2026-04',
    partNumber: '820-2001-01',
    description: 'Gen-1 Medical Telemetry Sensor Sub-assemblies (MediPulse Reserve)',
    facility: 'penang',
    vaultLocation: 'Penang Dry Vault Bay-P4',
    storedUnits: 600,
    storageStartDate: '2026-02-18',
    storageCommitmentYears: 5,
    storageEnvironment: 'Dry Air Desiccant Cabinet, < 5% RH, Temperature Controlled 21°C',
    moistureBarrierSealDate: '2026-02-17',
    nextDesiccantInspection: '2027-02-17',
    annualStorageFeeUSD: 3600,
    ownershipModel: 'Customer Dedicated Consignment'
  }
];

export const mockRedesignProjects: RedesignMigrationProject[] = [
  {
    id: 'rdg-001',
    legacyProduct: 'Gen-1 Industrial Power Inverter Controller (400-1002-02)',
    nextGenProduct: 'Gen-2 ARM Cortex-M4 Inverter Controller (400-2002-01)',
    customerName: 'NexWave Energy Solutions',
    compatibilityRating: '100% Form-Fit-Function Drop-In',
    ecnNumber: 'ECN-2026-0782',
    engineeringLead: 'Alexandre Dubois (Principal Hardware Architect)',
    targetSampleDate: '2026-09-30',
    qualificationStatus: 'DVT Validation',
    progressPercent: 75,
    keyEnhancements: [
      'Pin-to-pin & mounting hole 100% mechanical backward compatibility',
      'Modern 32-bit Cortex-M4 MCU with 3x faster vector control loop',
      'Integrated isolated CAN-FD and RS-485 transceiver circuitry',
      'Lower bill of materials unit cost (-18% BOM reduction)'
    ]
  },
  {
    id: 'rdg-002',
    legacyProduct: 'Cockpit Flight Display Interface Unit (700-0400-02)',
    nextGenProduct: 'High-Speed ARINC 429 / Ethernet Gateway (700-0500-01)',
    customerName: 'AeroDynamics Global Corp',
    compatibilityRating: 'Form-Fit Equivalent (Minor FW delta)',
    ecnNumber: 'ECN-2026-0914',
    engineeringLead: 'Dr. Evelyn Reed (Avionics Systems)',
    targetSampleDate: '2026-11-15',
    qualificationStatus: 'Proto Testing',
    progressPercent: 45,
    keyEnhancements: [
      'Replaces obsolete optocouplers with 5kVrms silicon digital isolators',
      'DO-254 & DO-178C Level A certification compliance artifacts included',
      'Extended operating temperature rating: -55°C to +105°C'
    ]
  }
];
