import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCw,
  Sliders,
  ZoomIn,
  ZoomOut,
  Scissors,
  CheckCircle2,
  Shield,
  Sparkles,
  Info,
  Ruler
} from 'lucide-react';
import { Cad3DModel, CadPartNode } from '../../types';
import { INITIAL_CAD_MODELS } from '../../data/collaborationData';

export function Cad3DViewer() {
  const [model, setModel] = useState<Cad3DModel>(INITIAL_CAD_MODELS[0]);
  const [parts, setParts] = useState<CadPartNode[]>(INITIAL_CAD_MODELS[0].parts);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(parts[3].id); // Default select PCBA
  
  // 3D Canvas Controls State
  const [rotationX, setRotationX] = useState<number>(25);
  const [rotationY, setRotationY] = useState<number>(-35);
  const [zoom, setZoom] = useState<number>(1.0);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'xray'>('solid');
  const [explodeFactor, setExplodeFactor] = useState<number>(35); // 0 to 100%
  const [sectionPlaneY, setSectionPlaneY] = useState<number>(0);
  const [showSectionCut, setShowSectionCut] = useState<boolean>(false);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto-rotate tick
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.8) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Toggle Part Visibility
  const handleTogglePartVisibility = (partId: string) => {
    setParts(parts.map(p => p.id === partId ? { ...p, isVisible: !p.isVisible } : p));
  };

  // Canvas Mouse Interaction for 3D Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setRotationY(prev => (prev + deltaX * 0.6) % 360);
    setRotationX(prev => Math.max(-80, Math.min(80, prev - deltaY * 0.6)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Draw 3D Isometric Projection on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Save context
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);

    // Draw isometric grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let i = -200; i <= 200; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, -200);
      ctx.lineTo(i, 200);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-200, i);
      ctx.lineTo(200, i);
      ctx.stroke();
    }

    // Convert angles to radians
    const radX = (rotationX * Math.PI) / 180;
    const radY = (rotationY * Math.PI) / 180;

    // Helper: 3D point projection to 2D
    const project = (x: number, y: number, z: number) => {
      // Y-axis rotation
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // X-axis rotation
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

      // Perspective scale factor
      const fov = 600;
      const scale = fov / (fov + z2 + 200);
      return {
        x: x1 * scale,
        y: y2 * scale,
        depth: z2
      };
    };

    // Render Parts in Depth-Sorted Order
    const sortedParts = [...parts]
      .filter(p => p.isVisible)
      .map(part => {
        const explodeY = (part.positionOffset[1] * (explodeFactor / 100) * 2.2);
        const [baseX, baseY, baseZ] = part.positionOffset;
        const center = project(baseX, baseY + explodeY, baseZ);
        return { part, explodeY, depth: center.depth };
      })
      .sort((a, b) => b.depth - a.depth); // Render back-to-front

    sortedParts.forEach(({ part, explodeY }) => {
      const isSelected = part.id === selectedPartId;
      const [offsetX, baseY, offsetZ] = part.positionOffset;
      const posY = baseY + explodeY;

      // Define Part Dimensions based on Category
      let halfW = 120;
      let halfH = 14;
      let halfD = 85;

      if (part.category === 'PCB') {
        halfW = 110;
        halfH = 3;
        halfD = 80;
      } else if (part.category === 'Heatsink') {
        halfW = 95;
        halfH = 18;
        halfD = 70;
      } else if (part.category === 'IC') {
        halfW = 25;
        halfH = 4;
        halfD = 25;
      } else if (part.category === 'Connector') {
        halfW = 18;
        halfH = 20;
        halfD = 18;
      } else if (part.category === 'Hardware') {
        halfW = 60;
        halfH = 6;
        halfD = 45;
      }

      // Box 8 Vertices
      const vertices = [
        project(offsetX - halfW, posY - halfH, offsetZ - halfD), // 0: Top Front Left
        project(offsetX + halfW, posY - halfH, offsetZ - halfD), // 1: Top Front Right
        project(offsetX + halfW, posY + halfH, offsetZ - halfD), // 2: Bottom Front Right
        project(offsetX - halfW, posY + halfH, offsetZ - halfD), // 3: Bottom Front Left
        project(offsetX - halfW, posY - halfH, offsetZ + halfD), // 4: Top Back Left
        project(offsetX + halfW, posY - halfH, offsetZ + halfD), // 5: Top Back Right
        project(offsetX + halfW, posY + halfH, offsetZ + halfD), // 6: Bottom Back Right
        project(offsetX - halfW, posY + halfH, offsetZ + halfD)  // 7: Bottom Back Left
      ];

      // Faces (4 vertices each)
      const faces = [
        { indices: [0, 1, 2, 3], normalShade: 0.9 }, // Front
        { indices: [5, 4, 7, 6], normalShade: 0.7 }, // Back
        { indices: [4, 5, 1, 0], normalShade: 1.1 }, // Top
        { indices: [3, 2, 6, 7], normalShade: 0.6 }, // Bottom
        { indices: [4, 0, 3, 7], normalShade: 0.8 }, // Left
        { indices: [1, 5, 6, 2], normalShade: 0.85 } // Right
      ];

      faces.forEach(({ indices, normalShade }) => {
        ctx.beginPath();
        ctx.moveTo(vertices[indices[0]].x, vertices[indices[0]].y);
        for (let i = 1; i < indices.length; i++) {
          ctx.lineTo(vertices[indices[i]].x, vertices[indices[i]].y);
        }
        ctx.closePath();

        if (renderMode === 'wireframe') {
          ctx.strokeStyle = isSelected ? '#38bdf8' : part.color;
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.stroke();
        } else if (renderMode === 'xray') {
          ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.4)' : `${part.color}22`;
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#38bdf8' : `${part.color}88`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Solid shaded
          ctx.fillStyle = isSelected ? '#0284c7' : part.color;
          ctx.globalAlpha = part.opacity * (isSelected ? 1.0 : 0.95);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(15, 23, 42, 0.4)';
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.stroke();
        }
      });

      // Special RefDes Details for ICs
      if (part.category === 'IC') {
        const pTop = project(offsetX, posY - halfH - 2, offsetZ);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(part.name.split(' ')[0], pTop.x, pTop.y);
      }
    });

    // Measurement Caliper Line if Active
    if (isMeasuring && sortedParts.length > 0) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(-110, 0);
      ctx.lineTo(110, 0);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('185.0 mm', 0, -8);
    }

    ctx.restore();
  }, [rotationX, rotationY, zoom, renderMode, explodeFactor, parts, selectedPartId, isMeasuring]);

  const selectedPart = parts.find(p => p.id === selectedPartId);

  return (
    <div id="cad-3d-viewer" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 3D Canvas Viewport (8 Cols on LG) */}
      <div className="lg:col-span-8 space-y-3">
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none">
          {/* Top Overlay Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs border border-slate-700/80 px-3 py-1.5 rounded-lg text-slate-200 text-xs pointer-events-auto">
              <Box className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white">{model.name}</span>
              <span className="font-mono text-indigo-300 text-[11px]">[{model.revision}]</span>
            </div>

            {/* View Mode Pills */}
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs border border-slate-700/80 p-1 rounded-lg pointer-events-auto text-xs">
              <button
                onClick={() => setRenderMode('solid')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  renderMode === 'solid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => setRenderMode('wireframe')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  renderMode === 'wireframe' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wireframe
              </button>
              <button
                onClick={() => setRenderMode('xray')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  renderMode === 'xray' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                X-Ray
              </button>
            </div>
          </div>

          {/* Canvas Render Area */}
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

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 p-2 rounded-xl text-xs text-slate-300">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-semibold text-[11px] whitespace-nowrap">Explode View:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={explodeFactor}
                onChange={(e) => setExplodeFactor(Number(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-indigo-300 w-8">{explodeFactor}%</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMeasuring(!isMeasuring)}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold text-[11px] transition-colors ${
                  isMeasuring ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Measure Dimensions"
              >
                <Ruler className="w-3.5 h-3.5" />
                Measure
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold text-[11px] transition-colors ${
                  autoRotate ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Toggle Auto Rotation"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                Rotate
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setRotationX(25);
                  setRotationY(-35);
                  setZoom(1.0);
                  setExplodeFactor(35);
                }}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-semibold"
                title="Reset View"
              >
                Reset
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CAD Telemetry Banner */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span>Dimensions: <strong className="text-slate-800 font-mono">{model.dimensions}</strong></span>
            <span>Triangles: <strong className="text-slate-800 font-mono">{model.polyCount.toLocaleString()}</strong></span>
            <span>Format: <strong className="text-slate-800">{model.format}</strong></span>
          </div>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            STEP AP242 Verified
          </span>
        </div>
      </div>

      {/* Assembly Tree & Part Inspector (4 Cols on LG) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Assembly Hierarchy List */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Assembly Part Tree ({parts.length})
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Click to inspect</span>
          </div>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
            {parts.map(part => {
              const isSelected = part.id === selectedPartId;

              return (
                <div
                  key={part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400/30'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      style={{ backgroundColor: part.color }}
                      className="w-3 h-3 rounded-full shrink-0 border border-slate-400"
                    />
                    <span className="font-bold text-slate-900 truncate text-[11px]">{part.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">{part.weightGrams}g</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePartVisibility(part.id);
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                    >
                      {part.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-300" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Part Material Spec Card */}
        {selectedPart && (
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xs p-4 space-y-2.5 text-left animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                {selectedPart.category} Node Inspector
              </span>
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-[10px] font-mono px-2 py-0.5 rounded">
                Offset Y: {selectedPart.positionOffset[1]}mm
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-100">{selectedPart.name}</h3>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Material Alloy:</span>
                <span className="font-semibold text-slate-200">{selectedPart.material}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Mass Spec:</span>
                <span className="font-semibold text-emerald-400">{selectedPart.weightGrams} grams</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Layer Separation:</span>
              <span className="font-mono text-cyan-400 font-semibold">
                +{(selectedPart.positionOffset[1] * (explodeFactor / 100) * 2.2).toFixed(1)} mm
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
