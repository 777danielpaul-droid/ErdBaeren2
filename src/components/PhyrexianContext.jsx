import { createContext, useContext, useState, useEffect } from "react";
import { getInitialPhyrexian, applyPhyrexian, togglePhyrexian } from "../lib/phyrexian";

const PhyrexianContext = createContext({ on: false, toggle: () => {} });

export function PhyrexianProvider({ children }) {
  const [on, setOn] = useState(() => getInitialPhyrexian() === "on");
  // DOM-Attribut setzen (für CSS-Regeln) + initial am Mount.
  useEffect(() => {
    applyPhyrexian(on ? "on" : "off");
  }, [on]);
  const toggle = () => setOn(togglePhyrexian() === "on");
  return (
    <PhyrexianContext.Provider value={{ on, toggle }}>
      {children}
    </PhyrexianContext.Provider>
  );
}

export function usePhyrexian() {
  return useContext(PhyrexianContext);
}
