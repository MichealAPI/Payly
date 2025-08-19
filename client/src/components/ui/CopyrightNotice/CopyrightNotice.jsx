

const CopyrightNotice = () => (
  <p
    className="absolute bottom-5 text-sm opacity-70 text-secondary"
    aria-label="Made with love in Italy"
  >
    Made with <span aria-hidden="true">❤️</span> in Italy - © {new Date().getFullYear()} Payly
  </p>
);

export default CopyrightNotice;