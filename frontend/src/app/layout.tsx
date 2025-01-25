import { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white py-4">
          <nav className="container mx-auto px-4">
            <Breadcrumb />
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="bg-gray-900 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            © {new Date().getFullYear()} Vehicle Showcase. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

// Breadcrumb Component
function Breadcrumb() {
  return (
    <ul className="flex space-x-2 text-sm">
      <li>
        <Link href="/" className="text-blue-400 hover:underline">
          Home
        </Link>
      </li>
      <li>/</li>
      <li>Vehicles</li>
    </ul>
  );
}
