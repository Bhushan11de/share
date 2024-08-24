import React from "react";
import Header from "../components/DashboardComponent/header";
import Sidebar from "../components/DashboardComponent/sidebar";
const DashboardPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}></div>
      <Sidebar />
    </div>
  );
};

export default DashboardPage;
