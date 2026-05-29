import { openDB } from "idb";

const DB_NAME = "roadsos-device";
const DB_VERSION = 1;

export async function db() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      database.createObjectStore("offlinePacks");
      database.createObjectStore("medicalProfile");
      database.createObjectStore("syncQueue", { keyPath: "id" });
    }
  });
}

export async function setOfflinePack(key, value) {
  const database = await db();
  await database.put("offlinePacks", { ...value, saved_at: Date.now() }, key);
}

export async function getOfflinePack(keyPrefix = "offline_pack") {
  const database = await db();
  const keys = await database.getAllKeys("offlinePacks");
  const matching = keys.filter((key) => String(key).startsWith(keyPrefix)).sort().at(-1);
  if (!matching) return null;
  const pack = await database.get("offlinePacks", matching);
  if (!pack || Date.now() - pack.saved_at > 24 * 60 * 60 * 1000) return null;
  return pack;
}

export async function saveMedicalProfile(profile) {
  const database = await db();
  await database.put("medicalProfile", profile, "profile");
}

export async function getMedicalProfile() {
  const database = await db();
  return (await database.get("medicalProfile", "profile")) || {};
}

export async function enqueueIncident(report) {
  const database = await db();
  await database.put("syncQueue", { ...report, id: crypto.randomUUID(), queued_at: Date.now(), type: "incident" });
}

export async function flushIncidentQueue(postIncident) {
  const database = await db();
  const reports = await database.getAll("syncQueue");
  const sent = [];
  for (const report of reports.filter((item) => item.type === "incident")) {
    await postIncident(report);
    await database.delete("syncQueue", report.id);
    sent.push(report.id);
  }
  return sent;
}
