import React from "react";
import Header from "../components/DashboardComponent/header/header";
import Sidebar from "../components/DashboardComponent/siderbar/sidebar";
import Forecast from "../components/DashboardComponent/Forecast/forecast";
import Recommendations from "../components/DashboardComponent/Recommend/recommend";
const RecommendPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Recommendations />
      </div>
    </div>
  );
};

export default RecommendPage;
