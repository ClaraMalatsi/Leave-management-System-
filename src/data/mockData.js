export const employees = [
  { id: "CH-00124", name: "Clara Malatsi", department: "Information Technology", position: "Software Developer", manager: "John Smith", status: "Active", joined: "2025-01-06", email: "clara.malatsi@chimera.co.za" },
  { id: "CH-00125", name: "John Smith", department: "Information Technology", position: "IT Manager", manager: "Mary Jones", status: "Active", joined: "2022-03-14", email: "john.smith@chimera.co.za" },
  { id: "CH-00126", name: "Mary Jones", department: "Human Resources", position: "HR Administrator", manager: "Executive Office", status: "Active", joined: "2021-08-02", email: "mary.jones@chimera.co.za" },
  { id: "CH-00127", name: "Thabo Mokoena", department: "Finance", position: "Accountant", manager: "Mary Jones", status: "Active", joined: "2023-05-15", email: "thabo.mokoena@chimera.co.za" },
  { id: "CH-00128", name: "Lerato Dlamini", department: "Marketing", position: "Marketing Officer", manager: "Mary Jones", status: "Active", joined: "2024-02-12", email: "lerato.dlamini@chimera.co.za" },
  { id: "CH-00129", name: "Peter Nkosi", department: "Operations", position: "Operations Coordinator", manager: "John Smith", status: "Active", joined: "2023-11-20", email: "peter.nkosi@chimera.co.za" }
];

export const leaveRequests = [
  { id: "LR-1001", employee: "Clara Malatsi", type: "Annual Leave", start: "2026-10-20", end: "2026-10-24", days: 5, status: "Pending", reason: "Family vacation" },
  { id: "LR-1002", employee: "John Smith", type: "Sick Leave", start: "2026-09-15", end: "2026-09-16", days: 2, status: "Approved", reason: "Medical appointment" },
  { id: "LR-1003", employee: "Mary Jones", type: "Annual Leave", start: "2026-11-02", end: "2026-11-06", days: 5, status: "Pending", reason: "Personal break" },
  { id: "LR-1004", employee: "Thabo Mokoena", type: "Family Responsibility", start: "2026-10-08", end: "2026-10-09", days: 2, status: "Approved", reason: "Family matter" },
  { id: "LR-1005", employee: "Lerato Dlamini", type: "Annual Leave", start: "2026-10-26", end: "2026-10-30", days: 5, status: "Rejected", reason: "Department workload" },
  { id: "LR-1006", employee: "Peter Nkosi", type: "Study Leave", start: "2026-10-12", end: "2026-10-14", days: 3, status: "Pending", reason: "Professional examination" }
];

export const leaveTypes = [
  { id: 1, name: "Annual Leave", allocation: 15, paid: true, description: "Annual paid vacation leave." },
  { id: 2, name: "Sick Leave", allocation: 10, paid: true, description: "Leave for illness or medical care." },
  { id: 3, name: "Family Responsibility", allocation: 3, paid: true, description: "Leave for qualifying family responsibilities." },
  { id: 4, name: "Maternity Leave", allocation: 120, paid: true, description: "Maternity leave allocation configured by HR policy." },
  { id: 5, name: "Paternity Leave", allocation: 10, paid: true, description: "Paternity/parental leave allocation." },
  { id: 6, name: "Study Leave", allocation: 5, paid: true, description: "Leave for approved study or examinations." },
  { id: 7, name: "Unpaid Leave", allocation: 0, paid: false, description: "Approved leave without salary." },
  { id: 8, name: "Compassionate Leave", allocation: 5, paid: true, description: "Leave for bereavement and compassionate circumstances." }
];

export const departments = [
  { id: "DEP-01", name: "Information Technology", manager: "John Smith", employees: 28, status: "Active" },
  { id: "DEP-02", name: "Human Resources", manager: "Mary Jones", employees: 12, status: "Active" },
  { id: "DEP-03", name: "Finance", manager: "Thabo Mokoena", employees: 19, status: "Active" },
  { id: "DEP-04", name: "Marketing", manager: "Lerato Dlamini", employees: 14, status: "Active" },
  { id: "DEP-05", name: "Operations", manager: "Peter Nkosi", employees: 51, status: "Active" }
];

export const holidays = [
  { date: "2026-12-16", name: "Day of Reconciliation", type: "Public Holiday" },
  { date: "2026-12-25", name: "Christmas Day", type: "Public Holiday" },
  { date: "2026-12-26", name: "Day of Goodwill", type: "Public Holiday" },
  { date: "2027-01-01", name: "New Year's Day", type: "Public Holiday" }
];

export const users = [
  { name: "Clara Malatsi", email: "clara.malatsi@chimera.co.za", role: "Employee", status: "Active", lastLogin: "Today, 08:41" },
  { name: "John Smith", email: "john.smith@chimera.co.za", role: "Manager", status: "Active", lastLogin: "Today, 08:17" },
  { name: "Mary Jones", email: "mary.jones@chimera.co.za", role: "Administrator", status: "Active", lastLogin: "Today, 07:55" },
  { name: "Thabo Mokoena", email: "thabo.mokoena@chimera.co.za", role: "Employee", status: "Active", lastLogin: "Yesterday, 16:10" }
];

export const auditLogs = [
  { date: "2026-09-29 08:41", user: "Clara Malatsi", action: "Logged in", module: "Authentication", result: "Success" },
  { date: "2026-09-29 08:35", user: "John Smith", action: "Approved leave request LR-1002", module: "Leave", result: "Success" },
  { date: "2026-09-28 15:22", user: "Mary Jones", action: "Updated leave type", module: "Administration", result: "Success" },
  { date: "2026-09-28 13:05", user: "Mary Jones", action: "Created employee CH-00129", module: "Employees", result: "Success" },
  { date: "2026-09-27 10:48", user: "John Smith", action: "Rejected leave request LR-1005", module: "Leave", result: "Success" }
];
