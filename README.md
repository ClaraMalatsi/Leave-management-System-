# Chimera Holdings Leave Management System

React + Vite frontend for leave management. Data is stored in the browser (localStorage) until a backend is connected.

## Run

```powershell
npm install
npm run dev
```
Open the URL Vite prints (normally http://localhost:5173/).

## Demo accounts (password: `password`)
- Employee: clara.malatsi@chimera.co.za
- Manager: john.smith@chimera.co.za
- Administrator: mary.jones@chimera.co.za

## What's new in this version
- **Change Photo** – upload (click or drag & drop), JPG/PNG/WEBP up to 5 MB, drag to reposition, zoom, remove. Saved per employee; shows in the top bar, menu and profile, and survives reload/logout.
- **Settings** – Appearance (light/dark/system theme, compact density), Notifications, Security (change password with strength meter, auto sign-out after inactivity), Organisation and System (admin only: backup export, reset demo data). Unsaved-change detection, discard and restore defaults.
- **Login** – validated form, show/hide password, remember me, forgot password, demo role shortcuts.
- **Dashboard** – time-aware greeting, hero banner with next public holiday, role-based stats, upcoming leave.
- **Leave workflow** – Apply Leave validates dates and balance and creates a real request that appears in My Leave, History, Calendar, Reports and the manager's Leave Requests. Managers can filter by status and must give a reason to reject.
- Toast notifications, profile validation, and dark-mode contrast fixes.

## Replacing the browser storage with a backend
Persistence lives in `src/utils/storage.js`, `src/data/leaveStore.js` and `src/hooks/useSettings.js`; swap those for API calls.
