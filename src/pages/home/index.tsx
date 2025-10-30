import OverviewSection from "./OverviewSection";
import ThematicMapSection from "./ThematicMapSection";
import MarketTrendsSection from "./MarketTrendsSection";
import InsightsSection from "./InsightsSection";
// import AppDownloadSection from "./AppDownloadSection";
import GisSection from "./GisSection";

const Home = () => {
  return (
    <div className="flex w-full flex-col">
      <OverviewSection />
      <InsightsSection />
      <ThematicMapSection />
      <MarketTrendsSection />
      {/* <AppDownloadSection /> */}
      <GisSection />
    </div>
  );
};

export default Home;
