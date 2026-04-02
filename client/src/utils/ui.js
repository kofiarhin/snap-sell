export const getStatusBadgeClass = (status = "") => {
  const map = {
    active: "ss-badge-warning",
    sold: "ss-badge-success",
    archived: "ss-badge-neutral",
    inactive: "ss-badge-neutral",
    new: "ss-badge-warning",
    responded: "ss-badge-success",
    closed: "ss-badge-neutral",
    suspended: "ss-badge-danger",
  };

  return map[String(status).toLowerCase()] || "ss-badge-neutral";
};

export const getDashboardNavItemClass = (isActive) =>
  isActive
    ? "bg-[var(--ss-brand)] text-[#090b12]"
    : "text-[var(--ss-muted)] hover:text-white hover:bg-[rgb(255_255_255_/_0.05)]";

export const getButtonVariantClass = (variant = "secondary") => {
  const variants = {
    primary: "ss-btn-primary",
    secondary: "ss-btn-secondary",
    ghost: "ss-btn-ghost",
    danger: "ss-btn-danger",
  };

  return variants[variant] || variants.secondary;
};
