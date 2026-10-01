import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useLeaveRequests } from "../data/leaveStore";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function LeaveCalendar() {
  const leaveRequests = useLeaveRequests();
  const [date, setDate] = useState(new Date(2026, 9, 1));
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < first; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [first, daysInMonth]);

  const leaveForDay = (day) => {
    if (!day) return [];
    const current = new Date(year, month, day);
    return leaveRequests.filter((r) => {
      const start = new Date(`${r.start}T00:00:00`);
      const end = new Date(`${r.end}T00:00:00`);
      return current >= start && current <= end;
    }).slice(0, 2);
  };

  return (
    <>
      <PageHeader title="Leave Calendar" description="See approved and pending leave across the organisation." />
      <section className="card calendar-card">
        <div className="calendar-toolbar">
          <button className="icon-button" onClick={() => setDate(new Date(year, month - 1, 1))}><ChevronLeft size={20}/></button>
          <h2>{monthNames[month]} {year}</h2>
          <button className="icon-button" onClick={() => setDate(new Date(year, month + 1, 1))}><ChevronRight size={20}/></button>
          <button className="secondary-button calendar-today" onClick={() => setDate(new Date(2026, 9, 1))}><CalendarDays size={17}/> Today</button>
        </div>
        <div className="calendar-grid calendar-weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}</div>
        <div className="calendar-grid">
          {cells.map((day, index) => (
            <div className={`calendar-cell ${day ? "" : "empty"}`} key={index}>
              {day && <><div className="calendar-day-number">{day}</div>{leaveForDay(day).map((r) => <div className={`calendar-event ${r.status.toLowerCase()}`} key={r.id}>{r.employee.split(" ")[0]} • {r.type.replace(" Leave","")}</div>)}</>}
            </div>
          ))}
        </div>
        <div className="calendar-legend"><span><i className="legend-dot approved"></i> Approved</span><span><i className="legend-dot pending"></i> Pending</span><span><i className="legend-dot rejected"></i> Rejected</span></div>
      </section>
    </>
  );
}
