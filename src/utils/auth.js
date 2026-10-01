import { loadJSON, saveJSON } from "./storage";

const PASSWORD_KEY = "chimeraPasswords";
export const DEFAULT_PASSWORD = "password";

export async function hashPassword(value) {
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(unescape(encodeURIComponent(value)));
}

export async function verifyPassword(email, password) {
  const saved = loadJSON(PASSWORD_KEY, {})[email.toLowerCase()];
  if (saved) return saved === (await hashPassword(password));
  return password === DEFAULT_PASSWORD;
}

export async function changePassword(email, newPassword) {
  const all = loadJSON(PASSWORD_KEY, {});
  all[email.toLowerCase()] = await hashPassword(newPassword);
  saveJSON(PASSWORD_KEY, all);
}

export function passwordStrength(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: value ? labels[score] : "", percent: (score / 5) * 100 };
}
