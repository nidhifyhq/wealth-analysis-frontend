import React from "react";
import { Route, Routes } from "react-router-dom";
import MFDashboard from "./MFDashboard/MFDashboard";


const ManageInvestmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MFDashboard />} />

    </Routes>
  );
};

export default ManageInvestmentRoutes;
