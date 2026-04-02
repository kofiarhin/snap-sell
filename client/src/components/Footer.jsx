const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[rgb(255_255_255_/_0.1)] bg-[rgb(9_11_18_/_0.85)]">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm ss-muted">
        &copy; {new Date().getFullYear()} SnapSell. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
