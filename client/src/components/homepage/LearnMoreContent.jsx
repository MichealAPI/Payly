import React from "react";
import { Button } from "@headlessui/react";
import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer/Footer";

export default function LearnMoreContent() {
  const navigate = useNavigate();

  return (
    <>
      {/* Learn more section */}
      <section
        id="learn-more"
        className="relative overflow-hidden bg-gradient-to-b from-primary to-primary/95 text-secondary"
      >
        {/* Animated purple top shadow */}
        <div className="purple-top-glow" aria-hidden="true" />

        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-32 -top-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border-1 border-secondary/20 px-3 py-1 text-xs uppercase tracking-wider text-secondary/70">
              Split smarter. Stay friends.
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              The easiest way to track and settle shared expenses.
            </h2>
            <p className="mt-3 text-secondary/80 leading-7">
              Built for roommates, trips, and everyday life. Log who paid, split
              however you want, and settle up without awkward conversations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-4.5 py-2 text-md/6.5 font-medium text-primary shadow-inner shadow-white/10 data-hover:opacity-80 transition-opacity"
              >
                Create your first group
              </Button>
              <Button
                onClick={() => navigate("/login?demo=1")}
                className="inline-flex items-center gap-2 rounded-md border-1 border-secondary/40 px-4.5 py-2 text-md/6.5 font-medium text-secondary/90 shadow-inner shadow-white/10 data-hover:opacity-80 transition-opacity"
              >
                Try a demo
              </Button>
            </div>
          </div>

          {/* Feature grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5 shadow-inner shadow-white/5">
              <div className="flex items-center gap-3">
                <ArrowPathRoundedSquareIcon className="h-6 w-6 text-secondary/90" />
                <h3 className="font-medium">Track shared expenses</h3>
              </div>
              <p className="mt-2 text-sm text-secondary/75">
                Log who paid for what and see running totals for every person
                and group.
              </p>
            </div>
            <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5 shadow-inner shadow-white/5">
              <div className="flex items-center gap-3">
                <BoltIcon className="h-6 w-6 text-secondary/90" />
                <h3 className="font-medium">Smart splitting</h3>
              </div>
              <p className="mt-2 text-sm text-secondary/75">
                Split equally or unequally by percentage, shares, exact amounts,
                or custom adjustments.
              </p>
            </div>
            <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5 shadow-inner shadow-white/5">
              <div className="flex items-center gap-3">
                <BanknotesIcon className="h-6 w-6 text-secondary/90" />
                <h3 className="font-medium">Settle up your way</h3>
              </div>
              <p className="mt-2 text-sm text-secondary/75">
                See who owes whom at a glance. Record payments by cash, bank,
                PayPal, Venmo, and more.
              </p>
            </div>
            <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5 shadow-inner shadow-white/5">
              <div className="flex items-center gap-3">
                <DevicePhoneMobileIcon className="h-6 w-6 text-secondary/90" />
                <h3 className="font-medium">Groups & multi‑currency</h3>
              </div>
              <p className="mt-2 text-sm text-secondary/75">
                Organize by household or trip. Convert currencies automatically
                for international travel.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border-1 border-secondary/10 bg-primary/40 p-6 shadow-inner shadow-white/5">
              <h3 className="text-lg font-semibold">How it works</h3>
              <ol className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-xs font-semibold text-secondary/90">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Create a group</p>
                    <p className="text-sm text-secondary/75">
                      Start one for your apartment, trip, or friend circle to
                      keep balances separate and tidy.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-xs font-semibold text-secondary/90">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Add expenses as you go</p>
                    <p className="text-sm text-secondary/75">
                      Log who paid, choose equal or custom splits, and attach
                      notes or receipts.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-xs font-semibold text-secondary/90">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Settle up, stress‑free</p>
                    <p className="text-sm text-secondary/75">
                      See a clear summary of who owes whom and record payments
                      in seconds.
                    </p>
                  </div>
                </li>
              </ol>
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-4.5 py-2 text-md/6.5 font-medium text-primary shadow-inner shadow-white/10 data-hover:opacity-80 transition-opacity"
                >
                  Get started free
                </Button>
                <Button
                  onClick={() => navigate("/features")}
                  className="inline-flex items-center gap-2 rounded-md border-1 border-secondary/40 px-4.5 py-2 text-md/6.5 font-medium text-secondary/90 shadow-inner shadow-white/10 data-hover:opacity-80 transition-opacity"
                >
                  Explore features
                </Button>
              </div>
            </div>

            {/* Trust & Transparency */}
            <div className="rounded-2xl border-1 border-secondary/10 bg-primary/40 p-6 shadow-inner shadow-white/5">
              <h3 className="text-lg font-semibold">Transparent by design</h3>
              <ul className="mt-4 grid grid-cols-2 gap-4 text-sm text-secondary/80">
                <li className="rounded-lg border-1 border-secondary/10 bg-primary/60 p-4">
                  Clear audit history
                </li>
                <li className="rounded-lg border-1 border-secondary/10 bg-primary/60 p-4">
                  Reminders & notifications
                </li>
                <li className="rounded-lg border-1 border-secondary/10 bg-primary/60 p-4">
                  Export CSV/PDF
                </li>
                <li className="rounded-lg border-1 border-secondary/10 bg-primary/60 p-4">
                  Private by default
                </li>
              </ul>
              <p className="mt-4 text-sm text-secondary/70">
                Everyone sees the same math, changes are tracked, and nudges
                keep balances from drifting.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14">
            <h3 className="text-lg font-semibold">Frequently asked questions</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5">
                <p className="font-medium">Do all participants need an account?</p>
                <p className="mt-1 text-sm text-secondary/75">
                  You can add anyone and share a link. They can sign up to view,
                  add expenses, and settle.
                </p>
              </div>
              <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5">
                <p className="font-medium">Can I split unequally?</p>
                <p className="mt-1 text-sm text-secondary/75">
                  Yes—use equal splits, percentages, shares, exact amounts, or
                  custom adjustments.
                </p>
              </div>
              <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5">
                <p className="font-medium">What about different currencies?</p>
                <p className="mt-1 text-sm text-secondary/75">
                  Great for travel. Track in local currencies and let the app
                  convert automatically.
                </p>
              </div>
              <div className="rounded-xl border-1 border-secondary/10 bg-primary/40 p-5">
                <p className="font-medium">How do we settle up?</p>
                <p className="mt-1 text-sm text-secondary/75">
                  Record cash or use your preferred method (e.g., bank, PayPal,
                  Venmo). The math updates instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

  <Footer />
    </>
  );
}
