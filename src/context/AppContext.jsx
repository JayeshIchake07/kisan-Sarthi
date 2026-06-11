import { createContext, useContext } from "react";
import { D } from "../data/seedData";

/**
 * @typedef {Object} AppContextValue
 * @property {import("../data/seedData").Plot[]} plots
 * @property {Record<number, import("../data/seedData").HistoryPoint[]>} hist
 * @property {import("../data/seedData").MarketEntry[]} market
 */

/** @type {React.Context<AppContextValue>} */
const AppContext = createContext(null);

/**
 * Provides the global demo dataset to the component tree.
 * In production, this would fetch data from a backend API.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AppProvider({ children }) {
  const value = {
    plots: D.plots,
    hist: D.hist,
    market: D.market,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access the app-level data context.
 * @returns {AppContextValue}
 */
export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppData must be used within <AppProvider>");
  }
  return ctx;
}

export default AppContext;
