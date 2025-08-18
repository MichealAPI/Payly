import React from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";

export default function TermsPage() {
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
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
        </div>
        <p className="mt-3 text-secondary/80 text-sm">
          By using Payly, you agree to use the service responsibly. Data you choose to share will be processed to provide the app functionality.
        </p>
      </div>
    </main>
    </>
  );
}
