// Optional manual registration hook for environments where auto-inject may not run
export function registerSW() {
  if ('serviceWorker' in navigator) {
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);
  }
}
