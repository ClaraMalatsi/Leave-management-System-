const KEY = "chimeraTheme";
const EVENT = "chimera-theme";

export function getTheme() {
  const stored = localStorage.getItem(KEY);
  return stored === "dark" || stored === "light" || stored === "system" ? stored : "light";
}

export function resolveTheme(theme = getTheme()) {
  if (theme === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

export function applyTheme(theme = getTheme()) {
  document.documentElement.classList.toggle("dark", resolveTheme(theme) === "dark");
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: theme }));
}

export function onThemeChange(handler) {
  const listener = () => handler(getTheme());
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function applyDensity(density) {
  document.documentElement.classList.toggle("compact", density === "compact");
}
