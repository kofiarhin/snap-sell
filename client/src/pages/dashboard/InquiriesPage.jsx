import { Link } from "react-router-dom";
import { useSellerInquiries } from "../../hooks/queries/useInquiries";
import { useCloseInquiry } from "../../hooks/mutations/useInquiryMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

import { getStatusBadgeClass } from "../../utils/ui";

const InquiriesPage = () => {
  const { data: inquiries, isLoading } = useSellerInquiries();
  const closeMutation = useCloseInquiry();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>

      {!inquiries?.length ? (
        <EmptyState title="No inquiries yet" message="Inquiries from buyers will appear here" />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="ss-card"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{inquiry.buyer?.name}</p>
                  <p className="text-sm ss-muted">{inquiry.buyer?.email}</p>
                </div>
                <span className={getStatusBadgeClass(inquiry.status)}>
                  {inquiry.status}
                </span>
              </div>
              <p className="text-sm ss-muted mb-2">
                Re: <span className="font-medium">{inquiry.product?.title}</span>
              </p>
              <p className="text-sm text-gray-500 line-clamp-2">
                {inquiry.messages?.[inquiry.messages.length - 1]?.text}
              </p>
              <div className="flex gap-3 mt-3">
                <Link
                  to={`/dashboard/inquiries/${inquiry._id}`}
                  className="text-sm text-[var(--ss-brand)] hover:underline"
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
      )}
    </div>
  );
};

export default InquiriesPage;
