import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useInquiry } from "../../hooks/queries/useInquiries";
import { useReplyToInquiry, useCloseInquiry } from "../../hooks/mutations/useInquiryMutations";
import LoadingSpinner from "../../components/LoadingSpinner";

const InquiryDetailPage = () => {
  const { id } = useParams();
  const { data: inquiry, isLoading } = useInquiry(id);
  const replyMutation = useReplyToInquiry();
  const closeMutation = useCloseInquiry();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    replyMutation.mutate(
      { id, text: data.text },
      { onSuccess: () => reset() }
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (!inquiry) return <div className="text-center py-8">Inquiry not found</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inquiry</h1>
          <p className="text-gray-500 mt-1">
            From: {inquiry.buyer?.name} ({inquiry.buyer?.email})
          </p>
          {inquiry.buyer?.phone && (
            <p className="text-gray-500 text-sm">Phone: {inquiry.buyer.phone}</p>
          )}
          {inquiry.offerAmount && (
            <p className="text-sm text-green-600 font-medium mt-1">
              Offer: ${inquiry.offerAmount.toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              inquiry.status === "closed"
                ? "bg-gray-100 text-gray-600"
                : inquiry.status === "responded"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
            }`}
          >
            {inquiry.status}
          </span>
          {inquiry.status !== "closed" && (
            <button
              onClick={() => closeMutation.mutate(id)}
              className="text-sm text-gray-500 hover:underline"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Product info */}
      {inquiry.product && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
          <img
            src={inquiry.product.images?.[0]?.url}
            alt={inquiry.product.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium">{inquiry.product.title}</p>
            <p className="text-sm text-gray-500">${inquiry.product.price?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4 mb-6">
        {inquiry.messages?.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg max-w-[80%] ${
              msg.senderType === "buyer"
                ? "bg-gray-100 mr-auto"
                : "bg-indigo-50 ml-auto"
            }`}
          >
            <p className="text-xs text-gray-500 mb-1 font-medium">
              {msg.senderType === "buyer" ? inquiry.buyer?.name : "You"}
            </p>
            <p className="text-gray-800">{msg.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      {inquiry.status !== "closed" && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input
            {...register("text", { required: true })}
            placeholder="Type your reply..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            disabled={replyMutation.isPending}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {replyMutation.isPending ? "Sending..." : "Reply"}
          </button>
        </form>
      )}
    </div>
  );
};

export default InquiryDetailPage;
