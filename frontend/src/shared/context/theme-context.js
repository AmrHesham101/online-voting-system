import React, { useEffect, createContext, useState } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark-theme");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light-theme") {
      setTheme("light-theme");
      const root = window.document.documentElement;
      root.classList.remove("dark-theme");
      root.classList.add("light-theme");
    } else {
      setTheme("dark-theme");
      const root = window.document.documentElement;
      root.classList.remove("light-theme");
      root.classList.add("dark-theme");
    }
  }, []);
  function toggleTheme() {
    if (theme === "dark-theme") {
      setTheme("light-theme");
      localStorage.setItem("theme", "light-theme");
      const root = window.document.documentElement;
      root.classList.remove("dark-theme");
      root.classList.add("light-theme");
    } else {
      setTheme("dark-theme");
      localStorage.setItem("theme", "dark-theme");
      const root = window.document.documentElement;
      root.classList.remove("light-theme");
      root.classList.add("dark-theme");
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
