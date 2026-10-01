import { useCallback, useEffect, useState } from "react";
import { loadJSON, saveJSON } from "../utils/storage";

const KEY = "chimeraSettings";
const EVENT = "chimera-settings";

export const defaultSettings = {
  organisation: {
    name: "Chimera Holdings",
    weekStart: "Monday",
    workingHours: "08:00 – 17:00",
    requireApproval: true,
    allowCancel: true,
    leaveYearStart: "January",
  },
  notifications: {
    email: true,
    leaveApproved: true,
    leaveRejected: true,
    newRequest: true,
    holidayReminders: true,
    weeklyDigest: false,
  },
  appearance: { density: "comfortable" },
  security: { twoFactor: false, sessionTimeout: 30 },
};

const merge = (stored) => ({
  organisation: { ...defaultSettings.organisation, ...stored?.organisation },
  notifications: { ...defaultSettings.notifications, ...stored?.notifications },
  appearance: { ...defaultSettings.appearance, ...stored?.appearance },
  security: { ...defaultSettings.security, ...stored?.security },
});

export const getSettings = () => merge(loadJSON(KEY, null));

export function saveSettings(next) {
  saveJSON(KEY, next);
  window.dispatchEvent(new Event(EVENT));
}

export function useSettings() {
  const [settings, setSettings] = useState(getSettings);
  useEffect(() => {
    const sync = () => setSettings(getSettings());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const update = useCallback((next) => saveSettings(next), []);
  return [settings, update];
}
