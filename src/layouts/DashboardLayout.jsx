import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell, CalendarDays, ChevronDown, ClipboardList, FileBarChart,
  LayoutDashboard, LogOut, Menu, Settings, UserCircle, Users,
  Building2, ShieldCheck, History, Palmtree, UserPlus, X, Sun, Moon,
  CheckCheck, UserRound, ExternalLink
} from "lucide-react";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import EditProfileModal from "../components/EditProfileModal";
import { useToast } from "../context/Toast";
import { getTheme, resolveTheme, setTheme, onThemeChange, applyTheme } from "../utils/theme";

const mainLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/my-leave", label: "My Leave", icon: Palmtree },
  { to: "/apply-leave", label: "Apply for Leave", icon: UserPlus },
  { to: "/leave-history", label: "Leave History", icon: ClipboardList },
  { to: "/calendar", label: "Leave Calendar", icon: CalendarDays }
];

const managementLinks = [
  { to: "/employees", label: "Employees", icon: Users, roles: ["Manager", "Administrator"] },
  { to: "/leave-requests", label: "Leave Requests", icon: ClipboardList, roles: ["Manager", "Administrator"] },
  { to: "/reports", label: "Leave Reports", icon: FileBarChart, roles: ["Manager", "Administrator"] },
  { to: "/holidays", label: "Public Holidays", icon: CalendarDays, roles: ["Administrator"] },
  { to: "/leave-types", label: "Leave Types", icon: Palmtree, roles: ["Administrator"] },
  { to: "/departments", label: "Departments", icon: Building2, roles: ["Administrator"] }
];

const adminLinks = [
  { to: "/users", label: "Users & Roles", icon: ShieldCheck, roles: ["Administrator"] },
  { to: "/audit-logs", label: "Audit Logs", icon: History, roles: ["Administrator"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["Administrator", "Manager", "Employee"] }
];

const initialNotifications = [
  { id: 1, title: "Leave request pending", message: "Clara Malatsi's annual leave is awaiting approval.", time: "10 min ago", read: false },
  { id: 2, title: "Leave approved", message: "Your leave request LR-1002 has been approved.", time: "1 hour ago", read: false },
  { id: 3, title: "Public holiday reminder", message: "Day of Reconciliation is coming up on 16 December.", time: "Yesterday", read: true }
];

export default function DashboardLayout({ user, onUserUpdate, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { notify } = useToast();
  const [theme, setThemeState] = useState(getTheme);
  const dark = resolveTheme(theme) === "dark";
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chimeraNotifications")) || initialNotifications;
    } catch {
      return initialNotifications;
    }
  });
  const [editOpen, setEditOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => onThemeChange(setThemeState), []);

  useEffect(() => {
    const closeMenus = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const toggleTheme = () => setTheme(dark ? "light" : "dark");

  const filtered = (links) => links.filter((item) => !item.roles || item.roles.includes(user.role));
  const closeMobile = () => setMobileOpen(false);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const saveProfile = (updates) => {
    if (onUserUpdate(updates)) {
      setEditOpen(false);
      notify("Your profile has been updated.", "success", "Profile saved");
    }
  };

  const updateNotificationState = (next) => {
    setNotifications(next);
    localStorage.setItem("chimeraNotifications", JSON.stringify(next));
  };

  const markAllRead = () => updateNotificationState(notifications.map((item) => ({ ...item, read: true })));
  const markRead = (id) => updateNotificationState(notifications.map((item) => item.id === id ? { ...item, read: true } : item));

  const openProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const openEditProfile = () => {
    setProfileOpen(false);
    setEditOpen(true);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <Logo />
          <button className="mobile-close icon-button" onClick={closeMobile}><X size={20} /></button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-label">Main</span>
            {mainLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={closeMobile}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Icon size={19} /><span>{label}</span>
              </NavLink>
            ))}
          </div>

          {filtered(managementLinks).length > 0 && (
            <div className="nav-section">
              <span className="nav-label">Management</span>
              {filtered(managementLinks).map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={closeMobile}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Icon size={19} /><span>{label}</span>
                </NavLink>
              ))}
            </div>
          )}

          <div className="nav-section">
            <span className="nav-label">Account</span>
            <NavLink to="/profile" onClick={closeMobile}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <UserCircle size={19} /><span>My Profile</span>
            </NavLink>
            {filtered(adminLinks).map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={closeMobile}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Icon size={19} /><span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-link" onClick={onLogout}>
            <LogOut size={19} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile}></div>}

      <div className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          <div className="breadcrumb">
            <span>Chimera Holdings</span><span>/</span>
            <strong>{location.pathname === "/" ? "Dashboard" : location.pathname.replace("/", "").replaceAll("-", " ")}</strong>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" title="Toggle theme" onClick={toggleTheme}>
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <div className="notification-wrap" ref={notificationRef}>
              <button className="icon-button notification-button" title="Notifications" onClick={() => { setNotificationsOpen((v) => !v); setProfileOpen(false); }}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-dot"></span>}
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="dropdown-header">
                    <div><strong>Notifications</strong><span>{unreadCount} unread</span></div>
                    <button className="text-button" onClick={markAllRead}>Mark all read</button>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="empty-state compact"><Bell size={24}/><p>No notifications</p></div>
                    ) : notifications.map((item) => (
                      <button key={item.id} className={`notification-item ${item.read ? "read" : ""}`} onClick={() => markRead(item.id)}>
                        <span className="notification-icon"><Bell size={15}/></span>
                        <span className="notification-content"><strong>{item.title}</strong><span>{item.message}</span><small>{item.time}</small></span>
                        {!item.read && <span className="unread-dot"></span>}
                      </button>
                    ))}
                  </div>
                  <button className="notification-footer" onClick={() => { setNotificationsOpen(false); navigate("/leave-requests"); }}>
                    View leave activity <ExternalLink size={14}/>
                  </button>
                </div>
              )}
            </div>

            <div className="profile-menu-wrap" ref={menuRef}>
              <button className="user-menu user-menu-button" onClick={() => { setProfileOpen((v) => !v); setNotificationsOpen(false); }} aria-expanded={profileOpen}>
                <Avatar user={user} />
                <div className="user-menu-text"><strong>{user.name}</strong><span>{user.role}</span></div>
                <ChevronDown size={16} className={profileOpen ? "rotate-icon" : ""} />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-user">
                    <Avatar user={user} />
                    <div><strong>{user.name}</strong><span>{user.email}</span></div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={openProfile}><UserCircle size={17}/> My Profile</button>
                  <button onClick={openEditProfile}><UserRound size={17}/> Edit Profile</button>
                  <button onClick={() => { setProfileOpen(false); navigate("/settings"); }}><Settings size={17}/> Settings</button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-danger" onClick={onLogout}><LogOut size={17}/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content"><Outlet /></main>
        <footer className="footer"><span>© 2026 Chimera Holdings. Leave Management System.</span><span>Version 1.0 • Secure workspace</span></footer>
      </div>

      <EditProfileModal open={editOpen} user={user} onClose={() => setEditOpen(false)} onSave={saveProfile} />
    </div>
  );
}
