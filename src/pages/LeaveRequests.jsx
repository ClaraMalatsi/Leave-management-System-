import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { Check, X, Eye } from "lucide-react";
import { updateLeaveRequest, useLeaveRequests } from "../data/leaveStore";
import { useToast } from "../context/Toast";

export default function LeaveRequests() {
  const requests = useLeaveRequests();
  const { notify } = useToast();
  const [selected, setSelected] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [filter, setFilter] = useState("All");
  const [rejectReason, setRejectReason] = useState("");

  const counts = { All: requests.length, Pending: 0, Approved: 0, Rejected: 0 };
  requests.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
  const visible = filter === "All" ? requests : requests.filter((r) => r.status === filter);

  const close = () => { setSelected(null); setRejecting(false); setRejectReason(""); };

  const updateStatus = (id, status, note) => {
    const target = requests.find((r) => r.id === id);
    updateLeaveRequest(id, note ? { status, rejectionReason: note } : { status });
    notify(`${target?.employee}'s request ${id} was ${status.toLowerCase()}.`, status === "Approved" ? "success" : "info", `Request ${status.toLowerCase()}`);
    close();
  };

  return (
    <>
      <PageHeader title="Leave Requests" description="Review, approve and reject employee leave requests." />
      <section className="card">
        <div className="filter-tabs">{["All", "Pending", "Approved", "Rejected"].map((tab) => <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab === "All" ? "All Requests" : tab} <span className="tab-count">{counts[tab] || 0}</span></button>)}</div>
        <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Leave Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{visible.length === 0 && <tr><td colSpan="7"><div className="empty-inline">No {filter.toLowerCase()} requests.</div></td></tr>}{visible.map(r => <tr key={r.id}><td><strong>{r.employee}</strong><span className="sub-cell">{r.id}</span></td><td>{r.type}</td><td>{r.start}<br/>to {r.end}</td><td>{r.days}</td><td>{r.reason}</td><td><StatusBadge status={r.status}/></td><td><div className="action-buttons"><button className="icon-button" title="View" onClick={() => setSelected(r)}><Eye size={17}/></button>{r.status === "Pending" && <><button className="icon-button success-icon" title="Approve" onClick={() => updateStatus(r.id, "Approved")}><Check size={17}/></button><button className="icon-button danger-icon" title="Reject" onClick={() => {setSelected(r); setRejecting(true); setRejectReason("")}}><X size={17}/></button></>}</div></td></tr>)}</tbody>
        </table></div>
      </section>

      <Modal open={!!selected} onClose={close} title={rejecting ? "Reject Leave Request" : "Leave Request Details"}>
        {selected && !rejecting && <div className="request-detail"><div className="request-detail-header"><div className="avatar">{selected.employee.split(" ").map(x=>x[0]).join("")}</div><div><h3>{selected.employee}</h3><p>{selected.id}</p></div><StatusBadge status={selected.status}/></div><div className="detail-grid"><div><span>Leave Type</span><strong>{selected.type}</strong></div><div><span>Duration</span><strong>{selected.days} working days</strong></div><div><span>Start</span><strong>{selected.start}</strong></div><div><span>End</span><strong>{selected.end}</strong></div><div className="wide"><span>Reason</span><strong>{selected.reason}</strong></div>{selected.rejectionReason && <div className="wide"><span>Rejection reason</span><strong>{selected.rejectionReason}</strong></div>}</div>{selected.status === "Pending" && <div className="form-actions"><button className="secondary-button danger-button" onClick={() => setRejecting(true)}><X size={17}/> Reject</button><button className="primary-button" onClick={() => updateStatus(selected.id, "Approved")}><Check size={17}/> Approve</button></div>}</div>}
        {selected && rejecting && <div><p>Provide a reason for rejecting <strong>{selected.employee}'s</strong> request.</p><div className="form-group"><label>Rejection reason</label><textarea rows="4" placeholder="Enter the reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} autoFocus/></div><div className="form-actions"><button className="secondary-button" onClick={() => setRejecting(false)}>Cancel</button><button className="primary-button danger-button" disabled={rejectReason.trim().length < 3} onClick={() => updateStatus(selected.id, "Rejected", rejectReason.trim())}>Reject Request</button></div></div>}
      </Modal>
    </>
  );
}
