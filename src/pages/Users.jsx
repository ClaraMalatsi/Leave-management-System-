import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Plus, ShieldCheck, MoreHorizontal, Check, UserPlus } from "lucide-react";
import { users as initialUsers } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Users() {
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chimeraUsers")) || initialUsers; } catch { return initialUsers; }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Employee", status: "Active" });
  const [message, setMessage] = useState("");

  const addUser = (event) => {
    event.preventDefault();
    const newUser = { ...form, lastLogin: "Never" };
    const next = [newUser, ...users];
    setUsers(next);
    localStorage.setItem("chimeraUsers", JSON.stringify(next));
    setForm({ name: "", email: "", role: "Employee", status: "Active" });
    setOpen(false);
    setMessage(`${newUser.name} was added successfully.`);
    window.setTimeout(() => setMessage(""), 3500);
  };

  return (
    <>
      <PageHeader title="Users & Roles" description="Manage system accounts and role-based permissions."
        action={<button className="primary-button" onClick={() => setOpen(true)}><Plus size={17}/> Add User</button>} />
      {message && <div className="success-alert"><Check size={17}/>{message}</div>}
      <section className="card">
        <div className="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Last Login</th><th>Status</th><th></th></tr></thead><tbody>
          {users.map((u, index) => <tr key={`${u.email}-${index}`}>
            <td><div className="person-cell"><div className="avatar small">{u.name.split(" ").map(x => x[0]).join("").slice(0,2)}</div><div><strong>{u.name}</strong><span>{u.email}</span></div></div></td>
            <td><span className="role-pill"><ShieldCheck size={14}/>{u.role}</span></td><td>{u.lastLogin}</td><td><StatusBadge status={u.status}/></td>
            <td><button className="icon-button" title="User options"><MoreHorizontal size={19}/></button></td>
          </tr>)}
        </tbody></table></div>
      </section>

      <Modal open={open} title="Add User" onClose={() => setOpen(false)}>
        <form onSubmit={addUser}>
          <div className="modal-intro"><UserPlus size={22}/><div><strong>Create a system user</strong><p>The new account will be stored locally until a backend is connected.</p></div></div>
          <div className="form-grid">
            <label>Full name<input required placeholder="e.g. Sipho Dlamini" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label>
            <label>Email address<input type="email" required placeholder="name@chimera.co.za" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></label>
            <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Employee</option><option>Manager</option><option>Administrator</option></select></label>
            <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></label>
          </div>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setOpen(false)}>Cancel</button><button type="submit" className="primary-button"><Check size={16}/> Add User</button></div>
        </form>
      </Modal>
    </>
  );
}
