import { useState } from "react";
import { HiCog } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, THEME } from "../features/uiSlice";
import { getThemeOptionClass } from "../utils/themeUi";

const SettingsMenu = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  const updateTheme = (value) => {
    dispatch(setTheme(value));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="ss-btn-ghost"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open settings"
      >
        <HiCog className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 z-40 mt-2 min-w-40 rounded-lg border p-2 shadow-xl"
          style={{ background: "var(--ss-surface)", borderColor: "var(--ss-border)" }}
          role="menu"
          aria-label="Theme settings"
        >
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide ss-muted">Theme</p>
          <div className="space-y-1">
            <button type="button" className={getThemeOptionClass(theme === THEME.LIGHT)} onClick={() => updateTheme(THEME.LIGHT)}>
              Light
            </button>
            <button type="button" className={getThemeOptionClass(theme === THEME.DARK)} onClick={() => updateTheme(THEME.DARK)}>
              Dark
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
