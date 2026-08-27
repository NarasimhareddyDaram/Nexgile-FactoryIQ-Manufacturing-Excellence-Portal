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

// Local storage keys for state persistence
const STORAGE_KEY_PROGRAMS = 'nexgile_programs_v1';
const STORAGE_KEY_HISTORY = 'nexgile_status_history_v1';
const STORAGE_KEY_USER = 'nexgile_current_user_v1';
const STORAGE_KEY_ISSUES = 'nexgile_issues_v1';
const STORAGE_KEY_APPROVALS = 'nexgile_approvals_v1';

export const api = {
  async getRoles(): Promise<Role[]> {
    try {
      const res = await fetch('/api/roles');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return INITIAL_ROLES;
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return INITIAL_USERS;
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
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        return data;
      }
    } catch {
      // fallback
    }

    const roles = INITIAL_ROLES;
    const users = INITIAL_USERS;
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
    }
    const role = roles.find(r => r.id === user.roleId) || roles[0];
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return { user, role };
  },

  getSavedUser(): User | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  },

  async getPrograms(filters?: { health?: string; stage?: string }): Promise<Program[]> {
    try {
      const query = new URLSearchParams();
      if (filters?.health) query.append('health', filters.health);
      if (filters?.stage) query.append('stage', filters.stage);
      const res = await fetch(`/api/programs?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEY_PROGRAMS, JSON.stringify(data));
        return data;
      }
    } catch {
      // fallback
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRAMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROGRAMS;
  },

  async createProgram(programData: Partial<Program> & { authorName?: string; authorRole?: string }): Promise<Program> {
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

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
    try {
      const res = await fetch(`/api/programs/${programId}/status-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const historyEntry: StatusHistoryRecord = {
      id: `sh-${Date.now()}`,
      programId,
      programName: programId,
      changedByName: payload.changedByName,
      category: payload.category,
      newStatus: payload.newStatus,
      reason: payload.reason,
      isInternalOnly: Boolean(payload.isInternalOnly),
      createdAt: new Date().toISOString()
    };

    return { success: true, historyEntry };
  },

  async getStatusHistory(programId?: string): Promise<StatusHistoryRecord[]> {
    try {
      const query = programId ? `?programId=${programId}` : '';
      const res = await fetch(`/api/status-history${query}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return programId ? INITIAL_STATUS_HISTORY.filter(sh => sh.programId === programId) : INITIAL_STATUS_HISTORY;
  },

  async getIssues(programId?: string): Promise<Issue[]> {
    try {
      const query = programId ? `?programId=${programId}` : '';
      const res = await fetch(`/api/issues${query}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return programId ? INITIAL_ISSUES.filter(i => i.programId === programId) : INITIAL_ISSUES;
  },

  async getApprovals(programId?: string): Promise<Approval[]> {
    try {
      const query = programId ? `?programId=${programId}` : '';
      const res = await fetch(`/api/approvals${query}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return programId ? INITIAL_APPROVALS.filter(a => a.programId === programId) : INITIAL_APPROVALS;
  },

  async decideApproval(approvalId: string, decision: 'approved' | 'rejected', decidedBy: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, decidedBy })
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return true;
  },

  async getActivities(): Promise<Activity[]> {
    try {
      const res = await fetch('/api/activities');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return INITIAL_ACTIVITIES;
  },

  async getNavSections(): Promise<NavSectionConfig[]> {
    try {
      const res = await fetch('/api/nav-sections');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return NAV_SECTIONS;
  }
};
