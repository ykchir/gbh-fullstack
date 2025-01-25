import Link from "next/link";
import "./globals.css"; // Importation des styles globaux (Tailwind)
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vehicle Showcase",
  description: "Explore a collection of vehicles with filters and details.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-white shadow p-4">
      <nav className="container mx-auto">
        <Breadcrumb />
      </nav>
    </header>
  );
}

function Breadcrumb() {
  return (
    <div className="text-sm text-gray-500">
      <Link href="/" className="text-blue-600 hover:underline">
        Home
      </Link>
      <span className="mx-2">/</span>
      <span>Current Page</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} Vehicle Showcase. All rights reserved.
      </div>
    </footer>
  );
}
