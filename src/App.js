import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { Toaster, toast } from "react-hot-toast";
import ProtectedLayout from "./routes/ProtectedLayout";
import MobileOnlyLayout from "./components/MobileOnlyLayout/MobileOnlyLayout";
import { onForegroundMessage } from "./services/fcm";

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
import Assistant from "./screens/AiAssistant/Assistant";
import PinLock from "./screens/LoginSign/PinLock/PinLock";
import AdminAction from "./screens/AdminAction/AdminAction";
import AdminNotification from "./screens/AdminAction/AdminNotification/AdminNotification";
import DailyNAVUpdat from "./screens/AdminAction/DailyNAVUpdate/DailyNAVUpdat";
import AllUsers from "./screens/AdminAction/AllUsers/AllUsers";

const App = () => {
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      toast(body || title || "New notification", { duration: 5000 });
    });
    return () => unsubscribe();
  }, []);

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
        <Route path="/PinLock" element={<PinLock />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginSign />} />
           <Route path="*" element={<LoginSign />} />
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
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/admin" element={<AdminAction />} />
            <Route path="/admin/notifications" element={<AdminNotification />} />
            <Route path="/admin/daily-nav" element={<DailyNAVUpdat />} />
            <Route path="/admin/users" element={<AllUsers />} />
          </Route>
        </Route>

        {/* <Route path="*" element={<LoginSign />} /> */}
      </Routes>
      </MobileOnlyLayout>
    </BrowserRouter>
  );
};

export default App;
