import { STORAGE_KEYS, ROUTES, ROLES } from '@/lib/constants';

export type CurrentUser = {
  username?: string;
  role?: string;
};

function safeBase64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function removeToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function setCurrentUser(user: CurrentUser) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.DATA_PASSWORD);
}

export function setDataPassword(value: string) {
  localStorage.setItem(STORAGE_KEYS.DATA_PASSWORD, value);
}

export function getDataPassword() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.DATA_PASSWORD);
}

export function removeDataPassword() {
  localStorage.removeItem(STORAGE_KEYS.DATA_PASSWORD);
}

export function parseJwt(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    return JSON.parse(safeBase64UrlDecode(payload));
  } catch {
    return null;
  }
}

function normalizeRole(rawRole?: string | null) {
  if (!rawRole) return '';

  const cleaned = rawRole.replace(/^ROLE_/, '').toUpperCase();

  if (cleaned === 'ADMIN') return ROLES.ADMIN;
  if (cleaned === 'EMPLOYEE') return ROLES.EMPLOYEE;
  if (cleaned === 'USER') return ROLES.USER;

  return cleaned;
}

export function buildUserFromToken(token: string): CurrentUser {
  const payload = parseJwt(token);

  const roleFromArray =
    payload?.roles?.[0] ||
    payload?.authorities?.[0] ||
    payload?.scope?.[0];

  const roleFromSingle =
    payload?.role ||
    payload?.authority;

  const username =
    payload?.sub ||
    payload?.username ||
    payload?.preferred_username ||
    '';

  const role = normalizeRole(roleFromArray || roleFromSingle || '');

  return {
    username,
    role,
  };
}

export function isTokenExpired(token: string) {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return nowInSeconds >= payload.exp;
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    clearAuth();
    return false;
  }
  return true;
}

export function hasRole(userRole?: string | null, allowedRoles: string[] = []) {
  if (!userRole) return false;
  const normalizedUserRole = normalizeRole(userRole);
  return allowedRoles.map(normalizeRole).includes(normalizedUserRole);
}

export function getDefaultRouteByRole(role?: string | null) {
  const normalized = normalizeRole(role);

  if (normalized === ROLES.ADMIN) return ROUTES.DASHBOARD;
  if (normalized === ROLES.EMPLOYEE) return ROUTES.DASHBOARD;
  if (normalized === ROLES.USER) return ROUTES.DASHBOARD;

  return ROUTES.DASHBOARD;
}

export function isAdmin(user?: CurrentUser | null) {
  return normalizeRole(user?.role) === ROLES.ADMIN;
}

export function isEmployee(user?: CurrentUser | null) {
  return normalizeRole(user?.role) === ROLES.EMPLOYEE;
}