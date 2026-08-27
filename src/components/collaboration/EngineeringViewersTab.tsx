import React, { useState } from 'react';
import {
  Box,
  Layers,
  FileSpreadsheet,
  Cpu,
  Sparkles,
  Info,
  Maximize2,
  FileCode
} from 'lucide-react';
import { Role, User } from '../../types';
import { Cad3DViewer } from './Cad3DViewer';
import { GerberViewer } from './GerberViewer';
import { InteractiveBomTable } from './InteractiveBomTable';

interface EngineeringViewersTabProps {
  currentRole: Role | null;
  currentUser: User | null;
}

type ViewerSubTabId = '3d-cad' | 'gerber' | 'bom-signals';

export function EngineeringViewersTab({ currentRole, currentUser }: EngineeringViewersTabProps) {
  const [activeViewer, setActiveViewer] = useState<ViewerSubTabId>('3d-cad');

  return (
    <div id="engineering-viewers-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Sub-navigation pills */}
      <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveViewer('3d-cad')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeViewer === '3d-cad'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Box className="w-4 h-4" />
            3D CAD Solid Assembly Viewer
          </button>

          <button
            onClick={() => setActiveViewer('gerber')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeViewer === 'gerber'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Gerber & Multi-Layer EDA Viewer
          </button>

          <button
            onClick={() => setActiveViewer('bom-signals')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeViewer === 'bom-signals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Interactive BOM Availability Signals
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono hidden md:inline">
          Program: <strong className="text-slate-700">PRG-AVN-401 (Avionics Gen-4)</strong>
        </span>
      </div>

      {/* Dynamic Viewer Render Area */}
      <div>
        {activeViewer === '3d-cad' && <Cad3DViewer />}
        {activeViewer === 'gerber' && <GerberViewer />}
        {activeViewer === 'bom-signals' && <InteractiveBomTable />}
      </div>
    </div>
  );
}
