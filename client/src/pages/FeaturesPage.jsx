import React, { useEffect } from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  UsersIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";
import heroImg from "../assets/features-sharing-hero.jpg";
import { motion } from "framer-motion";
import Footer from "../components/ui/Footer/Footer";

export default function FeaturesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className=" border-secondary/10 bg-primary/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-md hover:opacity-80 border-1 cursor-pointer border-secondary/30 bg-primary/50 px-3 py-1.5 text-sm text-secondary/90 hover:bg-primary/70 transition"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-primary text-secondary">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero */}
          <motion.section
            className="relative rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl bg-center bg-cover bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 text-white"
            style={{ backgroundImage: `url(${heroImg})`}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* stronger overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="relative z-10 px-6 py-20 md:py-28 lg:py-32">
              {/* translucent panel behind text for extra legibility */}
              <div className="max-w-3xl bg-black/30 backdrop-blur-md rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-white/10 p-2">
                    <Logo className="w-10" />
                  </div>
                  <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium">What’s inside</span>
                </div>

                <h1
                  className="text-4xl md:text-5xl font-extrabold leading-tight"
                  style={{ textShadow: '0 6px 18px rgba(0,0,0,0.65)' }}
                >
                  Powerful features for effortless split payments
                </h1>
                <p className="mt-4 text-lg text-white/90" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                  Track shared expenses, split fairly, and settle up with confidence — beautifully and intuitively.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-indigo-700 px-5 py-2.5 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
                  >
                    Get started — it's free
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm hover:bg-white/15 transition"
                  >
                    Compare plans
                  </button>
                </div>
              </div>
             </div>
            {/* decorative SVG */}
            <svg className="absolute right-0 bottom-0 w-64 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#g)" d="M43.6,-54.7C57.9,-45.6,72,-36,76.7,-23.4C81.3,-10.9,76.5,4.5,68.6,18.4C60.8,32.3,49.8,44.7,36.8,52.9C23.8,61.2,8.8,65.3,-6.6,69.1C-22.1,72.9,-38.8,76.4,-50.1,69.1C-61.5,61.8,-67.6,43.6,-73.9,25.3C-80.3,7,-86.8,-11.4,-83.6,-26.9C-80.4,-42.3,-67.5,-54,-52.5,-61.5C-37.5,-69.1,-18.8,-72.4,-1,-71.2C16.8,-70,33.6,-64.3,43.6,-54.7Z" transform="translate(100 100)" />
            </svg>
          </motion.section>

          {/* Features grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.article whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="group rounded-2xl bg-white/5 p-6 backdrop-blur border border-white/6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/6 text-white">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold">Smart splitting</h3>
              <p className="mt-2 text-sm text-secondary/70">Split equally, by percentages, shares, or exact amounts. Add custom adjustments for edge cases.</p>
            </motion.article>

            <motion.article whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="group rounded-2xl bg-white/5 p-6 backdrop-blur border border-white/6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/6 text-white">
                <UsersIcon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold">Groups & multi-currency</h3>
              <p className="mt-2 text-sm text-secondary/70">Keep trips and households separate. Convert currencies automatically when needed.</p>
            </motion.article>

            <motion.article whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="group rounded-2xl bg-white/5 p-6 backdrop-blur border border-white/6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/6 text-white">
                <ReceiptPercentIcon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold">Receipts & notes</h3>
              <p className="mt-2 text-sm text-secondary/70">Attach receipts and add notes so everyone sees the context.</p>
            </motion.article>

            <motion.article whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} className="group rounded-2xl bg-white/5 p-6 backdrop-blur border border-white/6 shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/6 text-white">
                <BanknotesIcon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-semibold">Clear settlements</h3>
              <p className="mt-2 text-sm text-secondary/70">See who owes whom at a glance and record payments via cash or preferred methods.</p>
            </motion.article>
          </div>

          {/* Additional blurb */}
          <div className="mt-10 rounded-lg bg-primary/30 border border-secondary/10 p-6">
            <h4 className="font-semibold">Built for real people</h4>
            <p className="mt-2 text-sm text-secondary/75">Payly focuses on clarity: fewer disputes, faster settlements, and less mental overhead. Works great for roommates, trips, and group gifts.</p>
          </div>
        </div>
  </main>
  <Footer />
    </>
  );
}
