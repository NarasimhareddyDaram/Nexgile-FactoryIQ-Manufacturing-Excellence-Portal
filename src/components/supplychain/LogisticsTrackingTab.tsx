import React, { useState } from 'react';
import {
  Truck,
  Plane,
  Ship,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  FileCheck,
  Package,
  X,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';
import {
  LogisticsShipment,
  CustomsMilestone,
  FactorySiteId,
  Role,
  User as UserType
} from '../../types';

interface LogisticsTrackingTabProps {
  shipments: LogisticsShipment[];
  selectedSite: FactorySiteId;
  currentRole: Role;
  currentUser: UserType;
}

export const LogisticsTrackingTab: React.FC<LogisticsTrackingTabProps> = ({
  shipments,
  selectedSite,
  currentRole,
  currentUser
}) => {
  const [selectedShipment, setSelectedShipment] = useState<LogisticsShipment | null>(shipments[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredShipments = shipments.filter((shp) => {
    if (selectedSite !== 'all' && shp.destinationFacility !== selectedSite) {
      return false;
    }
    if (statusFilter !== 'all' && shp.status !== statusFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchShp = shp.shipmentNumber.toLowerCase().includes(term);
      const matchTrk = shp.trackingNumber.toLowerCase().includes(term);
      const matchAwb = shp.masterAWB_BOL.toLowerCase().includes(term);
      const matchCarrier = shp.carrier.toLowerCase().includes(term);
      const matchPo = shp.poNumbers.some(p => p.toLowerCase().includes(term));
      const matchOrigin = shp.originCity.toLowerCase().includes(term) || shp.destinationCity.toLowerCase().includes(term);
      if (!matchShp && !matchTrk && !matchAwb && !matchCarrier && !matchPo && !matchOrigin) {
        return false;
      }
    }
    return true;
  });

  const getTransportIcon = (mode: LogisticsShipment['transportMode']) => {
    switch (mode) {
      case 'Air Express':
      case 'Air Freight':
        return <Plane className="h-4 w-4 text-blue-600" />;
      case 'Ocean Container':
        return <Ship className="h-4 w-4 text-cyan-600" />;
      case 'Dedicated Road Feeder':
      default:
        return <Truck className="h-4 w-4 text-indigo-600" />;
    }
  };

  const getShipmentStatusBadge = (status: LogisticsShipment['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'Out for Final Delivery':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <Truck className="h-3 w-3" /> Out for Delivery
          </span>
        );
      case 'Customs Hold':
      case 'Port Arrival / Under Inspection':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 animate-pulse">
            <AlertTriangle className="h-3 w-3" /> Customs Review
          </span>
        );
      case 'In Transit':
      case 'Departed Origin':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            In Transit
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">In-Flight Cargo Value</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              ${(shipments.reduce((sum, s) => sum + s.cargoValueUSD, 0) / 1000).toFixed(1)}k USD
            </span>
            <span className="text-xs text-slate-400 font-medium">{shipments.length} Active Shipments</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Customs Clearance Status</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">1 Pending Review</span>
            <span className="text-xs text-slate-400 font-medium">Incheon Transit Hold</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Next Scheduled Dock Arrival</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">Today, 10:30 AM</span>
            <span className="text-xs text-slate-400 font-medium">Fremont Mega-2</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left List & Right Live Tracking Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Shipment Selector List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AWB, carrier, PO..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredShipments.map((shp) => {
              const isSelected = selectedShipment?.id === shp.id;
              return (
                <div
                  key={shp.id}
                  onClick={() => setSelectedShipment(shp)}
                  className={`rounded-2xl border p-4 transition cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/20 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-slate-100 p-2">
                        {getTransportIcon(shp.transportMode)}
                      </div>
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-xs block">
                          {shp.shipmentNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {shp.carrier} • {shp.trackingNumber}
                        </span>
                      </div>
                    </div>

                    {getShipmentStatusBadge(shp.status)}
                  </div>

                  {/* Origin to Destination Route */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block uppercase">Origin</span>
                      <span className="font-semibold text-slate-800">{shp.originCity}</span>
                    </div>

                    <div className="flex flex-col items-center px-3">
                      <span className="text-[10px] font-mono text-blue-600 font-bold">{shp.progressPercent}%</span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden my-1">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${shp.progressPercent}%` }} />
                      </div>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Destination</span>
                      <span className="font-semibold text-slate-800">{shp.destinationCity}</span>
                    </div>
                  </div>

                  {/* Exception Flag if any */}
                  {shp.exceptionAlert && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <span className="truncate font-semibold">{shp.exceptionAlert.title}</span>
                    </div>
                  )}

                  {/* Footer ETA */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>PO: <strong className="font-mono text-slate-700">{shp.poNumbers.join(', ')}</strong></span>
                    <span>ETA: <strong className="text-slate-900">{shp.estimatedDeliveryDate}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Shipment Details & Customs Milestone Stepper (7 Cols) */}
        {selectedShipment ? (
          <div className="lg:col-span-7 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedShipment.shipmentNumber}</h3>
                  {getShipmentStatusBadge(selectedShipment.status)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Master AWB / BOL: <strong className="font-mono text-slate-800">{selectedShipment.masterAWB_BOL}</strong> ({selectedShipment.carrier})
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery ETA</span>
                <span className="text-sm font-bold text-slate-900">{selectedShipment.estimatedDeliveryDate}</span>
                {selectedShipment.delayDays > 0 && (
                  <span className="text-[11px] font-bold text-rose-600 block">
                    +{selectedShipment.delayDays}d Schedule Deviation
                  </span>
                )}
              </div>
            </div>

            {/* Exception Banner if present */}
            {selectedShipment.exceptionAlert && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>Logistics Exception Alert: {selectedShipment.exceptionAlert.title}</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {selectedShipment.exceptionAlert.message}
                </p>
                <div className="flex items-center justify-between text-[11px] text-amber-700 pt-1 border-t border-amber-200">
                  <span>Reported: {selectedShipment.exceptionAlert.reportedAt}</span>
                  <span className="font-semibold">Target Resolution: {selectedShipment.exceptionAlert.resolutionETA}</span>
                </div>
              </div>
            )}

            {/* Shipment Cargo Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Transport Mode</span>
                <span className="font-semibold text-slate-800">{selectedShipment.transportMode}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Total Weight</span>
                <span className="font-mono font-bold text-slate-800">{selectedShipment.totalWeightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Pallets / Cartons</span>
                <span className="font-mono font-bold text-slate-800">{selectedShipment.totalPallets} Pallets</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Declared Value</span>
                <span className="font-mono font-bold text-blue-600">${selectedShipment.cargoValueUSD.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Cargo Manifest Contents */}
            <div className="rounded-xl border border-slate-200 p-3 text-xs">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Cargo Parts Manifest</span>
              <p className="text-slate-800 font-medium mt-0.5">{selectedShipment.partsSummary}</p>
            </div>

            {/* Customs & Transport Milestone Timeline Stepper */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Customs Milestones & In-Transit Tracking Telemetry
                </h4>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                  Carrier API Real-Time Sync
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {selectedShipment.customsMilestones.map((ms, idx) => {
                  const isCompleted = ms.status === 'completed';
                  const isFlagged = ms.status === 'flagged';
                  const isInProgress = ms.status === 'in_progress';

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Milestone Dot Icon */}
                      <div
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                          isCompleted
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isFlagged
                            ? 'border-amber-500 bg-amber-500 text-white animate-bounce'
                            : isInProgress
                            ? 'border-blue-600 bg-white text-blue-600'
                            : 'border-slate-300 bg-white text-slate-300'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : isFlagged ? (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        ) : isInProgress ? (
                          <Clock className="h-3.5 w-3.5" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </div>

                      {/* Milestone Content Card */}
                      <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-slate-900">{ms.milestone}</span>
                          {ms.timestamp && (
                            <span className="font-mono text-[11px] text-slate-500">{ms.timestamp}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-600">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{ms.location}</span>
                        </div>

                        {ms.notes && (
                          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/40">
                            {ms.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Truck className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-500">Select a shipment on the left to view detailed tracking telemetry</p>
          </div>
        )}
      </div>
    </div>
  );
};
