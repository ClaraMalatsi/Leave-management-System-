import React, { useState } from "react";
import {
  AlertCircle, ArrowRight, BarChart3, CalendarCheck, Eye, EyeOff, LockKeyhole,
  Mail, ShieldCheck, UserRound, Users2, CheckCircle2
} from "lucide-react";
import Logo from "../components/Logo";
import Modal from "../components/Modal";
import { useToast } from "../context/Toast";
import { demoUsers, findDemoUserByEmail } from "../data/demoUsers";
import { verifyPassword } from "../utils/auth";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const features = [
  { icon: CalendarCheck, title: "Fast leave requests", text: "Apply in seconds and track every approval." },
  { icon: Users2, title: "Team visibility", text: "See who is away before you plan." },
  { icon: BarChart3, title: "HR reporting", text: "Live balances, trends and exports." },
];

export default function Login({ onLogin }) {
  const { notify } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
    setFormError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!EMAIL.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const account = findDemoUserByEmail(form.email);
    const ok = account && (await verifyPassword(account.email, form.password));
    setBusy(false);
    if (!ok) {
      setFormError("That email and password combination is not correct.");
      return;
    }
    onLogin(account, remember);
  };

  const quickLogin = (role) => onLogin(demoUsers[role], remember);

  const sendReset = (e) => {
    e.preventDefault();
    if (!EMAIL.test(resetEmail.trim())) return setResetError("Enter a valid email address.");
    setForgotOpen(false);
    setResetEmail("");
    setResetError("");
    notify("If an account exists for that address, a reset link is on its way.", "success", "Check your inbox");
  };

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <div className="login-orb one" /><div className="login-orb two" />
        <Logo />
        <div className="login-brand-copy">
          <span className="eyebrow">CHIMERA HOLDINGS</span>
          <h1>Leave management, made simple.</h1>
          <p>One workspace for requests, approvals, balances and calendars, built for employees, managers and HR.</p>
          <div className="login-feature-cards">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="login-feature-card">
                <span><Icon size={20} /></span>
                <div><strong>{title}</strong><small>{text}</small></div>
              </div>
            ))}
          </div>
        </div>
        <div className="login-brand-footer"><ShieldCheck size={16} /> Role-based access · Audit-ready records</div>
      </div>

      <div className="login-form-panel">
        <form className="login-card" onSubmit={submit} noValidate>
          <div className="login-mobile-logo"><Logo /></div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="muted">Enter your work email and password to continue.</p>

          {formError && <div className="form-error" role="alert"><AlertCircle size={17} /> {formError}</div>}

          <label htmlFor="email">Email address</label>
          <div className={`input-with-icon ${errors.email ? "invalid" : ""}`}>
            <Mail size={18} />
            <input id="email" type="email" autoComplete="username" placeholder="name@chimera.co.za" value={form.email} onChange={set("email")} />
          </div>
          {errors.email && <small className="field-error">{errors.email}</small>}

          <label htmlFor="password">Password</label>
          <div className={`input-with-icon ${errors.password ? "invalid" : ""}`}>
            <LockKeyhole size={18} />
            <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={set("password")} />
            <button type="button" className="eye-button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <small className="field-error">{errors.password}</small>}

          <div className="login-options">
            <label className="checkbox-label"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Keep me signed in</label>
            <button type="button" className="text-button" onClick={() => setForgotOpen(true)}>Forgot password?</button>
          </div>

          <button type="submit" className="primary-button full-width large" disabled={busy}>
            {busy ? "Signing in…" : <>Sign in <ArrowRight size={17} /></>}
          </button>

          <div className="demo-divider"><span>Or explore a demo account</span></div>
          <div className="demo-buttons">
            <button type="button" className="secondary-button" onClick={() => quickLogin("employee")}><UserRound size={17} /> Employee</button>
            <button type="button" className="secondary-button" onClick={() => quickLogin("manager")}><Users2 size={17} /> Manager</button>
            <button type="button" className="secondary-button" onClick={() => quickLogin("admin")}><ShieldCheck size={17} /> Admin</button>
          </div>

          <div className="demo-hint"><CheckCircle2 size={15} /> Demo sign-in: <code>clara.malatsi@chimera.co.za</code> / <code>password</code></div>
        </form>
      </div>

      <Modal open={forgotOpen} title="Reset your password" onClose={() => setForgotOpen(false)}>
        <form onSubmit={sendReset} noValidate>
          <p className="muted modal-copy">Enter your work email and we will send you a link to choose a new password.</p>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" value={resetEmail} onChange={(e) => { setResetEmail(e.target.value); setResetError(""); }} placeholder="name@chimera.co.za" />
            {resetError && <small className="field-error">{resetError}</small>}
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={() => setForgotOpen(false)}>Cancel</button>
            <button type="submit" className="primary-button">Send reset link</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
