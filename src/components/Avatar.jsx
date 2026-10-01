import React from "react";

export default function Avatar({ user, size = "", className = "" }) {
  const initials = user?.initials || (user?.name || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`avatar ${size} ${className}`.trim()} aria-label={user?.name}>
      {user?.photo ? <img src={user.photo} alt={user.name || "Profile"} /> : initials}
    </div>
  );
}
