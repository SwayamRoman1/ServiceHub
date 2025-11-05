import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const ThemeContext = createContext();

const applyTheme = (mode) => {
  const root = document.documentElement;
  const body = document.body;

  root.setAttribute("data-theme", mode);
  body.setAttribute("data-theme", mode);

  // Mobile browser address-bar color
  const meta =
    document.querySelector('meta[name="theme-color"]') ||
    (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "theme-color");
      document.head.appendChild(m);
      return m;
    })();
  meta.setAttribute("content", mode === "dark" ? "#0b0f14" : "#ffffff");
};

export const ThemeProvider = ({ children }) => {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  const [stored, setStored] = useState(() => localStorage.getItem("theme")); // "light" | "dark" | null
  const effective = useMemo(
    () => stored || (prefersDark ? "dark" : "light"),
    [stored, prefersDark]
  );

  useEffect(() => {
    applyTheme(effective);
  }, [effective]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!stored) applyTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [stored]);

  const toggleTheme = () => {
    const next = effective === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    setStored(next);
  };

  const clearToSystem = () => {
    localStorage.removeItem("theme");
    setStored(null);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: effective, toggleTheme, clearToSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
