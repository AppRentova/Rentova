import Link from "next/link";
import { ArrowRight, CalendarDays, Check, KeyRound, MapPin, ShieldCheck } from "lucide-react";
import { SearchPanel } from "../components/search-panel";
import { VehicleRow } from "../components/vehicle-row";
import { getMessages } from "../lib/i18n";
import { vehicles } from "../lib/vehicles";

export default function HomePage() {
  const messages = getMessages("en");
  return (
    <main>
      <section className="hero-grid">
        <div className="journey-panel">
          <h1>{messages.home.title}</h1>
          <p className="hero-copy">{messages.home.description}</p>
          <SearchPanel />
        </div>
        <div className="inventory-panel">
          <div className="section-heading inverse">
            <div><h2>{messages.home.nearbyTitle}</h2><p>{messages.home.nearbyDescription}</p></div>
            <Link href="/search">View all <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="vehicle-ledger">
            {vehicles.slice(0, 3).map((vehicle, index) => <VehicleRow key={vehicle.id} vehicle={vehicle} priority={index === 0} />)}
          </div>
        </div>
        <div className="search-commitment">
          <strong>Ready when your plans are.</strong>
          <Link className="button button-dark" href="/search">Search cars <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="content-section categories-section">
        <div className="section-heading">
          <div><h2>Whatever moves you.</h2><p>Choose by the trip, not by the badge.</p></div>
          <Link href="/search">Explore inventory <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="category-ledger">
          {["City", "SUV", "Family", "Electric", "Commercial"].map((category, index) => (
            <Link href={`/search?category=${category.toLowerCase()}`} key={category} className="category-entry">
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{category}</strong><small>Illustrative inventory</small><ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="process-section">
        <div><h2>One clear route from search to return.</h2><p>Each step records what matters, so renters and owners always know what happens next.</p></div>
        <ol>
          <li><MapPin /><strong>Choose</strong><span>Set location and time.</span></li>
          <li><ShieldCheck /><strong>Verify</strong><span>Confirm identity and licence.</span></li>
          <li><KeyRound /><strong>Drive</strong><span>Check in with photos.</span></li>
          <li><Check /><strong>Return</strong><span>Record fuel and mileage.</span></li>
        </ol>
      </section>

      <section className="owner-section">
        <div><h2>Your car can work around your calendar.</h2><p>Set availability, approve requests and track earnings from one owner workspace.</p></div>
        <Link className="button button-lime" href="/owner">Open owner workspace <ArrowRight /></Link>
      </section>
    </main>
  );
}
