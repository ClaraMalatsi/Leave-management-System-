import React from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import DownloadButton from "../components/DownloadButton";
import { CalendarCheck, Users, Clock3, FileCheck2 } from "lucide-react";
import { employees } from "../data/mockData";
import { useLeaveRequests } from "../data/leaveStore";
import { downloadCsv } from "../utils/download";

const leaveUtilisation = [
  { "Leave Type": "Annual Leave", Utilisation: "78%" },
  { "Leave Type": "Sick Leave", Utilisation: "42%" },
  { "Leave Type": "Family Responsibility", Utilisation: "31%" },
  { "Leave Type": "Study Leave", Utilisation: "19%" },
];

export default function Reports() {
  const leaveRequests = useLeaveRequests();
  const exportReport = () => downloadCsv("chimera-leave-report.csv", leaveRequests.map(({ id, employee, type, start, end, days, status, reason }) => ({
    Reference: id, Employee: employee, "Leave Type": type, "Start Date": start, "End Date": end, Days: days, Status: status, Reason: reason,
  })));

  const exportEmployeeSummary = () => downloadCsv("chimera-employee-leave-summary.csv", employees.map((employee) => ({
    Employee: employee.name, EmployeeID: employee.id, Department: employee.department, Position: employee.position, Status: employee.status,
    "Leave Requests": leaveRequests.filter((request) => request.employee === employee.name).length,
    "Leave Days": leaveRequests.filter((request) => request.employee === employee.name).reduce((sum, request) => sum + request.days, 0),
  })));

  const exportDepartmentReport = () => downloadCsv("chimera-department-leave-report.csv", [
    { Department: "Information Technology", "Leave Days": 102 },
    { Department: "Operations", "Leave Days": 94 },
    { Department: "Finance", "Leave Days": 68 },
    { Department: "Marketing", "Leave Days": 51 },
    { Department: "Human Resources", "Leave Days": 37 },
  ]);

  const exportMonthlyTrend = () => downloadCsv("chimera-monthly-leave-trend.csv", [
    { Month: "January", Days: 24 }, { Month: "February", Days: 31 }, { Month: "March", Days: 28 },
    { Month: "April", Days: 35 }, { Month: "May", Days: 40 }, { Month: "June", Days: 33 },
    { Month: "July", Days: 38 }, { Month: "August", Days: 42 }, { Month: "September", Days: 36 },
  ]);

  const exportPending = () => downloadCsv("chimera-pending-requests.csv", leaveRequests.filter((request) => request.status === "Pending"));

  return (
    <>
      <PageHeader title="Leave Reports" description="Analyse leave activity across the organisation." action={<DownloadButton onClick={exportReport}>Export Report</DownloadButton>} />
      <div className="stat-grid">
        <StatCard icon={<Users size={22}/>} label="Total Employees" value="124" helper="Active employees" tone="blue"/>
        <StatCard icon={<CalendarCheck size={22}/>} label="Days Taken" value="386" helper="This year" tone="red"/>
        <StatCard icon={<Clock3 size={22}/>} label="Pending Requests" value={leaveRequests.filter(r => r.status === "Pending").length} helper="Awaiting approval" tone="orange"/>
        <StatCard icon={<FileCheck2 size={22}/>} label="Approval Rate" value="91%" helper="Current year" tone="green"/>
      </div>
      <div className="dashboard-grid">
        <section className="card"><div className="card-header"><div><h2>Leave utilisation</h2><p>Used versus allocated days by leave type.</p></div></div><div className="chart">{leaveUtilisation.map((item) => <div className="bar-row" key={item["Leave Type"]}><span>{item["Leave Type"]}</span><div className="bar"><i style={{width:item.Utilisation}}></i></div><strong>{item.Utilisation}</strong></div>)}</div></section>
        <section className="card"><div className="card-header"><div><h2>Department activity</h2><p>Leave days used this year.</p></div></div><div className="simple-stat-list">{[["Information Technology",102],["Operations",94],["Finance",68],["Marketing",51],["Human Resources",37]].map(([name,days]) => <div key={name}><span>{name}</span><strong>{days} days</strong></div>)}</div></section>
      </div>
      <section className="card"><div className="card-header"><div><h2>Available report exports</h2><p>Each option generates a CSV file directly in your browser.</p></div></div><div className="report-links">
        <button type="button" onClick={exportEmployeeSummary}>Employee Leave Summary <span>↓</span></button>
        <button type="button" onClick={exportDepartmentReport}>Department Leave Report <span>↓</span></button>
        <button type="button" onClick={exportMonthlyTrend}>Monthly Leave Trend <span>↓</span></button>
        <button type="button" onClick={exportPending}>Pending Requests <span>↓</span></button>
      </div></section>
    </>
  );
}
