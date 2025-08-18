import React from "react";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-primary text-secondary border-t border-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo className="w-9" onClickHomepageNavigate={true} />
            <p className="mt-3 text-sm text-secondary/75">
              Split expenses fairly, stay organized, and settle up without the
              spreadsheets.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border-1 border-secondary/20 px-3 py-2">
              <span className="text-sm text-secondary/70">Theme</span>
              <ArrowPathRoundedSquareIcon className="w-4 text-secondary/60" />
              <ThemeSwitcher className="border-1 border-secondary/20 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-secondary/80">
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/features")}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/pricing")}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/download")}
                  >
                    Mobile apps
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Resources</h4>
              <ul className="mt-3 space-y-2 text-sm text-secondary/80">
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/help")}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/blog")}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/changelog")}
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-secondary/80">
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/terms")}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/privacy")}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => navigate("/cookies")}
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-secondary/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-secondary/60">
            © {new Date().getFullYear()} Payly. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-secondary/70">
            <a
              className="cursor-pointer hover:opacity-80"
              onClick={() => navigate("/status")}
            >
              Status
            </a>
            <a
              className="cursor-pointer hover:opacity-80"
              onClick={() => navigate("/security")}
            >
              Security
            </a>
            <a
              className="cursor-pointer hover:opacity-80"
              onClick={() => navigate("/brand")}
            >
              Brand
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
