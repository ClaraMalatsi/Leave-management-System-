import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Plus, MoreHorizontal } from "lucide-react";
import Modal from "../components/Modal";
import { leaveTypes as initialTypes } from "../data/mockData";

export default function LeaveTypes() {
  const [types, setTypes] = useState(initialTypes);
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Leave Types" description="Configure the leave categories and annual allocations." action={<button className="primary-button" onClick={() => setOpen(true)}><Plus size={17}/> Add Leave Type</button>} />
      <div className="cards-grid">{types.map(t => <div className="card leave-type-card" key={t.id}><div className="leave-type-top"><div className="leave-type-icon">✓</div><button className="icon-button"><MoreHorizontal size={19}/></button></div><h2>{t.name}</h2><p>{t.description}</p><div className="leave-type-footer"><span>Annual allocation</span><strong>{t.allocation === 0 ? "Configurable" : `${t.allocation} days`}</strong></div><span className={`paid-label ${t.paid ? "paid" : "unpaid"}`}>{t.paid ? "Paid leave" : "Unpaid leave"}</span></div>)}</div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Leave Type"><div className="form-grid"><div className="form-group"><label>Leave Type</label><input placeholder="e.g. Special Leave"/></div><div className="form-group"><label>Annual Allocation</label><input type="number" placeholder="Days"/></div><div className="form-group full"><label>Description</label><textarea rows="4" placeholder="Describe this leave type..."/></div></div><label className="checkbox-label"><input type="checkbox" defaultChecked/> Paid leave</label><div className="form-actions"><button className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button className="primary-button" onClick={() => setOpen(false)}>Save Leave Type</button></div></Modal>
    </>
  );
}
