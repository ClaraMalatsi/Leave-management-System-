import React, { useMemo, useState } from "react";
import { CalendarDays, Upload, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { addLeaveRequest } from "../data/leaveStore";
import { useToast } from "../context/Toast";

const BALANCES = { "Annual Leave": 7, "Sick Leave": 8, "Family Responsibility": 2, "Study Leave": 5, "Compassionate Leave": 5, "Unpaid Leave": null };

function calculateWeekdays(start, end) {
  if (!start || !end || new Date(start) > new Date(end)) return 0;
  let count = 0;
  const current = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (current <= last) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function ApplyLeave({ user }) {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const todayIso = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ type: "Annual Leave", start: "", end: "", reason: "", document: null });
  const [submitted, setSubmitted] = useState(false);

  const days = useMemo(() => calculateWeekdays(form.start, form.end), [form.start, form.end]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const balance = BALANCES[form.type];

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.start || !form.end || !form.reason.trim()) return setError("Please complete all required fields.");
    if (form.start < todayIso && form.type !== "Sick Leave") return setError("The start date cannot be in the past.");
    if (form.end < form.start) return setError("The end date must be on or after the start date.");
    if (days === 0) return setError("The selected dates only include weekends, so no working days are being requested.");
    if (balance !== null && days > balance) return setError(`You have requested ${days} days but only have ${balance} days of ${form.type} available.`);
    if (form.reason.trim().length < 5) return setError("Please give a slightly longer reason.");
    const created = addLeaveRequest({
      employee: user.name, type: form.type, start: form.start, end: form.end, days,
      reason: form.reason.trim(), document: form.document ? form.document.name : undefined,
    });
    setReference(created.id);
    setSubmitted(true);
    notify(`Request ${created.id} was sent to your manager for approval.`, "success", "Leave submitted");
  };

  const resetForm = () => { setForm({ type: "Annual Leave", start: "", end: "", reason: "", document: null }); setError(""); };

  return (
    <>
      <PageHeader title="Apply for Leave" description="Submit a new leave request for manager approval." />
      <div className="form-layout">
        <section className="card">
          {submitted ? (
            <div className="success-state">
              <div className="success-icon"><CheckCircle2 size={34}/></div>
              <h2>Leave request submitted</h2>
              <p>Reference <strong>{reference}</strong> is now pending manager approval. You can follow its progress under My Leave.</p>
              <div className="success-actions">
                <button className="secondary-button" onClick={() => { setSubmitted(false); resetForm(); }}>Create Another Request</button>
                <button className="primary-button" onClick={() => navigate("/my-leave")}>View My Leave</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-section-title"><CalendarDays size={20}/><div><h2>Leave details</h2><p>Choose the leave type and dates.</p></div></div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Leave Type *</label>
                  <select value={form.type} onChange={(e) => update("type", e.target.value)}>
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Family Responsibility</option>
                    <option>Study Leave</option>
                    <option>Compassionate Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Available Balance</label>
                  <div className="read-only-field">{form.type}: <strong>{balance === null ? "No limit" : `${balance} days`}</strong> remaining</div>
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input type="date" value={form.start} min={form.type === "Sick Leave" ? undefined : todayIso} onChange={(e) => { update("start", e.target.value); if (form.end && form.end < e.target.value) update("end", e.target.value); }} />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input type="date" value={form.end} min={form.start || undefined} onChange={(e) => update("end", e.target.value)} />
                </div>
              </div>

              <div className="days-preview"><strong>{days}</strong><span>working day{days === 1 ? "" : "s"} requested</span></div>

              <div className="form-group">
                <label>Reason *</label>
                <textarea rows="5" placeholder="Explain the reason for your leave request..." value={form.reason} onChange={(e) => update("reason", e.target.value)} />
              </div>

              <div className="form-group">
                <label>Supporting Document</label>
                <label className="upload-box">
                  <Upload size={22}/>
                  <strong>Click to upload a document</strong>
                  <span>PDF, JPG or PNG • optional</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size > 5 * 1024 * 1024) { setError("Supporting documents must be smaller than 5 MB."); e.target.value = ""; return; } setError(""); update("document", f || null); }} />
                  {form.document && <small>{form.document.name}</small>}
                </label>
              </div>

              {error && <div className="form-error" role="alert">{error}</div>}
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={!form.start || !form.end || !form.reason.trim()}>Submit Request</button>
              </div>
            </form>
          )}
        </section>

        <aside className="card leave-summary-card">
          <h2>Leave Summary</h2>
          <p>Your current leave balances.</p>
          <div className="mini-balance"><span>Annual Leave</span><strong>7 days</strong></div>
          <div className="mini-balance"><span>Sick Leave</span><strong>8 days</strong></div>
          <div className="mini-balance"><span>Family Responsibility</span><strong>2 days</strong></div>
          <div className="policy-note"><strong>Before submitting</strong><p>Check your available balance and ensure the dates do not conflict with existing leave.</p></div>
        </aside>
      </div>
    </>
  );
}
