import React from "react";
import { CalendarCheck, Clock3, FileText } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { useLeaveRequests } from "../data/leaveStore";
import StatusBadge from "../components/StatusBadge";

export default function MyLeave({ user }) {
  const leaveRequests = useLeaveRequests();
  const myRequests = leaveRequests.filter((r) => r.employee === user.name);
  return (
    <>
      <PageHeader title="My Leave" description="View your leave balances and current requests." />
      <div className="stat-grid">
        <StatCard icon={<CalendarCheck size={22}/>} label="Annual Leave" value="7 days" helper="Remaining" tone="red"/>
        <StatCard icon={<Clock3 size={22}/>} label="Sick Leave" value="8 days" helper="Remaining" tone="blue"/>
        <StatCard icon={<FileText size={22}/>} label="Pending" value={myRequests.filter((r) => r.status === "Pending").length} helper="Awaiting approval" tone="orange"/>
        <StatCard icon={<CalendarCheck size={22}/>} label="Used This Year" value="10 days" helper="Across all leave" tone="green"/>
      </div>
      <section className="card">
        <div className="card-header"><div><h2>Current requests</h2><p>Your recent and upcoming leave requests.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Type</th><th>Dates</th><th>Days</th><th>Status</th></tr></thead>
          <tbody>{myRequests.length ? myRequests.map((r) => <tr key={r.id}><td><strong>{r.id}</strong></td><td>{r.type}</td><td>{r.start} – {r.end}</td><td>{r.days}</td><td><StatusBadge status={r.status}/></td></tr>) : <tr><td colSpan="5">No requests found.</td></tr>}</tbody>
        </table></div>
      </section>
    </>
  );
}
