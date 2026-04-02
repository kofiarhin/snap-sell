import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("snapsell-theme", theme);
  }, [theme]);

  return children;
};

export default ThemeProvider;
