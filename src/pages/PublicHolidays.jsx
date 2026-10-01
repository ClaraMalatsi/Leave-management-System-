import React from "react";
import PageHeader from "../components/PageHeader";
import { Plus, CalendarDays, MoreHorizontal } from "lucide-react";
import { holidays } from "../data/mockData";

export default function PublicHolidays() {
  return (
    <>
      <PageHeader title="Public Holidays" description="Manage public holidays used when calculating working leave days." action={<button className="primary-button"><Plus size={17}/> Add Holiday</button>} />
      <section className="card"><div className="table-wrap"><table><thead><tr><th>Date</th><th>Holiday</th><th>Type</th><th>Year</th><th></th></tr></thead><tbody>{holidays.map(h => <tr key={h.date}><td><div className="date-inline"><CalendarDays size={17}/><strong>{h.date}</strong></div></td><td>{h.name}</td><td>{h.type}</td><td>{h.date.slice(0,4)}</td><td><button className="icon-button"><MoreHorizontal size={19}/></button></td></tr>)}</tbody></table></div></section>
    </>
  );
}
