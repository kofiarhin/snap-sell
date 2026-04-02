import { Link } from "react-router-dom";
import { useState } from "react";
import { useSellerInquiries } from "../../hooks/queries/useInquiries";
import { useCloseInquiry } from "../../hooks/mutations/useInquiryMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";

const statusBadge = {
  new: "bg-orange-100 text-orange-700",
  responded: "bg-blue-100 text-blue-700",
  closed: "bg-gray-100 text-gray-700",
};

const InquiriesPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerInquiries({ page, limit: 10 });
  const closeMutation = useCloseInquiry();

  if (isLoading) return <LoadingSpinner />;

  const inquiries = data?.inquiries || [];
  const pagination = data?.pagination;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>

      {!inquiries?.length ? (
        <EmptyState title="No inquiries yet" message="Inquiries from buyers will appear here" />
      ) : (
        <>
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry._id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{inquiry.buyer?.name}</p>
                    <p className="text-sm text-gray-500">{inquiry.buyer?.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge[inquiry.status]}`}>
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Re: <span className="font-medium">{inquiry.product?.title}</span>
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {inquiry.messages?.[inquiry.messages.length - 1]?.text}
                </p>
                <div className="flex gap-3 mt-3">
                  <Link
                    to={`/dashboard/inquiries/${inquiry._id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View Thread
                  </Link>
                  {inquiry.status !== "closed" && (
                    <button
                      onClick={() => closeMutation.mutate(inquiry._id)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default InquiriesPage;
