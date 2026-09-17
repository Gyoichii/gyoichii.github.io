import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">404</p>
      <h1>Page not found.</h1>
      <p>Return to the homepage to view the projects.</p>
      <Link href="/" className="button button-accent">
        Back to selected work ↗
      </Link>
    </main>
  );
}
