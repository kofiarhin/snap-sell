import { describe, it, expect, beforeEach, vi } from "vitest";
import uiReducer, { getInitialTheme, setTheme, toggleTheme, THEME } from "./uiSlice";

describe("uiSlice", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets explicit theme", () => {
    const state = uiReducer({ theme: THEME.DARK }, setTheme(THEME.LIGHT));
    expect(state.theme).toBe(THEME.LIGHT);
  });

  it("toggles theme", () => {
    const darkToLight = uiReducer({ theme: THEME.DARK }, toggleTheme());
    const lightToDark = uiReducer({ theme: THEME.LIGHT }, toggleTheme());

    expect(darkToLight.theme).toBe(THEME.LIGHT);
    expect(lightToDark.theme).toBe(THEME.DARK);
  });

  it("reads persisted theme first", () => {
    vi.stubGlobal("window", {
      localStorage: { getItem: () => THEME.LIGHT },
      matchMedia: () => ({ matches: true }),
    });

    expect(getInitialTheme()).toBe(THEME.LIGHT);
  });

  it("falls back to system preference", () => {
    vi.stubGlobal("window", {
      localStorage: { getItem: () => null },
      matchMedia: () => ({ matches: false }),
    });

    expect(getInitialTheme()).toBe(THEME.LIGHT);
  });
});
