import type { Metadata } from "next";
import { SearchWorkspace } from "../../components/search-workspace";
import { vehicles } from "../../lib/vehicles";

export const metadata: Metadata = { title: "Search cars" };

export default function SearchPage() {
  return <main className="search-page"><h1 className="sr-only">Cars available near Kadıköy</h1><SearchWorkspace vehicles={vehicles} /></main>;
}
