const EmptyState = ({ title = "Nothing here yet", message, action }) => {
  return (
    <div className="ss-empty">
      <p className="text-lg font-semibold text-white">{title}</p>
      {message && <p className="ss-muted mt-2">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
