import React, { useEffect, useState } from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";

export default function StatusPage() {
  const [status, setStatus] = useState("operational");
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  // Placeholder for future real status checks/pings
  useEffect(() => {
    setDetails({ api: "operational", database: "operational", web: "operational" });
  }, []);

  const statusColor = status === "operational" ? "text-green-400" : status === "degraded" ? "text-yellow-400" : "text-red-400";

  return (
    <>
      <HomeNavbar />
      <div className="border-b border-secondary/10 bg-primary/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border-1 border-secondary/30 bg-primary/50 px-3 py-1.5 text-sm text-secondary/90 hover:bg-primary/70 transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
      <main className="min-h-screen bg-primary text-secondary">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3">
          <Logo className="w-8" onClickHomepageNavigate={true} />
          <h1 className="text-2xl font-semibold">Status</h1>
        </div>
        <p className={`mt-3 ${statusColor}`}>Current status: {status}</p>
        {details && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {Object.entries(details).map(([k, v]) => (
              <div key={k} className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-4 shadow-inner shadow-white/5">
                <p className="text-sm font-medium capitalize">{k}</p>
                <p className="mt-1 text-xs text-secondary/75">{v}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
    </>
  );
}
