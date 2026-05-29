import { Siren } from "lucide-react";

export default function SOSButton({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative grid h-48 w-48 place-items-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-900/30 transition active:scale-95"
      aria-label="Activate SOS"
    >
      {active && <span className="absolute inset-0 rounded-full border-8 border-red-500 animate-pulseRing" />}
      <span className="grid place-items-center gap-2">
        <Siren size={54} strokeWidth={2.5} />
        <span className="text-4xl font-black tracking-normal">SOS</span>
      </span>
    </button>
  );
}
