import React, { useEffect } from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";
import Footer from "../components/ui/Footer/Footer";

export default function PricingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
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
          <h1 className="text-2xl font-semibold">Pricing</h1>
        </div>
        <p className="mt-3 text-secondary/80">Payly is currently free for everyone.</p>
        <div className="mt-8 rounded-2xl border-1 border-secondary/10 bg-primary/40 p-6 shadow-inner shadow-white/5">
          <h2 className="text-lg font-medium">Free</h2>
          <p className="mt-2 text-sm text-secondary/75">Unlimited groups and expenses. No credit card required.</p>
        </div>
      </div>
    </main>

    <Footer />
    </>
  );
}
