const EmptyState = ({ title = "Nothing here yet", message, action }) => {
  return (
    <div className="text-center py-16">
      <p className="text-gray-400 text-lg font-medium">{title}</p>
      {message && <p className="text-gray-400 mt-2">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
