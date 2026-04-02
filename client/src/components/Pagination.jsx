import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="ss-btn-secondary !p-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm ss-chip ss-chip-active">Page {page} of {pages}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="ss-btn-secondary !p-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
