import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm text-gray-600 px-4">
        Page {page} of {pages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
