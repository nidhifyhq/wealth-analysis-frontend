import React from "react";
import { Route, Routes } from "react-router-dom";
import RecurringDeposit from "./RecurringDeposit";

const RecurringDepositRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecurringDeposit />} />
    </Routes>
  );
};

export default RecurringDepositRoutes;
