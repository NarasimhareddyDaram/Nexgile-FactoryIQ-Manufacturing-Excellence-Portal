import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { HomeDashboard } from './components/HomeDashboard';
import { PlaceholderModulePage } from './components/PlaceholderModulePage';
import { ProgramDetailDrawer } from './components/ProgramDetailDrawer';
import { StatusHistoryModal } from './components/StatusHistoryModal';
import { NewProgramModal } from './components/NewProgramModal';
import { DatabaseSchemaModal } from './components/DatabaseSchemaModal';
import { ProgramTrackingPage } from './components/programs/ProgramTrackingPage';
import { ProductionVisibilityPage } from './components/production/ProductionVisibilityPage';
import { QualityManagementPage } from './components/quality/QualityManagementPage';
import { SupplyChainPage } from './components/supplychain/SupplyChainPage';
import { AfterSalesPage } from './components/aftersales/AfterSalesPage';
import { CollaborationPage } from './components/collaboration/CollaborationPage';
import { AnalyticsReportingPage } from './components/analytics/AnalyticsReportingPage';
import { api } from './lib/api';
import {
  User,
  Role,
  RoleId,
  RoleCategory,
  Program,
  StatusHistoryRecord,
  Issue,
  Approval,
  Activity,
  NavigationSectionId,
  NavSectionConfig
} from './types';
import {
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_PROGRAMS,
  INITIAL_STATUS_HISTORY,
  INITIAL_ISSUES,
  INITIAL_APPROVALS,
  INITIAL_ACTIVITIES,
  NAV_SECTIONS
} from './data/initialData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>(INITIAL_ROLES);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [programs, setPrograms] = useState<Program[]>(INITIAL_PROGRAMS);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryRecord[]>(INITIAL_STATUS_HISTORY);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [approvals, setApprovals] = useState<Approval[]>(INITIAL_APPROVALS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [navSections, setNavSections] = useState<NavSectionConfig[]>(NAV_SECTIONS);

  const [currentSection, setCurrentSection] = useState<NavigationSectionId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers State
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showStatusHistoryModal, setShowStatusHistoryModal] = useState(false);
  const [statusModalTargetProgram, setStatusModalTargetProgram] = useState<Program | null>(null);
  const [showNewProgramModal, setShowNewProgramModal] = useState(false);
  const [showDatabaseSchemaModal, setShowDatabaseSchemaModal] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [r, u, p, sh, iss, app, act, nav] = await Promise.all([
          api.getRoles(),
          api.getUsers(),
          api.getPrograms(),
          api.getStatusHistory(),
          api.getIssues(),
          api.getApprovals(),
          api.getActivities(),
          api.getNavSections()
        ]);

        if (r && r.length) setAllRoles(r);
        if (u && u.length) setAllUsers(u);
        if (p && p.length) setPrograms(p);
        if (sh && sh.length) setStatusHistory(sh);
        if (iss && iss.length) setIssues(iss);
        if (app && app.length) setApprovals(app);
        if (act && act.length) setActivities(act);
        if (nav && nav.length) setNavSections(nav);

        // Check if user was saved or default to first user
        const savedUser = api.getSavedUser();
        if (savedUser) {
          setCurrentUser(savedUser);
          const matchedRole = (r || INITIAL_ROLES).find(role => role.id === savedUser.roleId) || INITIAL_ROLES[0];
          setCurrentRole(matchedRole);
        } else {
          // Default to Customer Program Manager for instant preview
          const defaultUser = (u || INITIAL_USERS)[0];
          const defaultRole = (r || INITIAL_ROLES).find(role => role.id === defaultUser.roleId) || INITIAL_ROLES[0];
          setCurrentUser(defaultUser);
          setCurrentRole(defaultRole);
        }
      } catch (err) {
        console.error('Data initialization error:', err);
      }
    }
    loadData();
  }, []);

  // Handle Switch Role
  const handleSwitchRole = (roleId: RoleId) => {
    const role = allRoles.find(r => r.id === roleId);
    if (!role) return;

    // Find existing user with that role or adapt current user
    const matchingUser = allUsers.find(u => u.roleId === roleId);
    if (matchingUser) {
      setCurrentUser(matchingUser);
      setCurrentRole(role);
    } else if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        roleId: role.id,
        roleCategory: role.category,
        department: role.name,
        company: role.category === 'internal' ? 'Nexgile Manufacturing' : currentUser.company
      };
      setCurrentUser(updatedUser);
      setCurrentRole(role);
    }
  };

  // Handle Login from LoginView
  const handleUserSelect = (user: User, role: Role) => {
    setCurrentUser(user);
    setCurrentRole(role);
  };

  // Handle Custom Login
  const handleCustomLogin = async (credentials: {
    roleId: RoleId;
    name: string;
    email: string;
    company: string;
    roleCategory: RoleCategory;
  }) => {
    const role = allRoles.find(r => r.id === credentials.roleId) || allRoles[0];
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      roleId: role.id,
      roleCategory: credentials.roleCategory,
      company: credentials.company,
      department: role.name
    };

    setCurrentUser(newUser);
    setCurrentRole(role);
    setAllUsers(prev => [newUser, ...prev]);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
  };

  // Handle Create Program
  const handleCreateProgram = async (programData: Partial<Program>) => {
    const created = await api.createProgram({
      ...programData,
      authorName: currentUser?.name || 'System User',
      authorRole: currentRole?.name || 'Program Office'
    });
    setPrograms(prev => [created, ...prev]);

    // Refresh status history
    const updatedHistory = await api.getStatusHistory();
    setStatusHistory(updatedHistory);
  };

  // Handle Submit Status Update
  const handleSubmitStatusUpdate = async (payload: {
    programId: string;
    category: StatusHistoryRecord['category'];
    newStatus: string;
    reason: string;
    health?: 'green' | 'yellow' | 'red';
    stage?: string;
    currentYieldPercent?: number;
    customerSummary?: string;
    internalNotes?: string;
    isInternalOnly?: boolean;
  }) => {
    const res = await api.updateStatusHistory(payload.programId, {
      ...payload,
      changedByName: currentUser ? `${currentUser.name} (${currentRole?.name})` : 'Authorized User'
    });

    // Update programs list
    setPrograms(prev =>
      prev.map(p => {
        if (p.id === payload.programId) {
          return {
            ...p,
            health: payload.health || p.health,
            stage: (payload.stage as any) || p.stage,
            currentYieldPercent: payload.currentYieldPercent ?? p.currentYieldPercent,
            customerSummary: payload.customerSummary || p.customerSummary,
            internalNotes: payload.internalNotes || p.internalNotes,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    // Refresh history
    const refreshed = await api.getStatusHistory();
    setStatusHistory(refreshed);

    // Refresh activities
    const refreshedAct = await api.getActivities();
    setActivities(refreshedAct);
  };

  // Handle Approve / Reject
  const handleDecideApproval = async (approvalId: string, decision: 'approved' | 'rejected') => {
    await api.decideApproval(approvalId, decision, currentUser?.name || 'Authorized Lead');
    setApprovals(prev =>
      prev.map(a => (a.id === approvalId ? { ...a, status: decision } : a))
    );
  };

  // Open Status History Modal with optional target program
  const handleOpenStatusHistoryModal = (program?: Program) => {
    setStatusModalTargetProgram(program || null);
    setShowStatusHistoryModal(true);
  };

  // If not logged in, show LoginView
  if (!currentUser || !currentRole) {
    return (
      <LoginView
        roles={allRoles}
        users={allUsers}
        onSelectUser={handleUserSelect}
        onCustomLogin={handleCustomLogin}
      />
    );
  }

  // Active section configuration
  const activeSectionConfig = navSections.find(s => s.id === currentSection) || navSections[0];

  return (
    <div className="flex h-screen w-full flex-col bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        allRoles={allRoles}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        onOpenNewProgram={() => setShowNewProgramModal(true)}
        onOpenStatusHistory={() => handleOpenStatusHistoryModal()}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        unreadNotificationsCount={3}
      />

      {/* Main Container: Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Menu */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          sections={navSections}
          currentRole={currentRole}
          currentUser={currentUser}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenStatusHistory={() => handleOpenStatusHistoryModal()}
          onOpenDatabaseSchema={() => setShowDatabaseSchemaModal(true)}
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {currentSection === 'dashboard' ? (
              <HomeDashboard
                programs={programs}
                statusHistory={statusHistory}
                issues={issues}
                approvals={approvals}
                activities={activities}
                currentRole={currentRole}
                currentUser={currentUser}
                onSelectProgram={setSelectedProgram}
                onOpenNewProgram={() => setShowNewProgramModal(true)}
                onOpenStatusHistoryModal={handleOpenStatusHistoryModal}
                onDecideApproval={handleDecideApproval}
                onNavigateSection={setCurrentSection}
                searchTerm={searchTerm}
              />
            ) : currentSection === 'programs' ? (
              <ProgramTrackingPage
                programs={programs}
                statusHistory={statusHistory}
                currentRole={currentRole}
                currentUser={currentUser}
                onSelectProgram={setSelectedProgram}
                onOpenStatusHistoryModal={handleOpenStatusHistoryModal}
                onOpenNewProgramModal={() => setShowNewProgramModal(true)}
              />
            ) : currentSection === 'production' ? (
              <ProductionVisibilityPage
                currentRole={currentRole}
                currentUser={currentUser}
              />
            ) : currentSection === 'quality' ? (
              <QualityManagementPage
                currentRole={currentRole}
                currentUser={currentUser}
              />
            ) : currentSection === 'supply_chain' ? (
              <SupplyChainPage
                currentRole={currentRole}
                currentUser={currentUser}
              />
            ) : currentSection === 'after_sales' ? (
              <AfterSalesPage
                currentRole={currentRole}
                currentUser={currentUser}
              />
            ) : currentSection === 'collaboration' ? (
              <CollaborationPage
                currentRole={currentRole}
                currentUser={currentUser}
              />
            ) : currentSection === 'analytics' ? (
              <AnalyticsReportingPage
                currentRole={currentRole}
                currentUser={currentUser}
              />
            ) : (
              <PlaceholderModulePage
                section={activeSectionConfig}
                currentRole={currentRole}
                currentUser={currentUser}
                onNavigateHome={() => setCurrentSection('dashboard')}
              />
            )}
          </div>
        </main>
      </div>

      {/* Program Detail Drawer */}
      {selectedProgram && (
        <ProgramDetailDrawer
          program={selectedProgram}
          currentRole={currentRole}
          currentUser={currentUser}
          statusHistory={statusHistory}
          issues={issues}
          approvals={approvals}
          onClose={() => setSelectedProgram(null)}
          onOpenStatusUpdate={(prog) => {
            setSelectedProgram(null);
            handleOpenStatusHistoryModal(prog);
          }}
        />
      )}

      {/* Status History Modal */}
      {showStatusHistoryModal && (
        <StatusHistoryModal
          programs={programs}
          selectedProgram={statusModalTargetProgram}
          statusHistory={statusHistory}
          currentRole={currentRole}
          currentUser={currentUser}
          onClose={() => {
            setShowStatusHistoryModal(false);
            setStatusModalTargetProgram(null);
          }}
          onSubmitStatusUpdate={handleSubmitStatusUpdate}
        />
      )}

      {/* New Program Modal */}
      {showNewProgramModal && (
        <NewProgramModal
          currentRole={currentRole}
          currentUser={currentUser}
          onClose={() => setShowNewProgramModal(false)}
          onCreateProgram={handleCreateProgram}
        />
      )}

      {/* Database Schema Modal */}
      {showDatabaseSchemaModal && (
        <DatabaseSchemaModal
          onClose={() => setShowDatabaseSchemaModal(false)}
        />
      )}
    </div>
  );
}
