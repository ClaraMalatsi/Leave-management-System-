import React from "react";
import { Download } from "lucide-react";

export default function DownloadButton({ children = "Download", onClick, className = "secondary-button", title }) {
  return (
    <button type="button" className={className} onClick={onClick} title={title || children}>
      <Download size={17} />
      {children}
    </button>
  );
}
