import { createContext, useContext, useState, useEffect } from "react";
import { getInitialLang, applyLang, cycleLang } from "../lib/phyrexian";

const LangContext = createContext({ mode: "de", cycle: () => {} });

export function LangProvider({ children }) {
  const [mode, setMode] = useState(() => getInitialLang());
  // DOM-Attribut setzen (für CSS-Regeln) + initial am Mount.
  useEffect(() => {
    applyLang(mode);
  }, [mode]);
  const cycle = () => setMode(cycleLang());
  return (
    <LangContext.Provider value={{ mode, cycle }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
