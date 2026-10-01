import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Modal from "./Modal";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditProfileModal({ open, user, onClose, onSave }) {
  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (open) { setForm(user); setErrors({}); } }, [open, user]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name?.trim() || form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!EMAIL.test(form.email?.trim() || "")) next.email = "Enter a valid email address.";
    if (form.phone && !/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({
      name: form.name.trim(), email: form.email.trim(), phone: (form.phone || "").trim(),
      department: (form.department || "").trim(), position: (form.position || "").trim(), manager: (form.manager || "").trim(),
    });
  };

  const field = (label, key, props = {}) => (
    <label className={errors[key] ? "has-error" : ""}>
      {label}
      <input value={form[key] || ""} onChange={set(key)} {...props} />
      {errors[key] && <small className="field-error">{errors[key]}</small>}
    </label>
  );

  return (
    <Modal open={open} title="Edit Profile" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          {field("Full name", "name")}
          {field("Email", "email", { type: "email" })}
          {field("Phone", "phone")}
          {field("Department", "department")}
          {field("Position", "position")}
          {field("Manager", "manager")}
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button"><Check size={16} /> Save Changes</button>
        </div>
      </form>
    </Modal>
  );
}
