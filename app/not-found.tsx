import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">404 / OUTSIDE THE MAP</p>
      <h1>This page wandered off.</h1>
      <p>The work is still here. Let’s get you back to it.</p>
      <Link href="/" className="button button-accent">
        Back to selected work ↗
      </Link>
    </main>
  );
}
