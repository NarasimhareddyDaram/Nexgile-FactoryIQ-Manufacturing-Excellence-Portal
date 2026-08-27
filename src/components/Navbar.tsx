import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { User, Role, RoleCategory, RoleId } from '../types';

interface NavbarProps {
  currentUser: User;
  currentRole: Role;
  allRoles: Role[];
  onSwitchRole: (roleId: RoleId) => void;
  onLogout: () => void;
  onOpenNewProgram: () => void;
  onOpenStatusHistory: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  allRoles,
  onSwitchRole,
  onLogout,
  onOpenNewProgram,
  onOpenStatusHistory,
  searchTerm,
  onSearchChange,
  unreadNotificationsCount
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isInternal = currentRole.category === 'internal';

  const customerRoles = allRoles.filter(r => r.category === 'customer');
  const internalRoles = allRoles.filter(r => r.category === 'internal');

  // User initials
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shrink-0">
      {/* Left: Brand Identity matching Sleek Interface theme */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-900 shadow-sm shrink-0">
          <div className="h-5 w-5 border-2 border-white rounded-xs rotate-45" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
            Nexgile <span className="text-indigo-600 italic">FactoryIQ</span>
          </h1>
          <p className="hidden md:block text-[10px] text-slate-500 font-medium mt-0.5">
            Manufacturing Excellence & NPI Portal
          </p>
        </div>
      </div>

      {/* Center: Search & Perspective Indicator */}
      <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search programs, parts, ECOs, issues..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* View Mode Tag from Sleek theme */}
        <div
          className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 whitespace-nowrap border border-slate-200/80 shrink-0"
          title={isInternal ? 'Internal Mode: Full engineering detail & shopfloor telemetry' : 'Customer Mode: Executive summary & milestone delivery'}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${isInternal ? 'bg-indigo-600' : 'bg-emerald-500'}`} />
          <span>{isInternal ? `INTERNAL: ${currentRole.name.toUpperCase()}` : `CUSTOMER: ${currentRole.name.toUpperCase()}`}</span>
        </div>
      </div>

      {/* Right: Role Switcher, Notifications, Actions, User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Role Tester Switcher Dropdown */}
        <div className="relative" ref={roleMenuRef}>
          <button
            id="role-switcher-button"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
            <span className="hidden sm:inline text-slate-500">Switch Role:</span>
            <span className="font-bold text-slate-800 max-w-[110px] truncate">{currentRole.name}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">Switch User Perspective</p>
                <p className="text-[11px] text-slate-500">Live preview tailored customer vs internal views</p>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3 p-1">
                {/* Customer Roles */}
                <div>
                  <div className="flex items-center justify-between px-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 py-1 rounded">
                    <span>Customer-Side Roles</span>
                    <span>5 Roles</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {customerRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          onSwitchRole(role.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentRole.id === role.id
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{role.name}</span>
                        {currentRole.id === role.id && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal Roles */}
                <div>
                  <div className="flex items-center justify-between px-2.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 py-1 rounded">
                    <span>Internal Company Roles</span>
                    <span>6 Roles</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {internalRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          onSwitchRole(role.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentRole.id === role.id
                            ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{role.name}</span>
                        {currentRole.id === role.id && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifMenuRef}>
          <button
            id="notifications-bell-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-slate-700" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications & Real-time Alerts</span>
                <span className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">Critical Heat Alert: NX-BOT-AMR-DRIVE</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Health updated to Red. MOSFET thermal runaway investigation active.</p>
                    <span className="text-[10px] text-slate-400">1 hour ago</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCode className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">Pending ECO Approval Required</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">ECO-2026-088 for CAN-FD transceiver dual sourcing awaits sign-off.</p>
                    <span className="text-[10px] text-slate-400">3 hours ago</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-900">PVT Yield Target Achieved</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">NX-VM-BMS-G3 hit 98.4% first-pass yield on 10k batch.</p>
                    <span className="text-[10px] text-slate-400">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching Sleek avatar: w-10 h-10 bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="user-profile-menu-button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 rounded-lg p-0.5 hover:bg-slate-50 transition-colors"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-indigo-200"
              />
            ) : (
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                {initials}
              </div>
            )}
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[100px]">{currentUser.company}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden xl:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    isInternal ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentRole.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    {currentUser.company}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1.5 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Access Scope: </span>
                  {isInternal ? 'Full Internal Shopfloor Access' : 'Executive Customer Summary'}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out of Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

