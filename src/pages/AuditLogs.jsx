import React from "react";
import PageHeader from "../components/PageHeader";
import { Search } from "lucide-react";
import DownloadButton from "../components/DownloadButton";
import { downloadCsv } from "../utils/download";
import { auditLogs } from "../data/mockData";

export default function AuditLogs() {
  const exportLogs = () => downloadCsv("chimera-audit-logs.csv", auditLogs);

  return (
    <>
      <PageHeader title="Audit Logs" description="Track important actions performed within the system." action={<DownloadButton onClick={exportLogs}>Export Logs</DownloadButton>} />
      <section className="card"><div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Search logs..." /></div><select><option>All modules</option><option>Authentication</option><option>Leave</option><option>Employees</option><option>Administration</option></select></div><div className="table-wrap"><table><thead><tr><th>Date & Time</th><th>User</th><th>Action</th><th>Module</th><th>Result</th></tr></thead><tbody>{auditLogs.map((l,i)=><tr key={i}><td>{l.date}</td><td><strong>{l.user}</strong></td><td>{l.action}</td><td>{l.module}</td><td><StatusPill text={l.result}/></td></tr>)}</tbody></table></div></section>
    </>
  );
}
function StatusPill({text}) { return <span className="result-success">● {text}</span>; }
