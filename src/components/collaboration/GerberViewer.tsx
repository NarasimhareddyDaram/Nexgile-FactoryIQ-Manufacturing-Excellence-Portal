import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Cpu,
  Sparkles,
  Info,
  Ruler
} from 'lucide-react';
import { GerberProject, GerberLayer } from '../../types';
import { INITIAL_GERBER_PROJECT } from '../../data/collaborationData';

export function GerberViewer() {
  const [project, setProject] = useState<GerberProject>(INITIAL_GERBER_PROJECT);
  const [layers, setLayers] = useState<GerberLayer[]>(INITIAL_GERBER_PROJECT.layers);
  const [selectedNet, setSelectedNet] = useState<string>('+1V2_FPGA_CORE');
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [showClearanceRuler, setShowClearanceRuler] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleToggleLayer = (layerId: string) => {
    setLayers(layers.map(l => l.id === layerId ? { ...l, isVisible: !l.isVisible } : l));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setPanX(prev => prev + dx);
    setPanY(prev => prev + dy);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Render Gerber Traces, Vias, Pads, & Silkscreen on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);

    // Board Substrate (FR4 Green / Nelco Dark Green)
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(-220, -140, 440, 280);
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 3;
    ctx.strokeRect(-220, -140, 440, 280);

    // Layer 12: Bottom Copper (if visible)
    const bCu = layers.find(l => l.id === 'layer-b-cu');
    if (bCu && bCu.isVisible) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
      ctx.lineWidth = 2;
      for (let i = -180; i <= 180; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, -120);
        ctx.lineTo(i + 20, 120);
        ctx.stroke();
      }
    }

    // Layer 1: Top Copper (F.Cu)
    const fCu = layers.find(l => l.id === 'layer-f-cu');
    if (fCu && fCu.isVisible) {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;

      // FPGA Escape Routing Traces
      for (let i = -40; i <= 40; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, -40);
        ctx.lineTo(i * 1.5, -90);
        ctx.lineTo(i * 2, -110);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 40);
        ctx.lineTo(i * 1.5, 90);
        ctx.lineTo(i * 2, 110);
        ctx.stroke();
      }

      // High Speed Differential Pairs
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(130, 0);
      ctx.lineTo(160, 40);
      ctx.lineTo(190, 40);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(60, 6);
      ctx.lineTo(130, 6);
      ctx.lineTo(160, 46);
      ctx.lineTo(190, 46);
      ctx.stroke();

      // SMD Component Pads
      ctx.fillStyle = '#f59e0b';
      // BGA Grid Array 12x12
      for (let r = -5; r <= 5; r++) {
        for (let c = -5; c <= 5; c++) {
          ctx.beginPath();
          ctx.arc(c * 7, r * 7, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Memory & Transceiver QFN Pads
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(-150 + i * 8, -60, 4, 12);
        ctx.fillRect(-150 + i * 8, 50, 4, 12);
        ctx.fillRect(140 + i * 8, -60, 4, 12);
      }
    }

    // Top Solder Mask (F.Mask)
    const fMask = layers.find(l => l.id === 'layer-f-mask');
    if (fMask && fMask.isVisible) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.fillRect(-215, -135, 430, 270);
    }

    // Highlight Selected Net (e.g., +1V2_FPGA_CORE)
    if (selectedNet) {
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 3.5;

      if (selectedNet === '+1V2_FPGA_CORE') {
        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(-80, -35);
        ctx.lineTo(-120, -70);
        ctx.lineTo(-180, -70);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.lineTo(-80, 35);
        ctx.lineTo(-120, 70);
        ctx.lineTo(-180, 70);
        ctx.stroke();
      } else if (selectedNet === 'ETH_TX_DIFF_P' || selectedNet === 'ETH_TX_DIFF_N') {
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.lineTo(130, 0);
        ctx.lineTo(160, 40);
        ctx.lineTo(190, 40);
        ctx.stroke();
      } else {
        // Generic active bus
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // Drill Holes (PTH / NPTH)
    const drill = layers.find(l => l.id === 'layer-drill');
    if (drill && drill.isVisible) {
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;

      // Microvias around BGA
      for (let r = -6; r <= 6; r += 2) {
        for (let c = -6; c <= 6; c += 2) {
          ctx.beginPath();
          ctx.arc(c * 7 + 3.5, r * 7 + 3.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }

      // Mounting Holes
      [-195, 195].forEach(x => {
        [-115, 115].forEach(y => {
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#020617';
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });
    }

    // Top Silkscreen (F.SilkS)
    const fSilk = layers.find(l => l.id === 'layer-f-silk');
    if (fSilk && fSilk.isVisible) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('U102 (UltraScale+)', -45, -50);
      ctx.fillText('J1 ETH', 150, -80);
      ctx.fillText('J2 PWR', -180, -90);
      ctx.fillText('NEXGILE AVN-401 REV 2.2', -100, 125);

      // Component Outlines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-50, -50, 100, 100);
      ctx.strokeRect(-165, -75, 45, 150);
      ctx.strokeRect(125, -75, 45, 150);
    }

    // Clearance Caliper Overlay
    if (showClearanceRuler) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(130, 0);
      ctx.lineTo(130, 6);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('3.8 mil Dam', 135, 4);
    }

    ctx.restore();
  }, [layers, selectedNet, zoom, panX, panY, showClearanceRuler]);

  return (
    <div id="gerber-viewer" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: Gerber Canvas Viewport (8 Cols on LG) */}
      <div className="lg:col-span-8 space-y-3">
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none">
          {/* Top Banner */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs border border-slate-700/80 px-3 py-1.5 rounded-lg text-slate-200 text-xs pointer-events-auto">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">{project.boardName}</span>
              <span className="text-emerald-300 font-mono text-[11px]">({project.layerCount} Layers)</span>
            </div>

            {/* Net Highlight Pill */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs pointer-events-auto">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 text-[11px]">Highlight Net:</span>
              <select
                aria-label="Highlight net trace"
                value={selectedNet}
                onChange={(e) => setSelectedNet(e.target.value)}
                className="bg-slate-800 text-cyan-300 font-mono font-bold text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-cyan-500"
              >
                {project.activeNets.map(net => (
                  <option key={net} value={net}>{net}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={720}
            height={460}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
          />

          {/* Bottom Zoom / Pan Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 p-2 rounded-xl text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowClearanceRuler(!showClearanceRuler)}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold text-[11px] transition-colors ${
                  showClearanceRuler ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                Clearance Ruler
              </button>
              <span className="text-[11px] text-slate-400 font-mono">Min Spacing: {project.minTraceClearanceMil} mil</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoom(1.0);
                  setPanX(0);
                  setPanY(0);
                }}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-semibold"
                title="Fit to Window"
              >
                Fit Screen
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(2.5, prev + 0.15))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Board Specifications Banner */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span>Thickness: <strong className="text-slate-800 font-mono">{project.thicknessMm} mm</strong></span>
            <span>Material: <strong className="text-slate-800 font-mono">Nelco N4000-13</strong></span>
            <span>DRC Violations: <strong className="text-emerald-700 font-bold font-mono">0 Passed</strong></span>
          </div>
          <span className="text-indigo-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            IPC-6012 Class 3 CAM Cleared
          </span>
        </div>
      </div>

      {/* RIGHT: Layer Stackup Manager (4 Cols on LG) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Gerber Stackup Layers ({layers.length})
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Toggle visibility</span>
          </div>

          <div className="space-y-2">
            {layers.map(layer => (
              <div
                key={layer.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  layer.isVisible
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-100/50 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    style={{ backgroundColor: layer.color }}
                    className="w-3.5 h-3.5 rounded shrink-0 border border-slate-400 shadow-2xs"
                  />
                  <div className="truncate">
                    <span className="font-bold text-slate-900 block text-[11px] truncate">
                      {layer.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {layer.layerCode} &bull; {layer.dcodeCount.toLocaleString()} D-Codes
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleLayer(layer.id)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 rounded transition-colors"
                >
                  {layer.isVisible ? <Eye className="w-4 h-4 text-indigo-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Impedance & DRC Summary Card */}
        <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xs p-4 space-y-2.5 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              Impedance & DRC Rules
            </span>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-mono px-2 py-0.5 rounded">
              Controlled Z0
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Single-Ended Traces:</span>
              <span className="font-mono text-slate-200 font-semibold">50 &Omega; &plusmn; 7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Differential High-Speed:</span>
              <span className="font-mono text-cyan-300 font-semibold">100 &Omega; &plusmn; 8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Blind Microvias:</span>
              <span className="font-mono text-slate-200 font-semibold">L1-L2 (4.0 mil laser)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
