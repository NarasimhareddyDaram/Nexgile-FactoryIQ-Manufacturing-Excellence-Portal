import {
  Program,
  StatusHistoryRecord,
  User,
  Role,
  Issue,
  Approval,
  Activity,
  NavSectionConfig
} from '../types';
import {
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_PROGRAMS,
  INITIAL_STATUS_HISTORY,
  INITIAL_ISSUES,
  INITIAL_APPROVALS,
  INITIAL_ACTIVITIES,
  NAV_SECTIONS
} from '../data/initialData';
import {
  STORAGE_KEYS,
  loadOrInitStorage,
  saveStorage
} from './storage';

export const api = {
  async getRoles(): Promise<Role[]> {
    try {
      const res = await fetch('/api/roles');
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.ROLES, data);
        return data;
      }
    } catch {
      // fallback to localStorage
    }
    return loadOrInitStorage(STORAGE_KEYS.ROLES, INITIAL_ROLES);
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.USERS, data);
        return data;
      }
    } catch {
      // fallback to localStorage
    }
    return loadOrInitStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async login(credentials: {
    userId?: string;
    roleId?: string;
    email?: string;
    name?: string;
    company?: string;
  }): Promise<{ user: User; role: Role }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) {
        const data = await res.json();
        saveStorage(STORAGE_KEYS.CURRENT_USER, data.user);
        return data;
      }
    } catch {
      // fallback to client-side localStorage
    }

    const roles = loadOrInitStorage(STORAGE_KEYS.ROLES, INITIAL_ROLES);
    const users = loadOrInitStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    let user = users.find(u => u.id === credentials.userId || u.roleId === credentials.roleId);
    if (!user) {
      const role = roles.find(r => r.id === credentials.roleId) || roles[0];
      user = {
        id: `usr-${Date.now()}`,
        name: credentials.name || 'Demo Enterprise User',
        email: credentials.email || 'user@nexgile.com',
        roleId: role.id,
        roleCategory: role.category,
        company: credentials.company || (role.category === 'internal' ? 'Nexgile Manufacturing' : 'Enterprise Partner'),
        department: role.name
      };
      // Save new user to users list in storage
      const updatedUsers = [user, ...users];
      saveStorage(STORAGE_KEYS.USERS, updatedUsers);
    }
    const role = roles.find(r => r.id === user.roleId) || roles[0];
    saveStorage(STORAGE_KEYS.CURRENT_USER, user);
    return { user, role };
  },

  getSavedUser(): User | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  },

  async getPrograms(filters?: { health?: string; stage?: string }): Promise<Program[]> {
    let progs: Program[] = [];
    try {
      const query = new URLSearchParams();
      if (filters?.health) query.append('health', filters.health);
      if (filters?.stage) query.append('stage', filters.stage);
      const res = await fetch(`/api/programs?${query.toString()}`);
      if (res.ok) {
        progs = await res.json();
        saveStorage(STORAGE_KEYS.PROGRAMS, progs);
      }
    } catch {
      // fallback
    }

    if (!progs.length) {
      progs = loadOrInitStorage(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    }

    if (filters?.health && filters.health !== 'all') {
      progs = progs.filter(p => p.health === filters.health);
    }
    if (filters?.stage && filters.stage !== 'all') {
      progs = progs.filter(p => p.stage === filters.stage);
    }

    return progs;
  },

  async createProgram(programData: Partial<Program> & { authorName?: string; authorRole?: string }): Promise<Program> {
    const existingPrograms = loadOrInitStorage(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);

    const newProg: Program = {
      id: `prog-${Date.now()}`,
      code: programData.code || `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      name: programData.name || 'New Manufacturing Project',
      customerName: programData.customerName || 'Enterprise OEM',
      productCategory: programData.productCategory || 'Hardware Subsystem',
      facility: programData.facility || 'Plant 1 (Austin)',
      stage: programData.stage || 'EVT (Engineering Validation)',
      health: programData.health || 'green',
      progressPercent: programData.progressPercent || 15,
      targetLaunchDate: programData.targetLaunchDate || '2027-01-15',
      targetVolume: programData.targetVolume || 20000,
      currentUnitsBuilt: programData.currentUnitsBuilt || 0,
      currentYieldPercent: programData.currentYieldPercent || 98.5,
      internalScrapPercent: programData.internalScrapPercent || 1.5,
      openIssuesCount: 0,
      pendingApprovalsCount: 0,
      customerSummary: programData.customerSummary || 'Initial project charter established.',
      internalNotes: programData.internalNotes || 'Tooling and line readiness underway.',
      keyMilestones: [
        { id: `m-${Date.now()}-1`, title: 'EVT Prototype Run', dueDate: '2026-10-15', status: 'on_track', completionPercent: 25 },
        { id: `m-${Date.now()}-2`, title: 'DVT Tooling Sign-off', dueDate: '2026-12-01', status: 'on_track', completionPercent: 0 }
      ],
      updatedAt: new Date().toISOString()
    };

    // Try backend if running, otherwise update storage
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData)
      });
      if (res.ok) {
        const data = await res.json();
        const updated = [data, ...existingPrograms.filter(p => p.id !== data.id)];
        saveStorage(STORAGE_KEYS.PROGRAMS, updated);
        return data;
      }
    } catch {
      // fallback
    }

    const updated = [newProg, ...existingPrograms];
    saveStorage(STORAGE_KEYS.PROGRAMS, updated);

    // Also append to status history and activity in storage
    const historyList = loadOrInitStorage(STORAGE_KEYS.STATUS_HISTORY, INITIAL_STATUS_HISTORY);
    const newHistory: StatusHistoryRecord = {
      id: `sh-${Date.now()}`,
      programId: newProg.id,
      programName: newProg.name,
      changedByName: programData.authorName || 'Program Manager',
      category: 'Stage Transition',
      newStatus: `${newProg.stage} Kickoff`,
      reason: 'Program created and initialized in portal.',
      isInternalOnly: false,
      createdAt: new Date().toISOString()
    };
    saveStorage(STORAGE_KEYS.STATUS_HISTORY, [newHistory, ...historyList]);

    const activityList = loadOrInitStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user: programData.authorName || 'Program Office',
      action: `Created new project charter: ${newProg.code} (${newProg.name})`,
      timestamp: 'Just now',
      type: 'status_change',
      programCode: newProg.code
    };
    saveStorage(STORAGE_KEYS.ACTIVITIES, [newActivity, ...activityList]);

    return newProg;
  },

  async updateStatusHistory(programId: string, payload: {
    changedByName: string;
    category: StatusHistoryRecord['category'];
    newStatus: string;
    reason: string;
    health?: 'green' | 'yellow' | 'red';
    stage?: string;
    currentYieldPercent?: number;
    customerSummary?: string;
    internalNotes?: string;
    isInternalOnly?: boolean;
  }): Promise<{ success: boolean; program?: Program; historyEntry?: StatusHistoryRecord }> {
    const existingPrograms = loadOrInitStorage(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
    const existingHistory = loadOrInitStorage(STORAGE_KEYS.STATUS_HISTORY, INITIAL_STATUS_HISTORY);

    const targetProgram = existingPrograms.find(p => p.id === programId);
    const historyEntry: StatusHistoryRecord = {
      id: `sh-${Date.now()}`,
      programId,
      programName: targetProgram?.name || programId,
      changedByName: payload.changedByName,
      category: payload.category,
      newStatus: payload.newStatus,
      reason: payload.reason,
      isInternalOnly: Boolean(payload.isInternalOnly),
      createdAt: new Date().toISOString()
    };

    // Update programs list
    const updatedPrograms = existingPrograms.map(p => {
      if (p.id === programId) {
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
    });

    saveStorage(STORAGE_KEYS.PROGRAMS, updatedPrograms);
    saveStorage(STORAGE_KEYS.STATUS_HISTORY, [historyEntry, ...existingHistory]);

    // Also update activity list
    const existingActivities = loadOrInitStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user: payload.changedByName,
      action: `Updated status for ${targetProgram?.code || programId}: "${payload.newStatus}" (${payload.category})`,
      timestamp: 'Just now',
      type: 'status_change',
      programCode: targetProgram?.code
    };
    saveStorage(STORAGE_KEYS.ACTIVITIES, [newActivity, ...existingActivities]);

    try {
      await fetch(`/api/programs/${programId}/status-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // ignore
    }

    return { success: true, historyEntry };
  },

  async getStatusHistory(programId?: string): Promise<StatusHistoryRecord[]> {
    const list = loadOrInitStorage(STORAGE_KEYS.STATUS_HISTORY, INITIAL_STATUS_HISTORY);
    return programId ? list.filter(sh => sh.programId === programId) : list;
  },

  async getIssues(programId?: string): Promise<Issue[]> {
    const list = loadOrInitStorage(STORAGE_KEYS.ISSUES, INITIAL_ISSUES);
    return programId ? list.filter(i => i.programId === programId) : list;
  },

  async getApprovals(programId?: string): Promise<Approval[]> {
    const list = loadOrInitStorage(STORAGE_KEYS.APPROVALS, INITIAL_APPROVALS);
    return programId ? list.filter(a => a.programId === programId) : list;
  },

  async decideApproval(approvalId: string, decision: 'approved' | 'rejected', decidedBy: string): Promise<boolean> {
    const existingApprovals = loadOrInitStorage(STORAGE_KEYS.APPROVALS, INITIAL_APPROVALS);
    const updated = existingApprovals.map(a =>
      a.id === approvalId ? { ...a, status: decision } : a
    );
    saveStorage(STORAGE_KEYS.APPROVALS, updated);

    try {
      await fetch(`/api/approvals/${approvalId}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, decidedBy })
      });
    } catch {
      // ignore
    }
    return true;
  },

  async getActivities(): Promise<Activity[]> {
    return loadOrInitStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },

  async getNavSections(): Promise<NavSectionConfig[]> {
    return NAV_SECTIONS;
  }
};
