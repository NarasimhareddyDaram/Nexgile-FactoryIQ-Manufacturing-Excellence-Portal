import React, { useState, useEffect } from 'react';
import {
  Program,
  StatusHistoryRecord,
  User,
  Role,
  Issue,
  Approval,
  Activity,
  CustomerDashboardWidget,
  PredictiveRiskFlag,
  SavedReportTemplate,
  ReportRowData,
  ProjectThread,
  CollaborationDocument,
  KnowledgeArticle,
  NCRCAPARecord
} from '../types';

import {
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_PROGRAMS,
  INITIAL_STATUS_HISTORY,
  INITIAL_ISSUES,
  INITIAL_APPROVALS,
  INITIAL_ACTIVITIES
} from '../data/initialData';

import {
  INITIAL_CUSTOMER_WIDGETS,
  INITIAL_PREDICTIVE_RISKS,
  INITIAL_SAVED_TEMPLATES,
  INITIAL_REPORT_ROWS
} from '../data/analyticsData';

import {
  INITIAL_PROJECT_THREADS,
  INITIAL_COLLABORATION_DOCUMENTS,
  INITIAL_KNOWLEDGE_ARTICLES
} from '../data/collaborationData';

import { ncrCapaRecords } from '../data/qualityComplianceData';

// Clear, organized, prefixed storage keys for easy DevTools inspection
export const STORAGE_KEYS = {
  // Authentication & Roles
  CURRENT_USER: 'ems_auth_current_user',
  USERS: 'ems_auth_users_list',
  ROLES: 'ems_auth_roles_list',

  // Core Programs & Tracking
  PROGRAMS: 'ems_programs_data',
  STATUS_HISTORY: 'ems_programs_status_history',
  ISSUES: 'ems_programs_issues',
  APPROVALS: 'ems_programs_approvals',
  ACTIVITIES: 'ems_programs_activities',

  // Analytics & Reporting
  ANALYTICS_WIDGETS: 'ems_analytics_customer_widgets',
  ANALYTICS_CUSTOMER: 'ems_analytics_selected_customer',
  PREDICTIVE_RISKS: 'ems_analytics_predictive_risks',
  SAVED_TEMPLATES: 'ems_analytics_saved_templates',
  REPORT_ROWS: 'ems_analytics_report_rows',

  // Collaboration, Documents & Knowledge Base
  COLLAB_THREADS: 'ems_collab_project_threads',
  COLLAB_DOCUMENTS: 'ems_collab_documents_data',
  COLLAB_ARTICLES: 'ems_collab_knowledge_articles',

  // Quality & Compliance
  QUALITY_CAPAS: 'ems_quality_ncr_capa_records'
} as const;

/**
 * Loads data from localStorage under the specified key.
 * If data does not exist or fails to parse, initializes localStorage with default data and returns it.
 */
export function loadOrInitStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null && saved !== undefined && saved !== '') {
      return JSON.parse(saved) as T;
    }
  } catch (err) {
    console.warn(`[localStorage] Error parsing key "${key}", falling back to initial data.`, err);
  }

  // Key was not found or invalid: seed defaultValue into localStorage
  try {
    localStorage.setItem(key, JSON.stringify(defaultValue));
  } catch (err) {
    console.error(`[localStorage] Failed to write key "${key}".`, err);
  }

  return defaultValue;
}

/**
 * Saves arbitrary data to localStorage under the given key.
 */
export function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Emit cross-tab/window synchronization event
    window.dispatchEvent(new CustomEvent('ems_storage_updated', { detail: { key } }));
  } catch (err) {
    console.error(`[localStorage] Failed to save key "${key}".`, err);
  }
}

/**
 * React Hook for persistent state linked directly to localStorage.
 * Synchronizes immediately upon state updates.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    return loadOrInitStorage<T>(key, initialValue);
  });

  useEffect(() => {
    // Keep in sync if another component or reset triggers an update
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key) {
        setState(loadOrInitStorage<T>(key, initialValue));
      } else if (e.type === 'ems_storage_reset') {
        setState(loadOrInitStorage<T>(key, initialValue));
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('ems_storage_reset', handleStorageChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('ems_storage_reset', handleStorageChange as EventListener);
    };
  }, [key, initialValue]);

  const setPersistentState: React.Dispatch<React.SetStateAction<T>> = (valueOrUpdater) => {
    setState((prevState) => {
      const nextState = typeof valueOrUpdater === 'function'
        ? (valueOrUpdater as (prev: T) => T)(prevState)
        : valueOrUpdater;

      saveStorage(key, nextState);
      return nextState;
    });
  };

  return [state, setPersistentState];
}

/**
 * Completely resets all application localStorage keys and repopulates them with fresh sample data.
 */
export function resetAllDemoData(): void {
  try {
    // Remove all ems_ and legacy nexgile_ keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('ems_') || k.startsWith('nexgile_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Repopulate with pristine initial datasets
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(INITIAL_ROLES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(INITIAL_PROGRAMS));
    localStorage.setItem(STORAGE_KEYS.STATUS_HISTORY, JSON.stringify(INITIAL_STATUS_HISTORY));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(INITIAL_APPROVALS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));

    // Analytics
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_WIDGETS, JSON.stringify(INITIAL_CUSTOMER_WIDGETS));
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_CUSTOMER, JSON.stringify('VoltMobility EV'));
    localStorage.setItem(STORAGE_KEYS.PREDICTIVE_RISKS, JSON.stringify(INITIAL_PREDICTIVE_RISKS));
    localStorage.setItem(STORAGE_KEYS.SAVED_TEMPLATES, JSON.stringify(INITIAL_SAVED_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.REPORT_ROWS, JSON.stringify(INITIAL_REPORT_ROWS));

    // Collaboration
    localStorage.setItem(STORAGE_KEYS.COLLAB_THREADS, JSON.stringify(INITIAL_PROJECT_THREADS));
    localStorage.setItem(STORAGE_KEYS.COLLAB_DOCUMENTS, JSON.stringify(INITIAL_COLLABORATION_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.COLLAB_ARTICLES, JSON.stringify(INITIAL_KNOWLEDGE_ARTICLES));

    // Quality
    localStorage.setItem(STORAGE_KEYS.QUALITY_CAPAS, JSON.stringify(ncrCapaRecords));

    // Dispatch global reset event so all mounted components react immediately
    window.dispatchEvent(new CustomEvent('ems_storage_reset', { detail: { timestamp: Date.now() } }));
  } catch (err) {
    console.error('[localStorage] Error during demo data reset:', err);
  }
}
