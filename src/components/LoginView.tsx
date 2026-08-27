import React, { useState } from 'react';
import {
  Factory,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Cpu,
  Boxes,
  Wrench,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { Role, RoleCategory, RoleId, User } from '../types';

interface LoginViewProps {
  roles: Role[];
  users: User[];
  onSelectUser: (user: User, role: Role) => void;
  onCustomLogin: (credentials: {
    roleId: RoleId;
    name: string;
    email: string;
    company: string;
    roleCategory: RoleCategory;
  }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  roles,
  users,
  onSelectUser,
  onCustomLogin
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('customer_pm');
  const [selectedCategory, setSelectedCategory] = useState<RoleCategory>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const customerRoles = roles.filter(r => r.category === 'customer');
  const internalRoles = roles.filter(r => r.category === 'internal');

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleRoleCardClick = (role: Role) => {
    setSelectedRoleId(role.id);
    setSelectedCategory(role.category);
    const match = users.find(u => u.roleId === role.id);
    if (match) {
      setName(match.name);
      setEmail(match.email);
      setCompany(match.company);
    }
  };

  const handleQuickLogin = (user: User) => {
    const role = roles.find(r => r.id === user.roleId) || roles[0];
    onSelectUser(user, role);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomLogin({
      roleId: selectedRoleId,
      name: name || 'Enterprise Portal User',
      email: email || `${selectedRoleId}@manufacturing-portal.com`,
      company: company || (selectedCategory === 'internal' ? 'Nexgile Manufacturing' : 'Enterprise OEM Partner'),
      roleCategory: selectedCategory
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-900 shadow-md text-white mb-3">
            <Factory className="h-6 w-6 text-indigo-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Nexgile<span className="text-indigo-600">-FactoryIQ</span>
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            Manufacturing Excellence & Multi-Role Collaboration Portal for R&D, NPI, Production, Quality, Supply Chain & After-Sales.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden">
          {/* Top Mode Selector Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              1-Click Demo Profiles (All 11 Roles)
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="h-4 w-4" />
              Custom Enterprise Sign-In / Role Config
            </button>
          </div>

          <div className="p-6 sm:p-7">
            {activeTab === 'quick' ? (
              <div>
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Select a Persona to Enter Portal</h2>
                    <p className="text-xs text-slate-500">
                      Experience how different roles see tailored summaries vs full deep shopfloor telemetry.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 5 Customer Roles
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> 6 Internal Roles
                    </span>
                  </div>
                </div>

                {/* Grid of Roles */}
                <div className="space-y-6">
                  {/* Customer-Side Roles Group */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Customer-Side Roles (Summary Detail & Approvals)
                      </span>
                      <span className="text-[11px] text-slate-400">Executive & Milestone Focus</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {customerRoles.map((role) => {
                        const matchingUser = users.find(u => u.roleId === role.id);
                        return (
                          <div
                            key={role.id}
                            onClick={() => matchingUser && handleQuickLogin(matchingUser)}
                            className="group relative flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="inline-flex items-center rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  {role.name}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                              </div>
                              {matchingUser && (
                                <div className="flex items-center gap-2 mb-2">
                                  {matchingUser.avatar && (
                                    <img
                                      src={matchingUser.avatar}
                                      alt={matchingUser.name}
                                      referrerPolicy="no-referrer"
                                      className="h-6 w-6 rounded-full object-cover border border-slate-200"
                                    />
                                  )}
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 leading-tight">{matchingUser.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{matchingUser.company}</p>
                                  </div>
                                </div>
                              )}
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                {role.description}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-medium">
                              <span>Click to Launch</span>
                              <span className="text-slate-400 font-normal">Summary View</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Internal (Company) Roles Group */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <Factory className="h-3.5 w-3.5 text-indigo-600" /> Internal Company Roles (Full Engineering & Shopfloor Details)
                      </span>
                      <span className="text-[11px] text-slate-400">Deep Operational & Telemetry Focus</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {internalRoles.map((role) => {
                        const matchingUser = users.find(u => u.roleId === role.id);
                        return (
                          <div
                            key={role.id}
                            onClick={() => matchingUser && handleQuickLogin(matchingUser)}
                            className="group relative flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:shadow-sm transition-all cursor-pointer"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="inline-flex items-center rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                  {role.name}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                              </div>
                              {matchingUser && (
                                <div className="flex items-center gap-2 mb-2">
                                  {matchingUser.avatar && (
                                    <img
                                      src={matchingUser.avatar}
                                      alt={matchingUser.name}
                                      referrerPolicy="no-referrer"
                                      className="h-6 w-6 rounded-full object-cover border border-slate-200"
                                    />
                                  )}
                                  <div>
                                    <p className="text-xs font-bold text-slate-800 leading-tight">{matchingUser.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{matchingUser.department}</p>
                                  </div>
                                </div>
                              )}
                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                {role.description}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-indigo-700 font-medium">
                              <span>Click to Launch</span>
                              <span className="text-slate-400 font-normal">Full Detail</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Custom Form Sign-In */
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    1. Select Role & Access Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                    {roles.map((r) => {
                      const isSelected = selectedRoleId === r.id;
                      const isCust = r.category === 'customer';
                      return (
                        <div
                          key={r.id}
                          onClick={() => handleRoleCardClick(r)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800">{r.name}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                isCust ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {r.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{r.focusArea}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Lin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enterprise Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah.lin@voltmobility.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VoltMobility EV or Nexgile Manufacturing"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50 text-xs text-indigo-900 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Active Permission Tier: {selectedRole.name}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Permissions: {selectedRole.permissions.join(', ')} ({selectedRole.detailLevel === 'full' ? 'Full Internal Shopfloor Access' : 'Executive Customer Summary'})
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Portal with Role: {selectedRole.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Supabase Database Schema & REST API Connected</span>
            </div>
            <span>Enterprise Security & Multi-Tenant Role Isolation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
