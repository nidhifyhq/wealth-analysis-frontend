import React from "react";
import { Route, Routes } from "react-router-dom";
import GoldDashboard from "./GoldDashboard/GoldDashboard";

const GoldRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GoldDashboard />} />
    </Routes>
  );
};

export default GoldRoutes;
