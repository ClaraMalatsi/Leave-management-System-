import React from "react";

export default function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img src="/assets/chimera-logo.png" alt="Chimera Holdings" />
    </div>
  );
}
