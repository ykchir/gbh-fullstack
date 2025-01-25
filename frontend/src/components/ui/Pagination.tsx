export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex justify-between items-center mt-6">
      <a
        href={`/?page=${currentPage - 1}`}
        className={`px-4 py-2 rounded ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </a>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <a
        href={`/?page=${currentPage + 1}`}
        className={`px-4 py-2 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </a>
    </div>
  );
}
