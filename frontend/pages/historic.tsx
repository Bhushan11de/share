import React from "react";
import Header from "../components/DashboardComponent/header/header";
import Sidebar from "../components/DashboardComponent/siderbar/sidebar";
import HistoricData from "../components/DashboardComponent/historic/historic";

const HistoricPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <HistoricData />
      </div>
    </div>
  );
};

export default HistoricPage;
