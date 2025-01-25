import Link from "next/link";

export default function Breadcrumb() {
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
