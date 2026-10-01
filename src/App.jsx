import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeave from "./pages/MyLeave";
import LeaveHistory from "./pages/LeaveHistory";
import LeaveCalendar from "./pages/LeaveCalendar";
import Profile from "./pages/Profile";
import Employees from "./pages/Employees";
import LeaveRequests from "./pages/LeaveRequests";
import LeaveTypes from "./pages/LeaveTypes";
import Departments from "./pages/Departments";
import PublicHolidays from "./pages/PublicHolidays";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import { useToast } from "./context/Toast";
import { loadJSON, saveJSON } from "./utils/storage";
import { getSettings } from "./hooks/useSettings";

const SESSION_KEY = "chimeraUser";
const PROFILES_KEY = "chimeraProfiles";

const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export default function App() {
  const { notify } = useToast();
  const [user, setUser] = useState(readSession);

  const persistSession = (next) => {
    const store = sessionStorage.getItem(SESSION_KEY) ? sessionStorage : localStorage;
    store.setItem(SESSION_KEY, JSON.stringify(next));
  };

  const login = (baseUser, remember = true) => {
    // Re-apply any profile edits / photo saved for this employee on this browser.
    const overrides = loadJSON(PROFILES_KEY, {})[baseUser.employeeNumber] || {};
    const selected = { ...baseUser, ...overrides, role: baseUser.role };
    selected.initials = initialsOf(selected.name);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(selected));
    setUser(selected);
  };

  /** Returns true when the update was stored successfully. */
  const updateUser = (updates) => {
    const next = { ...user, ...updates };
    next.initials = initialsOf(next.name);

    const profiles = loadJSON(PROFILES_KEY, {});
    const { role, ...editable } = next;
    profiles[next.employeeNumber] = editable;
    const stored = saveJSON(PROFILES_KEY, profiles);
    if (!stored) {
      notify("Your browser storage is full, so the change could not be saved.", "error");
      return false;
    }
    persistSession(next);
    setUser(next);
    return true;
  };

  const logout = (reason) => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    if (reason === "idle") notify("You were signed out after a period of inactivity.", "info", "Session expired");
  };

  // Automatic sign-out after the idle time chosen in Settings → Security.
  useEffect(() => {
    if (!user) return undefined;
    let last = Date.now();
    const touch = () => { last = Date.now(); };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const timer = window.setInterval(() => {
      const minutes = Number(getSettings().security.sessionTimeout);
      if (minutes > 0 && Date.now() - last > minutes * 60 * 1000) logout("idle");
    }, 15000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.employeeNumber]);

  if (!user) return <Login onLogin={login} />;

  return (
    <Routes>
      <Route
        element={
          <DashboardLayout
            user={user}
            onUserUpdate={updateUser}
            onLogout={() => logout()}
          />
        }
      >
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/apply-leave" element={<ApplyLeave user={user} />} />
        <Route path="/my-leave" element={<MyLeave user={user} />} />
        <Route path="/leave-history" element={<LeaveHistory user={user} />} />
        <Route path="/calendar" element={<LeaveCalendar />} />
        <Route path="/profile" element={<Profile user={user} onUserUpdate={updateUser} />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/leave-types" element={<LeaveTypes />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/holidays" element={<PublicHolidays />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
