import { useEffect, useState } from "react";
import { leaveRequests as seed } from "./mockData";
import { loadJSON, saveJSON } from "../utils/storage";

const KEY = "chimeraLeaveRequests";
const EVENT = "chimera-leave-requests";

export const getLeaveRequests = () => loadJSON(KEY, seed);

export function saveLeaveRequests(next) {
  saveJSON(KEY, next);
  window.dispatchEvent(new Event(EVENT));
}

export function addLeaveRequest(request) {
  const current = getLeaveRequests();
  const nextNumber = current.reduce((max, r) => Math.max(max, parseInt(r.id.split("-")[1], 10) || 0), 1000) + 1;
  const created = { id: `LR-${nextNumber}`, status: "Pending", ...request };
  saveLeaveRequests([created, ...current]);
  return created;
}

export function updateLeaveRequest(id, patch) {
  saveLeaveRequests(getLeaveRequests().map((r) => (r.id === id ? { ...r, ...patch } : r)));
}

export function useLeaveRequests() {
  const [requests, setRequests] = useState(getLeaveRequests);
  useEffect(() => {
    const sync = () => setRequests(getLeaveRequests());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return requests;
}
