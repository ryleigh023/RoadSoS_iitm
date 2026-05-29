export default function OfflineBanner({ offline, pack }) {
  if (!offline) return null;
  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white">
      Offline — cached data {pack?.services?.length ? `(${pack.services.length} contacts)` : "loading"}
    </div>
  );
}
