import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import Avatar from "../components/Avatar";
import PhotoModal from "../components/PhotoModal";
import EditProfileModal from "../components/EditProfileModal";
import { useToast } from "../context/Toast";
import { Camera, Mail, Phone, Building2, ShieldCheck } from "lucide-react";

export default function Profile({ user, onUserUpdate }) {
  const { notify } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);

  const saveProfile = (updates) => {
    if (onUserUpdate(updates)) {
      setEditOpen(false);
      notify("Your profile has been updated.", "success", "Profile saved");
    }
  };

  const savePhoto = (photo) => {
    if (onUserUpdate({ photo })) {
      setPhotoOpen(false);
      notify("Your new profile photo is now showing across the system.", "success", "Photo updated");
    }
  };

  const removePhoto = () => {
    if (onUserUpdate({ photo: null })) {
      setPhotoOpen(false);
      notify("Your profile photo was removed.", "info");
    }
  };

  return (
    <>
      <PageHeader title="My Profile" description="View and manage your employee information."
        action={<button className="primary-button" onClick={() => setEditOpen(true)}>Edit Profile</button>} />
      <div className="profile-grid">
        <section className="card profile-card">
          <div className="profile-cover"></div>
          <div className="profile-main">
            <button type="button" className="profile-avatar-btn" onClick={() => setPhotoOpen(true)} aria-label="Change profile photo">
              <Avatar user={user} size="xl" />
              <span className="avatar-overlay"><Camera size={20} /></span>
            </button>
            <button className="secondary-button small" type="button" onClick={() => setPhotoOpen(true)}>
              <Camera size={16} /> Change Photo
            </button>
            <h2>{user.name}</h2>
            <p>{user.position}</p>
            <span className="role-pill centered"><ShieldCheck size={14} />{user.role}</span>
            <div className="profile-meta">
              <span><Mail size={16} /> {user.email}</span>
              {user.phone && <span><Phone size={16} /> {user.phone}</span>}
              <span><Building2 size={16} /> {user.department}</span>
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card-header">
            <div><h2>Personal information</h2><p>Your employee profile details.</p></div>
            <button className="secondary-button" onClick={() => setEditOpen(true)}>Edit Profile</button>
          </div>
          <div className="detail-grid">
            <div><span>Full name</span><strong>{user.name}</strong></div>
            <div><span>Employee number</span><strong>{user.employeeNumber}</strong></div>
            <div><span>Email</span><strong>{user.email}</strong></div>
            <div><span>Phone</span><strong>{user.phone || "Not provided"}</strong></div>
            <div><span>Department</span><strong>{user.department}</strong></div>
            <div><span>Position</span><strong>{user.position}</strong></div>
            <div><span>Manager</span><strong>{user.manager || "Not assigned"}</strong></div>
            <div><span>Joined</span><strong>{user.joined || "Not provided"}</strong></div>
          </div>
        </section>
      </div>

      <EditProfileModal open={editOpen} user={user} onClose={() => setEditOpen(false)} onSave={saveProfile} />
      <PhotoModal open={photoOpen} user={user} onClose={() => setPhotoOpen(false)} onSave={savePhoto} onRemove={removePhoto} />
    </>
  );
}
