import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

function isIOS() {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || window.navigator.vendor || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    const onBIP = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      setShowIOSHelp(false);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
      toast.success('Payly installed');
    };
    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);

    // If on iOS (no beforeinstallprompt), show a small hint
    if (isIOS() && !isStandalone()) {
      const dismissed = sessionStorage.getItem('pwa-ios-dismissed');
      if (!dismissed) {
        setShowIOSHelp(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toast.success('Installation started');
    }
    setDeferredPrompt(null);
    setVisible(false);
  }, [deferredPrompt]);

  if (!visible && !showIOSHelp) return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 60 }}>
      {visible && (
        <div className="rounded-lg shadow-lg bg-sky-600 text-white px-4 py-3 flex items-center gap-3">
          <span className="font-medium">Install Payly?</span>
          <button onClick={handleInstall} className="bg-white/15 hover:bg-white/25 rounded px-3 py-1 text-white">
            Install
          </button>
          <button onClick={() => setVisible(false)} className="bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-white">
            ✕
          </button>
        </div>
      )}
      {showIOSHelp && (
        <div className="rounded-lg shadow-lg bg-zinc-900 text-white px-4 py-3 max-w-xs">
          <div className="font-medium mb-1">Add to Home Screen</div>
          <div className="text-sm opacity-90">Tap the Share icon, then “Add to Home Screen”.</div>
          <div className="mt-2 text-right">
            <button
              className="bg-white/10 hover:bg-white/20 rounded px-2 py-1"
              onClick={() => {
                sessionStorage.setItem('pwa-ios-dismissed', '1');
                setShowIOSHelp(false);
              }}
            >Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
