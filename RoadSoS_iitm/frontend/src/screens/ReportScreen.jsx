import { Camera, Send } from "lucide-react";
import { useState } from "react";
import { submitIncident } from "../api/client";

export default function ReportScreen({ location }) {
  const [form, setForm] = useState({ accident_type: "collision", vehicles: "2", injuries: "unknown", road_conditions: "unknown", severity: "HIGH", description: "" });
  const [photo, setPhoto] = useState("");
  const [result, setResult] = useState("");

  async function submit(event) {
    event.preventDefault();
    const response = await submitIncident({ ...form, lat: location.latitude, lng: location.longitude, photo });
    setResult(response.queued ? "Offline report queued for sync" : `Incident created: ${response.incident_id}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 pb-20">
      <div className="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2">
        {["accident_type", "vehicles", "injuries", "road_conditions"].map((field) => (
          <label key={field} className="grid gap-1 text-sm font-bold text-gray-700">
            {field.replace("_", " ")}
            <input value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded-lg border border-orange-200 p-3 font-medium" />
          </label>
        ))}
        <label className="grid gap-1 text-sm font-bold text-gray-700">
          severity
          <select value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })} className="rounded-lg border border-orange-200 p-3 font-medium">
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((severity) => <option key={severity}>{severity}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold text-gray-700">
          photo
          <span className="flex items-center gap-2 rounded-lg border border-orange-200 p-3">
            <Camera size={18} />
            <input type="file" accept="image/*" capture="environment" onChange={(event) => setPhoto(event.target.files?.[0]?.name || "")} />
          </span>
        </label>
        <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-32 rounded-lg border border-orange-200 p-3 md:col-span-2" placeholder="Scene description, landmarks, hazards" />
      </div>
      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-black text-white"><Send size={18} /> Submit report</button>
      {result && <p className="rounded-lg bg-green-100 p-3 text-sm font-bold text-green-800">{result}</p>}
    </form>
  );
}
