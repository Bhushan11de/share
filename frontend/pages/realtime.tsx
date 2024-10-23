import React from "react";
import Header from "../components/DashboardComponent/header/header";
import Sidebar from "../components/DashboardComponent/siderbar/sidebar";

import RealTimeData from "../components/DashboardComponent/realtime/realtime";
const RealtimePage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <RealTimeData />
      </div>
    </div>
  );
};

export default RealtimePage;
