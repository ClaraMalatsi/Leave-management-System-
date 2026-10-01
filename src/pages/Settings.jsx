import React, { useEffect, useMemo, useState } from "react";
import {
  Bell, Building2, Database, Download, Eye, EyeOff, KeyRound, Monitor, Moon, Palette,
  RotateCcw, Save, Shield, Sun, Trash2, Lock
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { useToast } from "../context/Toast";
import { applyDensity, getTheme, onThemeChange, setTheme } from "../utils/theme";
import { defaultSettings, getSettings, saveSettings } from "../hooks/useSettings";
import { changePassword, passwordStrength, verifyPassword } from "../utils/auth";
import { downloadJson } from "../utils/download";

const STORAGE_KEYS = [
  "chimeraUser", "chimeraProfiles", "chimeraPasswords", "chimeraSettings", "chimeraTheme",
  "chimeraNotifications", "chimeraUsers", "chimeraDepartments", "chimeraLeaveRequests",
];

function Toggle({ checked, onChange, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span></span>
    </label>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="setting-toggle">
      <div><strong>{title}</strong><span>{description}</span></div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export default function Settings({ user }) {
  const { notify } = useToast();
  const isAdmin = user.role === "Administrator";

  const tabs = useMemo(() => [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    ...(isAdmin ? [{ id: "organisation", label: "Organisation", icon: Building2 }, { id: "system", label: "System", icon: Database }] : []),
  ], [isAdmin]);

  const [tab, setTab] = useState("appearance");
  const [saved, setSaved] = useState(getSettings);
  const [draft, setDraft] = useState(getSettings);
  const [theme, setThemeDraft] = useState(getTheme);
  const [savedTheme, setSavedTheme] = useState(getTheme);

  useEffect(() => onThemeChange((t) => { setThemeDraft(t); setSavedTheme(t); }), []);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved) || theme !== savedTheme;

  const patch = (section, values) => setDraft((d) => ({ ...d, [section]: { ...d[section], ...values } }));

  const save = () => {
    if (!draft.organisation.name.trim()) {
      notify("Organisation name cannot be empty.", "error");
      setTab("organisation");
      return;
    }
    saveSettings(draft);
    setSaved(draft);
    applyDensity(draft.appearance.density);
    if (theme !== savedTheme) { setTheme(theme); setSavedTheme(theme); }
    notify("Your settings have been saved.", "success", "Settings saved");
  };

  const discard = () => {
    setDraft(saved);
    setThemeDraft(savedTheme);
    notify("Unsaved changes were discarded.", "info");
  };

  const resetDefaults = () => {
    setDraft({ ...defaultSettings, organisation: isAdmin ? defaultSettings.organisation : draft.organisation });
    setThemeDraft("light");
    notify("Defaults restored. Select Save to apply them.", "info");
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your preferences, notifications and account security." />
      <div className="settings-grid">
        <nav className="card settings-nav" aria-label="Settings sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <section className="card settings-content">
          {tab === "appearance" && (
            <>
              <div className="card-header"><div><h2>Appearance</h2><p>Choose how Chimera looks on this device.</p></div></div>
              <div className="form-group">
                <label>Theme</label>
                <div className="choice-grid">
                  {[{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }, { id: "system", label: "System", icon: Monitor }].map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" className={`choice-card ${theme === id ? "selected" : ""}`} onClick={() => setThemeDraft(id)}>
                      <Icon size={22} /><strong>{label}</strong>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Layout density</label>
                <div className="choice-grid two">
                  {[{ id: "comfortable", label: "Comfortable", hint: "More breathing room" }, { id: "compact", label: "Compact", hint: "More data on screen" }].map((d) => (
                    <button key={d.id} type="button" className={`choice-card ${draft.appearance.density === d.id ? "selected" : ""}`} onClick={() => patch("appearance", { density: d.id })}>
                      <strong>{d.label}</strong><span>{d.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "notifications" && (
            <>
              <div className="card-header"><div><h2>Notifications</h2><p>Decide which updates you want to receive.</p></div></div>
              <ToggleRow title="Email notifications" description="Receive leave updates by email as well as in the app." checked={draft.notifications.email} onChange={(v) => patch("notifications", { email: v })} />
              <ToggleRow title="Leave approved" description="Tell me when one of my requests is approved." checked={draft.notifications.leaveApproved} onChange={(v) => patch("notifications", { leaveApproved: v })} />
              <ToggleRow title="Leave rejected" description="Tell me when one of my requests is rejected." checked={draft.notifications.leaveRejected} onChange={(v) => patch("notifications", { leaveRejected: v })} />
              {(isAdmin || user.role === "Manager") && (
                <ToggleRow title="New requests to review" description="Alert me when a team member submits a leave request." checked={draft.notifications.newRequest} onChange={(v) => patch("notifications", { newRequest: v })} />
              )}
              <ToggleRow title="Public holiday reminders" description="Remind me ahead of upcoming public holidays." checked={draft.notifications.holidayReminders} onChange={(v) => patch("notifications", { holidayReminders: v })} />
              <ToggleRow title="Weekly summary" description="A weekly digest of leave activity every Monday morning." checked={draft.notifications.weeklyDigest} onChange={(v) => patch("notifications", { weeklyDigest: v })} />
            </>
          )}

          {tab === "security" && (
            <>
              <div className="card-header"><div><h2>Security</h2><p>Protect your account and manage your session.</p></div></div>
              <ToggleRow title="Two-step verification" description="Ask for a verification code when signing in on a new device." checked={draft.security.twoFactor} onChange={(v) => patch("security", { twoFactor: v })} />
              <div className="form-group top-rule">
                <label>Sign me out after inactivity</label>
                <select value={draft.security.sessionTimeout} onChange={(e) => patch("security", { sessionTimeout: Number(e.target.value) })}>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={240}>4 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>
            </>
          )}

          {tab === "organisation" && isAdmin && (
            <>
              <div className="card-header"><div><h2>Organisation</h2><p>Company-wide leave management rules.</p></div></div>
              <div className="form-group">
                <label>Organisation name *</label>
                <input value={draft.organisation.name} onChange={(e) => patch("organisation", { name: e.target.value })} />
              </div>
              <div className="form-grid">
                <div className="form-group"><label>Working week starts</label>
                  <select value={draft.organisation.weekStart} onChange={(e) => patch("organisation", { weekStart: e.target.value })}><option>Monday</option><option>Sunday</option></select></div>
                <div className="form-group"><label>Default working hours</label>
                  <select value={draft.organisation.workingHours} onChange={(e) => patch("organisation", { workingHours: e.target.value })}><option>08:00 – 17:00</option><option>09:00 – 17:00</option><option>07:30 – 16:30</option></select></div>
                <div className="form-group"><label>Leave year starts</label>
                  <select value={draft.organisation.leaveYearStart} onChange={(e) => patch("organisation", { leaveYearStart: e.target.value })}><option>January</option><option>March</option><option>April</option></select></div>
              </div>
              <ToggleRow title="Require manager approval" description="All employee leave requests must be approved before being finalised." checked={draft.organisation.requireApproval} onChange={(v) => patch("organisation", { requireApproval: v })} />
              <ToggleRow title="Allow employees to cancel pending requests" description="Employees may withdraw requests before approval." checked={draft.organisation.allowCancel} onChange={(v) => patch("organisation", { allowCancel: v })} />
            </>
          )}

          {tab === "system" && isAdmin && <SystemPanel notify={notify} />}

          {tab !== "system" && (
            <div className="form-actions settings-footer">
              <button className="primary-button" onClick={save} disabled={!dirty}><Save size={17} /> Save Settings</button>
              <button className="secondary-button" onClick={discard} disabled={!dirty}>Discard changes</button>
              <button className="text-button reset-link" onClick={resetDefaults}><RotateCcw size={14} /> Restore defaults</button>
              {dirty && <span className="unsaved-message">You have unsaved changes</span>}
            </div>
          )}

          {tab === "security" && <PasswordForm user={user} notify={notify} />}
        </section>
      </div>
    </>
  );
}

function PasswordForm({ user, notify }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const strength = passwordStrength(form.next);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!(await verifyPassword(user.email, form.current))) return setError("Your current password is incorrect.");
    if (form.next.length < 8) return setError("The new password must be at least 8 characters long.");
    if (strength.score < 3) return setError("Choose a stronger password: mix upper and lower case letters, numbers and symbols.");
    if (form.next === form.current) return setError("The new password must be different from your current one.");
    if (form.next !== form.confirm) return setError("The new passwords do not match.");
    setBusy(true);
    await changePassword(user.email, form.next);
    setBusy(false);
    setForm({ current: "", next: "", confirm: "" });
    notify("Use your new password the next time you sign in.", "success", "Password changed");
  };

  const input = (label, key, autoComplete) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-with-icon">
        <Lock size={17} />
        <input type={show ? "text" : "password"} autoComplete={autoComplete} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        {key === "current" && (
          <button type="button" className="eye-button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide passwords" : "Show passwords"}>
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <form className="password-form top-rule" onSubmit={submit}>
      <div className="form-section-title"><KeyRound size={20} /><div><h2>Change password</h2><p>Use at least 8 characters with a mix of letters, numbers and symbols.</p></div></div>
      {input("Current password", "current", "current-password")}
      {input("New password", "next", "new-password")}
      {form.next && (
        <div className="strength">
          <div className="strength-bar"><i className={`s${strength.score}`} style={{ width: `${strength.percent}%` }} /></div>
          <span>{strength.label}</span>
        </div>
      )}
      {input("Confirm new password", "confirm", "new-password")}
      {error && <div className="form-error" role="alert">{error}</div>}
      <button type="submit" className="primary-button" disabled={busy || !form.current || !form.next || !form.confirm}>
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

function SystemPanel({ notify }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const exportData = () => {
    const snapshot = {};
    STORAGE_KEYS.filter((k) => !["chimeraPasswords", "chimeraUser"].includes(k)).forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw !== null) { try { snapshot[key] = JSON.parse(raw); } catch { snapshot[key] = raw; } }
    });
    downloadJson(`chimera-backup-${new Date().toISOString().slice(0, 10)}.json`, snapshot);
    notify("A backup of your local data was downloaded.", "success", "Backup created");
  };

  const reset = () => {
    STORAGE_KEYS.forEach((k) => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
    window.location.reload();
  };

  return (
    <>
      <div className="card-header"><div><h2>System</h2><p>Back up or reset the data stored in this browser.</p></div></div>
      <div className="system-action">
        <div><strong>Download a backup</strong><span>Export settings, users, departments and leave requests as a JSON file.</span></div>
        <button className="secondary-button" onClick={exportData}><Download size={16} /> Export data</button>
      </div>
      <div className="system-action danger">
        <div><strong>Reset demo data</strong><span>Clear everything saved in this browser and return to the original sample data. You will be signed out.</span></div>
        <button className="secondary-button danger-outline" onClick={() => setConfirmOpen(true)}><Trash2 size={16} /> Reset data</button>
      </div>
      <Modal open={confirmOpen} title="Reset all data?" onClose={() => setConfirmOpen(false)}>
        <p>This permanently removes saved profiles, photos, users, departments, leave requests and settings from this browser. This cannot be undone.</p>
        <div className="modal-actions">
          <button className="secondary-button" onClick={() => setConfirmOpen(false)}>Cancel</button>
          <button className="primary-button danger-button" onClick={reset}>Yes, reset everything</button>
        </div>
      </Modal>
    </>
  );
}
