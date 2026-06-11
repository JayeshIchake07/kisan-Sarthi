import { useState } from "react";
import StatusBar from "./components/navigation/StatusBar";
import Header from "./components/navigation/Header";
import BottomNav from "./components/navigation/BottomNav";
import SatelliteMapScreen from "./screens/SatelliteMap/SatelliteMapScreen";
import AdvisoryScreen from "./screens/Advisory/AdvisoryScreen";
import FPOScreen from "./screens/FPO/FPOScreen";
import LoanScreen from "./screens/Loan/LoanScreen";
import BenchmarkScreen from "./screens/Benchmark/BenchmarkScreen";
import ClimateScreen from "./screens/Climate/ClimateScreen";
import MarketScreen from "./screens/Market/MarketScreen";

const SCREENS = {
  map: <SatelliteMapScreen />,
  advisory: <AdvisoryScreen />,
  fpo: <FPOScreen />,
  loan: <LoanScreen />,
  benchmark: <BenchmarkScreen />,
  climate: <ClimateScreen />,
  market: <MarketScreen />,
};

export default function OriginalFarmerApp() {
  const [tab, setTab] = useState("map");

  return (
    <div className="app-shell">
      <StatusBar />
      <Header activeTab={tab} />
      <div className="app-content">{SCREENS[tab]}</div>
      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
}
