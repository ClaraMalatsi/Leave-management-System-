import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Plus, Building2, MoreHorizontal, Check } from "lucide-react";
import { departments as initialDepartments } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Departments() {
  const [departments, setDepartments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chimeraDepartments")) || initialDepartments; } catch { return initialDepartments; }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", manager: "", employees: 0, status: "Active" });
  const [message, setMessage] = useState("");

  const addDepartment = (event) => {
    event.preventDefault();
    const nextNumber = departments.length + 1;
    const newDepartment = {
      id: `DEP-${String(nextNumber).padStart(2, "0")}`,
      name: form.name.trim(),
      manager: form.manager.trim() || "Not assigned",
      employees: Number(form.employees) || 0,
      status: form.status
    };
    const next = [...departments, newDepartment];
    setDepartments(next);
    localStorage.setItem("chimeraDepartments", JSON.stringify(next));
    setForm({ name: "", manager: "", employees: 0, status: "Active" });
    setOpen(false);
    setMessage(`${newDepartment.name} was added successfully.`);
    window.setTimeout(() => setMessage(""), 3500);
  };

  return (
    <>
      <PageHeader title="Departments" description="Manage organisational departments and responsible managers."
        action={<button className="primary-button" onClick={() => setOpen(true)}><Plus size={17}/> Add Department</button>} />
      {message && <div className="success-alert"><Check size={17}/>{message}</div>}
      <section className="card"><div className="table-wrap"><table><thead><tr><th>Department</th><th>Manager</th><th>Employees</th><th>Status</th><th></th></tr></thead><tbody>
        {departments.map(d => <tr key={d.id}><td><div className="person-cell"><div className="icon-square"><Building2 size={18}/></div><div><strong>{d.name}</strong><span>{d.id}</span></div></div></td><td>{d.manager}</td><td>{d.employees}</td><td><StatusBadge status={d.status}/></td><td><button className="icon-button" title="Department options"><MoreHorizontal size={19}/></button></td></tr>)}
      </tbody></table></div></section>

      <Modal open={open} title="Add Department" onClose={() => setOpen(false)}>
        <form onSubmit={addDepartment}>
          <div className="modal-intro"><Building2 size={22}/><div><strong>Create a department</strong><p>Add an organisational department and assign a responsible manager.</p></div></div>
          <div className="form-grid">
            <label>Department name<input required placeholder="e.g. Information Security" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label>
            <label>Department manager<input placeholder="e.g. Jane Smith" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })}/></label>
            <label>Employees<input type="number" min="0" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })}/></label>
            <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></label>
          </div>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="primary-button"><Check size={16}/> Add Department</button></div>
        </form>
      </Modal>
    </>
  );
}
