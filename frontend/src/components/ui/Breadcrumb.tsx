"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-500">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          if (segment === "vehicles") return null;

          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");

          return (
            <li key={index} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="capitalize text-gray-500">{segment}</span>
              ) : (
                <Link
                  href={href}
                  className="text-blue-600 hover:underline capitalize"
                >
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
