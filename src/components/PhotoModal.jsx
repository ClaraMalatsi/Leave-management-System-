import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Trash2, UploadCloud, ZoomIn, ZoomOut } from "lucide-react";
import Modal from "./Modal";
import { loadImage, readFileAsDataURL } from "../utils/storage";

const FRAME = 260;      // on-screen crop frame size (px)
const OUTPUT = 320;     // saved image size (px)
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoModal({ open, user, onClose, onSave, onRemove }) {
  const [src, setSrc] = useState(null);
  const [img, setImg] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const drag = useRef(null);

  const reset = useCallback(() => {
    setSrc(null); setImg(null); setZoom(1); setOffset({ x: 0, y: 0 });
    setError(""); setBusy(false); setDragOver(false);
  }, []);

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const baseScale = img ? Math.max(FRAME / img.width, FRAME / img.height) : 1;
  const scale = baseScale * zoom;

  const clamp = useCallback((pos, z = zoom) => {
    if (!img) return pos;
    const s = baseScale * z;
    const maxX = Math.max(0, (img.width * s - FRAME) / 2);
    const maxY = Math.max(0, (img.height * s - FRAME) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, pos.x)), y: Math.min(maxY, Math.max(-maxY, pos.y)) };
  }, [img, baseScale, zoom]);

  const handleFile = async (file) => {
    setError("");
    if (!file) return;
    if (!ALLOWED.includes(file.type)) return setError("Please choose a JPG, PNG or WEBP image.");
    if (file.size > MAX_BYTES) return setError("That image is larger than 5 MB. Please choose a smaller one.");
    try {
      const dataUrl = await readFileAsDataURL(file);
      const image = await loadImage(dataUrl);
      if (image.width < 100 || image.height < 100) return setError("The image is too small. Use one that is at least 100 × 100 pixels.");
      setSrc(dataUrl); setImg(image); setZoom(1); setOffset({ x: 0, y: 0 });
    } catch (err) {
      setError(err.message || "Could not load that image.");
    }
  };

  const onPointerDown = (e) => {
    if (!img) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: offset };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setOffset(clamp({ x: drag.current.start.x + e.clientX - drag.current.x, y: drag.current.start.y + e.clientY - drag.current.y }));
  };
  const onPointerUp = () => { drag.current = null; };

  const changeZoom = (value) => {
    const z = Math.min(3, Math.max(1, value));
    setZoom(z);
    setOffset((o) => clamp(o, z));
  };

  const save = async () => {
    if (!img) return;
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT; canvas.height = OUTPUT;
      const ctx = ctx2d(canvas);
      const ratio = OUTPUT / FRAME;
      const w = img.width * scale * ratio;
      const h = img.height * scale * ratio;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, OUTPUT, OUTPUT);
      ctx.drawImage(img, OUTPUT / 2 - w / 2 + offset.x * ratio, OUTPUT / 2 - h / 2 + offset.y * ratio, w, h);
      onSave(canvas.toDataURL("image/jpeg", 0.88));
    } catch {
      setError("Something went wrong while saving the photo. Please try again.");
      setBusy(false);
    }
  };

  return (
    <Modal open={open} title="Change profile photo" onClose={onClose} size="photo-modal">
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />

      {!img ? (
        <div
          className={`photo-drop ${dragOver ? "over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          onClick={() => inputRef.current?.click()}
          role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        >
          <div className="photo-drop-icon"><UploadCloud size={30} /></div>
          <strong>Drag a photo here, or click to browse</strong>
          <span>JPG, PNG or WEBP · up to 5 MB</span>
        </div>
      ) : (
        <div className="photo-editor">
          <div
            className="photo-frame"
            style={{ width: FRAME, height: FRAME }}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          >
            <img
              src={src} alt="Preview" draggable={false}
              style={{
                width: img.width * scale, height: img.height * scale,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
            <div className="photo-mask" />
          </div>
          <p className="photo-hint">Drag to reposition · use the slider to zoom</p>
          <div className="zoom-row">
            <button type="button" className="icon-button" onClick={() => changeZoom(zoom - 0.2)} aria-label="Zoom out"><ZoomOut size={18} /></button>
            <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => changeZoom(Number(e.target.value))} aria-label="Zoom" />
            <button type="button" className="icon-button" onClick={() => changeZoom(zoom + 0.2)} aria-label="Zoom in"><ZoomIn size={18} /></button>
          </div>
        </div>
      )}

      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="modal-actions photo-actions">
        {user?.photo && !img && (
          <button type="button" className="secondary-button danger-outline" onClick={onRemove}><Trash2 size={16} /> Remove photo</button>
        )}
        {img && (
          <button type="button" className="secondary-button" onClick={() => inputRef.current?.click()}><ImagePlus size={16} /> Choose another</button>
        )}
        <span className="spacer" />
        <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
        <button type="button" className="primary-button" disabled={!img || busy} onClick={save}><Check size={16} /> {busy ? "Saving…" : "Save photo"}</button>
      </div>
    </Modal>
  );
}

function ctx2d(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  return ctx;
}
