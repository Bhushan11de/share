import React from "react";
import Header from "../components/DashboardComponent/header/header";
import Sidebar from "../components/DashboardComponent/siderbar/sidebar";
import Portfolio from "../components/DashboardComponent/Portfolio/portfolio";
const DashboardPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Portfolio />
      </div>
    </div>
  );
};

export default DashboardPage;
