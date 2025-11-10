import dynamic from "next/dynamic";

const LogsPanel = dynamic(() => import("../components/LogsPanel"), {
  ssr: false,
});

export default function LogsPreview() {
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    const key = query.get("key");
    if (key !== "sah2025") {
      return (
        <main className="flex h-screen items-center justify-center text-center bg-gray-50 text-gray-700">
          <div>
            <h1 className="text-2xl font-semibold">🔒 Acesso restrito</h1>
            <p className="mt-2 text-gray-500">
              Adicione <code>?key=sah2025</code> à URL para visualizar.
            </p>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-10 bg-gray-50">
      <LogsPanel />
    </main>
  );
}
