import { Activity, ClipboardPlus, Home, Map, MessageCircle, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import OfflineBanner from "./components/OfflineBanner";
import { useLocation } from "./hooks/useLocation";
import { useOffline } from "./hooks/useOffline";
import { useOfflinePack } from "./hooks/useOfflinePack";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ReportScreen from "./screens/ReportScreen";
import ServicesScreen from "./screens/ServicesScreen";
import { submitIncident } from "./api/client";
import { flushIncidentQueue } from "./utils/storage";
import TriageScreen from "./screens/TriageScreen";

const tabs = [
  ["home", Home, "Home"],
  ["services", Activity, "Services"],
  ["map", Map, "Map"],
  ["triage", MessageCircle, "Triage"],
  ["report", ClipboardPlus, "Report"],
  ["profile", UserRound, "Profile"]
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [sos, setSos] = useState({ active: false, startedAt: null, severity: "HIGH" });
  const { location, status } = useLocation();
  const offline = useOffline();
  const pack = useOfflinePack(location);
  const shared = { location, locationStatus: status, sos, setSos, offline, pack, setTab };

  useEffect(() => {
    if (!offline) flushIncidentQueue(submitIncident).catch(() => null);
  }, [offline]);

  return (
    <div className="min-h-screen bg-orange-50">
      <OfflineBanner offline={offline} pack={pack} />
      <header className="border-b border-orange-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-950">RoadSoS</h1>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Golden Hour emergency response</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">{status === "ready" ? "GPS locked" : "GPS fallback"}</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5">
        {tab === "home" && <HomeScreen {...shared} />}
        {tab === "services" && <ServicesScreen {...shared} />}
        {tab === "map" && <MapScreen {...shared} />}
        {tab === "triage" && <TriageScreen {...shared} />}
        {tab === "report" && <ReportScreen {...shared} />}
        {tab === "profile" && <ProfileScreen {...shared} />}
      </main>
      <nav className="fixed inset-x-0 bottom-0 border-t border-orange-200 bg-white/95 px-2 py-2 backdrop-blur md:static md:border-t-0 md:bg-transparent">
        <div className="mx-auto grid max-w-3xl grid-cols-6 gap-1">
          {tabs.map(([id, Icon, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`grid place-items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold ${tab === id ? "bg-red-600 text-white" : "text-gray-600"}`}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
