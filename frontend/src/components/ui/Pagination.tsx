import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex justify-between items-center mt-6">
      {currentPage > 1 ? (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Previous
        </Link>
      ) : (
        <button
          className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed"
          disabled
        >
          Previous
        </button>
      )}

      <span>
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Next
        </Link>
      ) : (
        <button
          className="px-4 py-2 rounded bg-gray-300 cursor-not-allowed"
          disabled
        >
          Next
        </button>
      )}
    </div>
  );
}
