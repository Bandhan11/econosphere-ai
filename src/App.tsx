import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { SearchModal } from "./components/common/SearchModal";

// Views
import { HomeView } from "./components/views/HomeView";
import { LearnView } from "./components/views/LearnView";
import { SimulateView } from "./components/views/SimulateView";
import { MarketsView } from "./components/views/MarketsView";
import { EconomyView } from "./components/views/EconomyView";
import { CompaniesView } from "./components/views/CompaniesView";
import { ResearchView } from "./components/views/ResearchView";
import { CaseStudiesView } from "./components/views/CaseStudiesView";
import { ForecastView } from "./components/views/ForecastView";
import { DashboardView } from "./components/views/DashboardView";
import { AIEconomistView } from "./components/views/AIEconomistView";
import { CollaborateView } from "./components/views/CollaborateView";
import { DataExplorerView } from "./components/views/DataExplorerView";
import { NewsEventsView } from "./components/views/NewsEventsView";
import { ChallengesView } from "./components/views/ChallengesView";
import { ProfileView } from "./components/views/ProfileView";

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 overflow-y-auto bg-[#0E0F12] text-[#F3F2EE]">
      {activeTab === "home" && <HomeView />}
      {activeTab === "learn" && <LearnView />}
      {activeTab === "simulate" && <SimulateView />}
      {activeTab === "markets" && <MarketsView />}
      {activeTab === "economy" && <EconomyView />}
      {activeTab === "companies" && <CompaniesView />}
      {activeTab === "research" && <ResearchView />}
      {activeTab === "caseStudies" && <CaseStudiesView />}
      {activeTab === "forecast" && <ForecastView />}
      {activeTab === "dashboard" && <DashboardView />}
      {activeTab === "aiEconomist" && <AIEconomistView />}
      {activeTab === "collaborate" && <CollaborateView />}
      {activeTab === "dataExplorer" && <DataExplorerView />}
      {activeTab === "newsEvents" && <NewsEventsView />}
      {activeTab === "challenges" && <ChallengesView />}
      {activeTab === "profile" && <ProfileView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0D0E10] text-[#F3F2EE] flex flex-col antialiased selection:bg-red-600 selection:text-white">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Navigation />
          <MainContent />
        </div>
        <SearchModal />
      </div>
    </AppProvider>
  );
}
