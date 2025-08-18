import React, { useEffect } from "react";
import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import {
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  CloudArrowDownIcon,
  SparklesIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo/Logo";
import Footer from "../components/ui/Footer/Footer";
import pwaPreview from "../assets/pwa-preview.jpg";

export default function DownloadPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // consistent badge size + centering for numbered chips
  const badgeBase = "flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md text-white font-bold";

  return (
    <>
      <div className="sticky top-0 z-20 border-b border-secondary/10 bg-gradient-to-r from-primary/40 via-primary/30 to-primary/20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center cursor-pointer hover:opacity-80 gap-2 rounded-md border-1 border-secondary/30 bg-primary/50 px-3 py-1.5 text-sm text-secondary/90 hover:bg-primary/70 transition"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Logo className="w-8" onClickHomepageNavigate={true} />
            <div className="text-sm text-secondary/80">
              Install Payly — fast, offline-ready
            </div>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-primary text-secondary">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <header className="rounded-2xl bg-gradient-to-br from-primary/6 via-primary/3 to-primary/2 p-8 ring-1 ring-secondary/8 shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-2">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold">
                    Install Payly — quick PWA setup
                  </h1>
                </div>
                <p className="text-secondary/80 max-w-xl">
                  Native apps are on the roadmap. Meanwhile, install Payly as a
                  Progressive Web App for native-like speed, offline access and
                  home-screen convenience.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="#pwa-steps"
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-white font-medium shadow hover:scale-[1.02] transition"
                  >
                    <CloudArrowDownIcon className="h-5 w-5" />
                    Install (3 steps)
                  </a>

                  <a
                    href="#tips"
                    className="inline-flex items-center gap-2 rounded-md border border-secondary/10 bg-primary/50 px-4 py-2 text-sm text-secondary/90 hover:bg-primary/60 transition"
                  >
                    Tips & troubleshooting
                  </a>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-secondary/80">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-secondary/8">
                    <span className={`${badgeBase} bg-indigo-600`}>1</span>
                    <div>
                      <div className="font-semibold">Fast</div>
                      <div className="text-xs">
                        Loads instantly, caches data for offline use
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-secondary/8">
                    <span className={`${badgeBase} bg-cyan-500`}>2</span>
                    <div>
                      <div className="font-semibold">Secure</div>
                      <div className="text-xs">
                        Served over HTTPS, sandboxed like native apps
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-secondary/8">
                    <span className={`${badgeBase} bg-emerald-500`}>3</span>
                    <div>
                      <div className="font-semibold">Integrated</div>
                      <div className="text-xs">
                        Home screen icon, app-like UX and permissions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 flex-shrink-0">
                <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-secondary/8 bg-gradient-to-br from-white/5 to-white/2 p-2">
                  <img
                    src={pwaPreview}
                    alt="Payly PWA preview"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </header>

          <section id="pwa-steps" className="mt-10">
            <div className="rounded-lg bg-primary/5 p-6 border border-secondary/10 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <DevicePhoneMobileIcon className="h-5 w-5 text-secondary/90" />
                Install in 3 steps (PWA)
              </h2>

              <ol className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <li className="p-4 rounded-lg bg-gradient-to-b from-primary/3 to-primary/2 border border-secondary/8 hover:scale-[1.02] transition transform">
                  <div className="flex items-center gap-3">
                    <div className={`${badgeBase} bg-indigo-600`}>1</div>
                    <div>
                      <div className="font-semibold">
                        Open Payly in your mobile browser
                      </div>
                      <div className="mt-1 text-sm text-secondary/70">
                        Use Chrome/Edge on Android, or Safari on iOS.
                      </div>
                    </div>
                  </div>
                </li>

                <li className="p-4 rounded-lg bg-gradient-to-b from-primary/3 to-primary/2 border border-secondary/8 hover:scale-[1.02] transition transform">
                  <div className="flex items-center gap-3">
                    <div className={`${badgeBase} bg-cyan-500`}>2</div>
                    <div>
                      <div className="font-semibold">
                        Choose "Add to Home screen"
                      </div>
                      <div className="mt-1 text-sm text-secondary/70">
                        Chrome/Edge: menu (⋮) → "Add to Home screen". Safari:
                        Share → "Add to Home Screen".
                      </div>
                    </div>
                  </div>
                </li>

                <li className="p-4 rounded-lg bg-gradient-to-b from-primary/3 to-primary/2 border border-secondary/8 hover:scale-[1.02] transition transform">
                  <div className="flex items-center gap-3">
                    <div className={`${badgeBase} bg-emerald-500`}>3</div>
                    <div>
                      <div className="font-semibold">
                        Open Payly from your home screen
                      </div>
                      <div className="mt-1 text-sm text-secondary/70">
                        Launch like a native app. Grant optional permissions for
                        best experience.
                      </div>
                    </div>
                  </div>
                </li>
              </ol>

              <div
                id="tips"
                className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <p className="text-sm text-secondary/60">
                  Tip: Android Chrome may show an "Install" prompt in the
                  address bar — tap it to install directly.
                </p>
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary/60 px-3 py-1.5 text-sm text-white hover:opacity-80 transition"
                  >
                    Back to top
                  </button>
                  <button
                    onClick={() => navigate("/help")}
                    className="inline-flex items-center gap-2 rounded-md hover:opacity-80 cursor-pointer border border-secondary/10 bg-primary/50 px-3 py-1.5 text-sm text-secondary/90 hover:bg-primary/60 transition"
                  >
                    Troubleshoot
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
