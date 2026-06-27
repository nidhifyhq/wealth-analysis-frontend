import React from "react";
import { Route, Routes } from "react-router-dom";
import FixedDeposit from "./FixedDeposit";

const FixedDepositRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FixedDeposit />} />
    </Routes>
  );
};

export default FixedDepositRoutes;
