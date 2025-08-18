import React from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";

export default function SecurityPage() {
  const navigate = useNavigate();
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3">
          <Logo className="w-8" onClickHomepageNavigate={true} />
          <h1 className="text-2xl font-semibold">Security</h1>
        </div>
        <div className="mt-4 space-y-4 text-sm text-secondary/80">
          <p>We prioritize account safety and data protection.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Passwords are never stored in plain text.</li>
            <li>Transport Layer Security (HTTPS) for all traffic.</li>
            <li>Access controls isolate your data within your account.</li>
          </ul>
          <p>
            If you believe you've found a security issue, contact security@payly.app.
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
