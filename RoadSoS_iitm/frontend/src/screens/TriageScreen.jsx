import { Send } from "lucide-react";
import { useState } from "react";
import { triage } from "../api/client";
import { getMedicalProfile } from "../utils/storage";

const chips = ["Car hit bike, bleeding", "Unconscious person", "Chest pain after crash", "Fuel leak, trapped victim"];

export default function TriageScreen({ setSos }) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function ask(text = message) {
    const profile = await getMedicalProfile();
    const result = await triage(text, profile);
    setReply(result.text);
    setSos((current) => ({ ...current, severity: result.severity || current.severity }));
  }

  return (
    <section className="grid gap-4 pb-20">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-lg font-black">AI Triage</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => <button key={chip} onClick={() => { setMessage(chip); ask(chip); }} className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-bold text-orange-900">{chip}</button>)}
        </div>
        <div className="mt-4 flex gap-2">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-28 flex-1 rounded-lg border border-orange-200 p-3" placeholder="Describe injuries, vehicles, hazards, consciousness, bleeding" />
          <button onClick={() => ask()} className="grid h-12 w-12 place-items-center rounded-lg bg-red-600 text-white" aria-label="Send triage"><Send size={20} /></button>
        </div>
      </div>
      {reply && <pre className="whitespace-pre-wrap rounded-lg bg-gray-950 p-4 text-sm font-semibold text-white">{reply}</pre>}
    </section>
  );
}
