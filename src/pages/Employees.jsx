import React, { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { employees } from "../data/mockData";

export default function Employees() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => employees.filter(e => `${e.name} ${e.department} ${e.position}`.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <>
      <PageHeader title="Employees" description="Manage employee records and leave-related information." action={<button className="primary-button" onClick={() => setOpen(true)}><Plus size={17}/> Add Employee</button>} />
      <section className="card">
        <div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)}/></div><button className="secondary-button">Filters</button></div>
        <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Position</th><th>Manager</th><th>Joined</th><th>Status</th><th></th></tr></thead>
          <tbody>{filtered.map(e => <tr key={e.id}><td><div className="person-cell"><div className="avatar small">{e.name.split(" ").map(x=>x[0]).join("")}</div><div><strong>{e.name}</strong><span>{e.id}</span></div></div></td><td>{e.department}</td><td>{e.position}</td><td>{e.manager}</td><td>{e.joined}</td><td><StatusBadge status={e.status}/></td><td><button className="icon-button"><MoreHorizontal size={19}/></button></td></tr>)}</tbody>
        </table></div>
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Employee">
        <div className="form-grid"><div className="form-group"><label>First Name</label><input placeholder="First name"/></div><div className="form-group"><label>Last Name</label><input placeholder="Last name"/></div><div className="form-group"><label>Email</label><input type="email" placeholder="employee@chimera.co.za"/></div><div className="form-group"><label>Department</label><select><option>Information Technology</option><option>Human Resources</option><option>Finance</option><option>Marketing</option><option>Operations</option></select></div><div className="form-group"><label>Position</label><input placeholder="Job title"/></div><div className="form-group"><label>Manager</label><select><option>John Smith</option><option>Mary Jones</option></select></div></div>
        <div className="form-actions"><button className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button className="primary-button" onClick={() => setOpen(false)}>Save Employee</button></div>
      </Modal>
    </>
  );
}
