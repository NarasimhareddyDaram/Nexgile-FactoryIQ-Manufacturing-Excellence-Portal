import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_PROGRAMS,
  INITIAL_STATUS_HISTORY,
  INITIAL_ISSUES,
  INITIAL_APPROVALS,
  INITIAL_ACTIVITIES,
  NAV_SECTIONS
} from './src/data/initialData';
import { Program, StatusHistoryRecord, User, Issue, Approval, Activity } from './src/types';

// In-memory persistent state (seeded with initial enterprise data)
let roles = [...INITIAL_ROLES];
let users = [...INITIAL_USERS];
let programs: Program[] = [...INITIAL_PROGRAMS];
let statusHistory: StatusHistoryRecord[] = [...INITIAL_STATUS_HISTORY];
let issues: Issue[] = [...INITIAL_ISSUES];
let approvals: Approval[] = [...INITIAL_APPROVALS];
let activities: Activity[] = [...INITIAL_ACTIVITIES];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Nexgile-FactoryIQ Portal API',
      timestamp: new Date().toISOString(),
      counts: {
        programs: programs.length,
        users: users.length,
        roles: roles.length,
        statusHistory: statusHistory.length
      }
    });
  });

  // Roles & permissions list
  app.get('/api/roles', (req, res) => {
    res.json(roles);
  });

  // Users list
  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  // Auth / Current User simulation
  app.post('/api/auth/login', (req, res) => {
    const { userId, roleId, email, name, company, roleCategory } = req.body;
    let targetUser = users.find(u => u.id === userId || (email && u.email.toLowerCase() === email.toLowerCase()));

    if (!targetUser && roleId) {
      const selectedRole = roles.find(r => r.id === roleId);
      targetUser = {
        id: `usr-${Date.now()}`,
        name: name || 'Demo Enterprise User',
        email: email || `user-${Date.now()}@example.com`,
        roleId: roleId,
        roleCategory: roleCategory || selectedRole?.category || 'customer',
        company: company || (roleCategory === 'internal' ? 'Nexgile Manufacturing' : 'Enterprise Partner'),
        department: selectedRole?.name || 'Operations'
      };
      users.push(targetUser);
    }

    if (!targetUser) {
      targetUser = users[0]; // fallback default
    }

    res.json({
      success: true,
      user: targetUser,
      role: roles.find(r => r.id === targetUser?.roleId)
    });
  });

  // Programs & Projects
  app.get('/api/programs', (req, res) => {
    const { roleCategory, customerName, health, stage } = req.query;
    let result = [...programs];

    if (customerName && customerName !== 'all') {
      result = result.filter(p => p.customerName.toLowerCase() === (customerName as string).toLowerCase());
    }

    if (health && health !== 'all') {
      result = result.filter(p => p.health === health);
    }

    if (stage && stage !== 'all') {
      result = result.filter(p => p.stage === stage);
    }

    res.json(result);
  });

  // Program by ID
  app.get('/api/programs/:id', (req, res) => {
    const program = programs.find(p => p.id === req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.json(program);
  });

  // Create new Program
  app.post('/api/programs', (req, res) => {
    const body = req.body;
    const newProgram: Program = {
      id: `prog-${Date.now()}`,
      code: body.code || `NX-PRG-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name || 'New Manufacturing Program',
      customerName: body.customerName || 'Customer OEM',
      productCategory: body.productCategory || 'Hardware Subsystem',
      facility: body.facility || 'Plant 1 (Main Campus)',
      stage: body.stage || 'EVT (Engineering Validation)',
      health: body.health || 'green',
      progressPercent: body.progressPercent || 10,
      targetLaunchDate: body.targetLaunchDate || '2027-01-01',
      targetVolume: body.targetVolume || 10000,
      currentUnitsBuilt: body.currentUnitsBuilt || 0,
      currentYieldPercent: body.currentYieldPercent || 98.0,
      internalScrapPercent: body.internalScrapPercent || 2.0,
      openIssuesCount: 0,
      pendingApprovalsCount: 0,
      customerSummary: body.customerSummary || 'Program initiated in portal. Initial baseline schedule established.',
      internalNotes: body.internalNotes || 'Internal line capacity allocated. Initial tooling review underway.',
      keyMilestones: body.keyMilestones || [
        { id: `m-${Date.now()}-1`, title: 'EVT Build & Validation', dueDate: '2026-10-30', status: 'on_track', completionPercent: 20 },
        { id: `m-${Date.now()}-2`, title: 'DVT Reliability Test', dueDate: '2026-12-15', status: 'on_track', completionPercent: 0 }
      ],
      updatedAt: new Date().toISOString()
    };

    programs.unshift(newProgram);

    // Add status history record
    const historyEntry: StatusHistoryRecord = {
      id: `sh-${Date.now()}`,
      programId: newProgram.id,
      programName: newProgram.code,
      changedByName: body.authorName || 'System Administrator',
      category: 'general',
      oldStatus: 'Created',
      newStatus: newProgram.health,
      reason: 'Initial program registration and baseline created in Nexgile-FactoryIQ.',
      isInternalOnly: false,
      createdAt: new Date().toISOString()
    };
    statusHistory.unshift(historyEntry);

    // Add activity record
    activities.unshift({
      id: `act-${Date.now()}`,
      programId: newProgram.id,
      programCode: newProgram.code,
      userName: body.authorName || 'System Administrator',
      userRole: body.authorRole || 'Program Office',
      roleCategory: 'internal',
      actionType: 'Program Created',
      description: `Created new manufacturing program: ${newProgram.name}`,
      isInternalOnly: false,
      timestamp: 'Just now'
    });

    res.status(201).json(newProgram);
  });

  // Update status / Log status history
  app.post('/api/programs/:id/status-change', (req, res) => {
    const programId = req.params.id;
    const programIndex = programs.findIndex(p => p.id === programId);

    if (programIndex === -1) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const {
      changedByName,
      category,
      newStatus,
      reason,
      health,
      stage,
      currentYieldPercent,
      isInternalOnly,
      customerSummary,
      internalNotes
    } = req.body;

    const program = programs[programIndex];
    const oldHealth = program.health;

    // Apply updates to program
    if (health) program.health = health;
    if (stage) program.stage = stage;
    if (currentYieldPercent !== undefined) program.currentYieldPercent = Number(currentYieldPercent);
    if (customerSummary) program.customerSummary = customerSummary;
    if (internalNotes) program.internalNotes = internalNotes;
    program.updatedAt = new Date().toISOString();

    // Create history entry
    const historyEntry: StatusHistoryRecord = {
      id: `sh-${Date.now()}`,
      programId: program.id,
      programName: program.code,
      changedByName: changedByName || 'Authorized User',
      category: category || 'health',
      oldStatus: oldHealth,
      newStatus: newStatus || health || program.health,
      reason: reason || 'Status updated via Manufacturing Excellence Portal.',
      isInternalOnly: Boolean(isInternalOnly),
      createdAt: new Date().toISOString()
    };

    statusHistory.unshift(historyEntry);

    // Add activity
    activities.unshift({
      id: `act-${Date.now()}`,
      programId: program.id,
      programCode: program.code,
      userName: changedByName || 'User',
      userRole: 'Engineering/Ops',
      roleCategory: isInternalOnly ? 'internal' : 'customer',
      actionType: 'Status Updated',
      description: `Updated status on ${program.code}: ${reason.substring(0, 75)}...`,
      isInternalOnly: Boolean(isInternalOnly),
      timestamp: 'Just now'
    });

    res.json({
      success: true,
      program,
      historyEntry
    });
  });

  // Status History query
  app.get('/api/status-history', (req, res) => {
    const { programId } = req.query;
    let result = [...statusHistory];
    if (programId) {
      result = result.filter(sh => sh.programId === programId);
    }
    res.json(result);
  });

  // Issues query & mutation
  app.get('/api/issues', (req, res) => {
    const { programId, severity } = req.query;
    let result = [...issues];
    if (programId) {
      result = result.filter(i => i.programId === programId);
    }
    if (severity && severity !== 'all') {
      result = result.filter(i => i.severity === severity);
    }
    res.json(result);
  });

  app.post('/api/issues', (req, res) => {
    const newIssue: Issue = {
      id: `iss-${Date.now()}`,
      programId: req.body.programId,
      programCode: req.body.programCode || 'PROG',
      title: req.body.title,
      severity: req.body.severity || 'medium',
      status: 'open',
      owner: req.body.owner || 'Unassigned',
      category: req.body.category || 'General Quality',
      customerVisible: req.body.customerVisible ?? true,
      customerSummary: req.body.customerSummary || req.body.title,
      internalRootCause: req.body.internalRootCause || 'Under initial review',
      createdAt: new Date().toISOString()
    };
    issues.unshift(newIssue);

    // Update program open issues count
    const prog = programs.find(p => p.id === req.body.programId);
    if (prog) {
      prog.openIssuesCount += 1;
    }

    res.status(201).json(newIssue);
  });

  // Approvals query & mutation
  app.get('/api/approvals', (req, res) => {
    const { status, programId } = req.query;
    let result = [...approvals];
    if (status && status !== 'all') {
      result = result.filter(a => a.status === status);
    }
    if (programId) {
      result = result.filter(a => a.programId === programId);
    }
    res.json(result);
  });

  app.post('/api/approvals/:id/decide', (req, res) => {
    const { id } = req.params;
    const { decision, decidedBy } = req.body; // 'approved' | 'rejected'
    const approval = approvals.find(a => a.id === id);

    if (!approval) {
      return res.status(404).json({ error: 'Approval not found' });
    }

    approval.status = decision;

    // Log activity
    activities.unshift({
      id: `act-${Date.now()}`,
      programId: approval.programId,
      programCode: approval.programCode,
      userName: decidedBy || 'Authorizer',
      userRole: 'Management',
      roleCategory: 'customer',
      actionType: `Approval ${decision.toUpperCase()}`,
      description: `${decision === 'approved' ? 'Approved' : 'Rejected'} ${approval.title}`,
      isInternalOnly: false,
      timestamp: 'Just now'
    });

    res.json({ success: true, approval });
  });

  // Activities stream
  app.get('/api/activities', (req, res) => {
    res.json(activities);
  });

  // Navigation sections list & metadata
  app.get('/api/nav-sections', (req, res) => {
    res.json(NAV_SECTIONS);
  });

  // Stats / Dashboard KPI summary
  app.get('/api/stats', (req, res) => {
    const totalPrograms = programs.length;
    const greenHealth = programs.filter(p => p.health === 'green').length;
    const yellowHealth = programs.filter(p => p.health === 'yellow').length;
    const redHealth = programs.filter(p => p.health === 'red').length;
    const totalOpenIssues = issues.filter(i => i.status !== 'resolved').length;
    const criticalIssues = issues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    const avgYield = (programs.reduce((acc, p) => acc + p.currentYieldPercent, 0) / (programs.length || 1)).toFixed(1);

    res.json({
      totalPrograms,
      healthCounts: { green: greenHealth, yellow: yellowHealth, red: redHealth },
      totalOpenIssues,
      criticalIssues,
      pendingApprovals,
      avgYield: Number(avgYield),
      recentActivityCount: activities.length
    });
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexgile-FactoryIQ Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
