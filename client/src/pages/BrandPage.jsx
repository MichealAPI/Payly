import React from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";
import paylyFull from "../assets/logo/payly-full.png";
import paylyWebBg from "../assets/logo/payly-web-bg.png";
import paylyWebNoBg from "../assets/logo/payly-web-no-bg.png";

export default function BrandPage() {
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3">
          <Logo className="w-8" onClickHomepageNavigate={true} />
          <h1 className="text-2xl font-semibold">Brand</h1>
        </div>
        <p className="mt-3 text-secondary/80">Download logos and view usage guidelines.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-4 shadow-inner shadow-white/5">
            <p className="text-sm font-medium">Full logo</p>
            <img alt="Payly Full Logo" className="mt-3 w-full rounded bg-white p-3" src={paylyFull} />
          </div>
          <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-4 shadow-inner shadow-white/5">
            <p className="text-sm font-medium">Web (bg)</p>
            <img alt="Payly Web Logo (bg)" className="mt-3 w-full rounded bg-white p-3" src={paylyWebBg} />
          </div>
          <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-4 shadow-inner shadow-white/5">
            <p className="text-sm font-medium">Web (no bg)</p>
            <img alt="Payly Web Logo (no bg)" className="mt-3 w-full rounded bg-white p-3" src={paylyWebNoBg} />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-1 border-secondary/10 bg-primary/40 p-6 shadow-inner shadow-white/5">
          <h2 className="text-lg font-medium">Usage</h2>
          <ul className="mt-2 list-disc pl-6 text-sm text-secondary/80 space-y-2">
            <li>Don't alter the logo colors or proportions.</li>
            <li>Maintain clear space around the logo.</li>
            <li>Use high-contrast backgrounds for readability.</li>
          </ul>
        </div>
      </div>
    </main>
    </>
  );
}
