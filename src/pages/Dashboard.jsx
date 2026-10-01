import React, { useMemo } from "react";
import {
  ArrowRight, CalendarCheck, CalendarDays, CheckCircle2, Clock3, FileText, Plane, Plus, Users, Sparkles, PartyPopper
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { holidays } from "../data/mockData";
import { useLeaveRequests } from "../data/leaveStore";

const balances = [
  { label: "Annual Leave", used: 8, total: 15 },
  { label: "Sick Leave", used: 2, total: 10 },
  { label: "Family Responsibility", used: 1, total: 3 },
];

const toDate = (value) => new Date(`${value}T00:00:00`);
const fmtShort = (value) => toDate(value).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard({ user }) {
  const leaveRequests = useLeaveRequests();
  const isAdmin = user.role === "Administrator";
  const isReviewer = isAdmin || user.role === "Manager";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mine = useMemo(() => leaveRequests.filter((r) => r.employee === user.name), [leaveRequests, user.name]);
  const scope = isReviewer ? leaveRequests : mine;

  const pending = leaveRequests.filter((r) => r.status === "Pending");
  const pendingCount = isReviewer ? pending.length : mine.filter((r) => r.status === "Pending").length;
  const approvedDays = scope.filter((r) => r.status === "Approved").reduce((a, r) => a + r.days, 0);

  const tableRows = (isReviewer ? (pending.length ? pending : leaveRequests) : mine).slice(0, 5);

  const upcoming = scope
    .filter((r) => r.status !== "Rejected" && toDate(r.end) >= today)
    .sort((a, b) => toDate(a.start) - toDate(b.start))
    .slice(0, 3);

  const nextHoliday = holidays.find((h) => toDate(h.date) >= today);
  const daysToHoliday = nextHoliday ? Math.ceil((toDate(nextHoliday.date) - today) / 86400000) : null;

  const annualRemaining = balances[0].total - balances[0].used;
  const sickRemaining = balances[1].total - balances[1].used;

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-date"><CalendarDays size={15} /> {today.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          <h1>{greeting()}, {user.name.split(" ")[0]} <Sparkles size={22} /></h1>
          <p>
            {isReviewer
              ? pendingCount > 0
                ? `You have ${pendingCount} leave request${pendingCount === 1 ? "" : "s"} waiting for review.`
                : "Everything is up to date. There are no requests waiting for you."
              : `You have ${annualRemaining} days of annual leave remaining this year.`}
          </p>
          <div className="hero-actions">
            <Link className="hero-button solid" to="/apply-leave"><Plus size={17} /> Apply for leave</Link>
            {isReviewer
              ? <Link className="hero-button" to="/leave-requests">Review requests <ArrowRight size={16} /></Link>
              : <Link className="hero-button" to="/calendar">View calendar <ArrowRight size={16} /></Link>}
          </div>
        </div>
        {nextHoliday && (
          <div className="hero-holiday">
            <PartyPopper size={22} />
            <span>Next public holiday</span>
            <strong>{nextHoliday.name}</strong>
            <small>{fmtShort(nextHoliday.date)} · {daysToHoliday === 0 ? "today" : `in ${daysToHoliday} day${daysToHoliday === 1 ? "" : "s"}`}</small>
          </div>
        )}
      </section>

      <div className="stat-grid">
        <StatCard icon={<CalendarCheck size={22} />} label="Annual Leave" value={`${annualRemaining} days`} helper={`of ${balances[0].total} days remaining`} tone="red" />
        <StatCard icon={<Clock3 size={22} />} label="Sick Leave" value={`${sickRemaining} days`} helper={`of ${balances[1].total} days remaining`} tone="blue" />
        <StatCard icon={<FileText size={22} />} label={isReviewer ? "Awaiting Review" : "Pending Requests"} value={pendingCount} helper={isReviewer ? "Across your team" : "Awaiting approval"} tone="orange" />
        <StatCard icon={<CheckCircle2 size={22} />} label="Approved Days" value={approvedDays} helper="Current year" tone="green" />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h2>{isReviewer ? "Pending Leave Requests" : "Recent Leave Requests"}</h2>
              <p>{isReviewer ? "Requests requiring attention." : "Your latest leave activity."}</p>
            </div>
            <Link to={isReviewer ? "/leave-requests" : "/leave-history"} className="view-link">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {isReviewer && <th>Employee</th>}
                  <th>Leave Type</th><th>Dates</th><th>Days</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 && (
                  <tr><td colSpan={isReviewer ? 5 : 4}><div className="empty-inline">No leave requests yet. <Link to="/apply-leave">Apply for leave</Link></div></td></tr>
                )}
                {tableRows.map((request) => (
                  <tr key={request.id}>
                    {isReviewer && <td><strong>{request.employee}</strong><span className="sub-cell">{request.id}</span></td>}
                    <td>{request.type}</td>
                    <td>{fmtShort(request.start)} – {fmtShort(request.end)}</td>
                    <td>{request.days}</td>
                    <td><StatusBadge status={request.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div><h2>Upcoming Leave</h2><p>{isReviewer ? "Team leave on the horizon" : "Your scheduled leave"}</p></div>
            <Plane size={20} className="card-icon" />
          </div>
          <div className="upcoming-list">
            {upcoming.length === 0 && <div className="empty-inline">Nothing scheduled. Time to plan a break?</div>}
            {upcoming.map((r) => (
              <div className="upcoming-item" key={r.id}>
                <div className="date-box"><strong>{toDate(r.start).getDate()}</strong><span>{toDate(r.start).toLocaleDateString("en-ZA", { month: "short" }).toUpperCase()}</span></div>
                <div>
                  <strong>{isReviewer ? r.employee : r.type}</strong>
                  <p>{isReviewer ? r.type : ""} {fmtShort(r.start)} – {fmtShort(r.end)} • {r.days} day{r.days === 1 ? "" : "s"}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
          <Link to="/calendar" className="secondary-button full-width">Open Leave Calendar</Link>
        </section>
      </div>

      <div className="dashboard-grid lower-grid">
        <section className="card">
          <div className="card-header"><div><h2>Leave Balance</h2><p>Current year allocation</p></div></div>
          {balances.map((b) => {
            const percent = Math.round((b.used / b.total) * 100);
            return (
              <div className="balance-row" key={b.label}>
                <div><span>{b.label}</span><strong>{b.used} / {b.total} days used</strong></div>
                <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }}></span></div>
              </div>
            );
          })}
        </section>

        <section className="card">
          <div className="card-header"><div><h2>Quick Actions</h2><p>Common tasks</p></div></div>
          <div className="quick-actions">
            <Link to="/apply-leave"><CalendarCheck size={19} /> Apply for leave</Link>
            <Link to="/leave-history"><FileText size={19} /> View leave history</Link>
            {isReviewer && <Link to="/leave-requests"><Users size={19} /> Review requests</Link>}
            <Link to="/profile"><Users size={19} /> View profile</Link>
          </div>
        </section>
      </div>
    </>
  );
}
