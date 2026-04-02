const LoadingSpinner = ({ size = "md" }) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="ss-loading">
      <div className="flex items-center justify-center">
        <div
          className={`animate-spin rounded-full border-2 border-[rgb(255_255_255_/_0.2)] border-t-[var(--ss-brand)] ${sizes[size]}`}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
