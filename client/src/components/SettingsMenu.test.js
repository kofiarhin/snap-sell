import { describe, it, expect } from "vitest";
import { getThemeOptionClass } from "../utils/themeUi";

describe("SettingsMenu", () => {
  it("returns active theme class names", () => {
    expect(getThemeOptionClass(true)).toContain("bg-[var(--ss-brand)]");
  });

  it("returns inactive theme class names", () => {
    const className = getThemeOptionClass(false);
    expect(className).toContain("ss-muted");
    expect(className).toContain("hover:bg-[var(--ss-surface-2)]");
  });
});
