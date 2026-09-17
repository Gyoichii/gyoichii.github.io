import Link from "next/link";
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="footer-name">
          Weihan Chen<span className="accent">.</span>
        </Link>
        <p>Gameplay / Software Engineer</p>
      </div>
      <span className="footer-note">
        Atlanta, GA.
        <br />© 2026 Weihan Chen
      </span>
      <a href="#top" className="back-top">
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
