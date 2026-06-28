import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { Toaster } from "react-hot-toast";
import ProtectedLayout from "./routes/ProtectedLayout";
import MobileOnlyLayout from "./components/MobileOnlyLayout/MobileOnlyLayout";

import Dashboard from "./screens/Dashboard/Dashboard";
import LoginSign from "./screens/LoginSign/LoginSign";
import MutualFund from "./screens/MutualFund/MutualFundRoutes";
import FixedDeposit from "./screens/FixedDeposit/FixedDepositRoutes";
import Gold from "./screens/Gold/GoldRoutes";
import RecurringDeposit from "./screens/RecurringDeposit/RecurringDepositRoutes";
import OtherInvestment from "./screens/OtherInvestment/OtherInvestmentRoutes";
import UserProfile from "./screens/UserProfile/UserProfile";
import SIPCalculator from "./screens/Calculators/SIPCalculator/SIPCalculator";
import FDCalculator from "./screens/Calculators/FDCalculator/FDCalculator";
import ReadNews from "./screens/ReadNews/ReadNews"
import NotificationCenter from "./components/NotificationCenter/NotificationCenter"

const App = () => {
  return (
    <BrowserRouter>
      <MobileOnlyLayout>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
        containerStyle={{
          zIndex: 99999999,
        }}
      />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginSign />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mf/*" element={<MutualFund />} />
            <Route path="/fd/*" element={<FixedDeposit />} />
            <Route path="/gold/*" element={<Gold />} />
            <Route path="/rd/*" element={<RecurringDeposit />} />
            <Route path="/other/*" element={<OtherInvestment />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/SIPCalculator" element={<SIPCalculator />} />
            <Route path="/FDCalculator" element={<FDCalculator />} />
            <Route path="/ReadNews" element={<ReadNews />} />
            <Route path="/notifications" element={<NotificationCenter />} />
          </Route>
        </Route>

        <Route path="*" element={<LoginSign />} />
      </Routes>
      </MobileOnlyLayout>
    </BrowserRouter>
  );
};

export default App;
