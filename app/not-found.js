import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main className="notfound">
      <div>
        <h1>404</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="btn btn-primary">Go to Home</Link>
      </div>
    </main>
  );
}
