import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useLeaveRequests } from "../data/leaveStore";
import { Search } from "lucide-react";
import DownloadButton from "../components/DownloadButton";
import { downloadCsv } from "../utils/download";

export default function LeaveHistory({ user }) {
  const leaveRequests = useLeaveRequests();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const visible = user.role === "Employee" ? leaveRequests.filter((r) => r.employee === user.name) : leaveRequests;
  const filtered = useMemo(() => visible.filter((r) =>
    (r.type.toLowerCase().includes(search.toLowerCase()) || r.start.includes(search)) &&
    (status === "All" || r.status === status)
  ), [visible, search, status]);

  const exportHistory = () => {
    downloadCsv("chimera-leave-history.csv", filtered.map(({ id, employee, type, start, end, days, status }) => ({
      Reference: id, Employee: employee, "Leave Type": type, "Start Date": start, "End Date": end, Days: days, Status: status,
    })));
  };

  return (
    <>
      <PageHeader title="Leave History" description="Review submitted leave requests and their outcomes." action={<DownloadButton onClick={exportHistory}>Export</DownloadButton>} />
      <section className="card">
        <div className="toolbar">
          <div className="search-box"><Search size={18}/><input placeholder="Search leave type or date..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
        </div>
        <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Employee</th><th>Leave Type</th><th>Dates</th><th>Days</th><th>Status</th></tr></thead>
          <tbody>{filtered.map((r) => <tr key={r.id}><td><strong>{r.id}</strong></td><td>{r.employee}</td><td>{r.type}</td><td>{r.start} – {r.end}</td><td>{r.days}</td><td><StatusBadge status={r.status}/></td></tr>)}</tbody>
        </table></div>
      </section>
    </>
  );
}
