import { QRCodeCanvas } from "qrcode.react";

export default function MedicalQRCode({ profile }) {
  const payload = JSON.stringify({
    blood_type: profile.blood_type,
    allergies: profile.allergies,
    medications: profile.medications,
    conditions: profile.conditions,
    organ_donor: profile.organ_donor,
    contacts: profile.contacts
  });
  return (
    <div className="grid justify-items-center gap-3 rounded-lg border border-orange-200 bg-white p-4">
      <QRCodeCanvas value={payload} size={196} level="M" includeMargin />
      <p className="text-center text-sm font-semibold text-gray-700">Device-only medical QR export</p>
    </div>
  );
}
