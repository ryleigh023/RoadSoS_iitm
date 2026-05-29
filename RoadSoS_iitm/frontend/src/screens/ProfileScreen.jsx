import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import MedicalQRCode from "../components/MedicalQRCode";
import { getMedicalProfile, saveMedicalProfile } from "../utils/storage";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({ blood_type: "", allergies: "", medications: "", conditions: "", organ_donor: false, contacts: ["", ""] });

  useEffect(() => {
    getMedicalProfile().then((saved) => saved && setProfile({ ...profile, ...saved, contacts: saved.contacts || ["", ""] }));
  }, []);

  function updateContact(index, value) {
    const contacts = [...profile.contacts];
    contacts[index] = value;
    setProfile({ ...profile, contacts });
  }

  return (
    <section className="grid gap-4 pb-20 lg:grid-cols-[1fr_280px]">
      <div className="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2">
        {["blood_type", "allergies", "medications", "conditions"].map((field) => (
          <label key={field} className="grid gap-1 text-sm font-bold text-gray-700">
            {field.replace("_", " ")}
            <input value={profile[field]} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} className="rounded-lg border border-orange-200 p-3 font-medium" />
          </label>
        ))}
        <label className="flex items-center gap-2 rounded-lg border border-orange-200 p-3 text-sm font-bold text-gray-700">
          <input type="checkbox" checked={profile.organ_donor} onChange={(event) => setProfile({ ...profile, organ_donor: event.target.checked })} />
          organ donor
        </label>
        {[0, 1].map((index) => (
          <label key={index} className="grid gap-1 text-sm font-bold text-gray-700">
            emergency contact {index + 1}
            <input value={profile.contacts[index]} onChange={(event) => updateContact(index, event.target.value)} className="rounded-lg border border-orange-200 p-3 font-medium" />
          </label>
        ))}
        <button onClick={() => saveMedicalProfile(profile)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-3 font-black text-white md:col-span-2"><Save size={18} /> Save on device</button>
      </div>
      <MedicalQRCode profile={profile} />
    </section>
  );
}
