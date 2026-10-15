import { CalendarDays, Clock3, MapPin } from "lucide-react";
export function SearchPanel() { return <form className="search-panel" action="/search">
  <label><span><MapPin />Pick-up location</span><input name="location" defaultValue="Kadıköy, Istanbul" aria-label="Pick-up location" /></label>
  <div className="field-row"><label><span><CalendarDays />Pick-up</span><input name="pickupDate" type="date" defaultValue="2026-10-18" /></label><label><span><Clock3 />Time</span><input name="pickupTime" type="time" defaultValue="10:00" /></label></div>
  <div className="field-row"><label><span><CalendarDays />Return</span><input name="returnDate" type="date" defaultValue="2026-10-20" /></label><label><span><Clock3 />Time</span><input name="returnTime" type="time" defaultValue="10:00" /></label></div>
  <button className="button button-lime mobile-search-action" type="submit">Find available cars</button>
</form> }
