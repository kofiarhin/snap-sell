export const getThemeOptionClass = (isActive) =>
  `w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
    isActive ? "bg-[var(--ss-brand)] text-[var(--ss-text-inverse)]" : "ss-muted hover:text-[var(--ss-text)] hover:bg-[var(--ss-surface-2)]"
  }`;
