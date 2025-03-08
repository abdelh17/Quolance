function FooterOne() {
  return (
    <footer className="bg-n900 text-white">
      <div className="container flex items-center justify-between gap-6 py-8 font-medium max-md:flex-col">
        <p data-test="footer">Copyright @ {new Date().getFullYear()} Quolance</p>
      </div>
    </footer>
  );
}

export default FooterOne;
