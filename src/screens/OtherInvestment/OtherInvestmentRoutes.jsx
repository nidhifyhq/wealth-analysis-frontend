import React from "react";
import { Route, Routes } from "react-router-dom";
import OtherInvestmentDashboard from "./OtherInvestment";

const OtherInvestmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OtherInvestmentDashboard />} />
    </Routes>
  );
};

export default OtherInvestmentRoutes;
