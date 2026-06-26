import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { Toaster } from "react-hot-toast";
import ProtectedLayout from "./routes/ProtectedLayout";

import Dashboard from "./screens/Dashboard/Dashboard";
import LoginSign from "./screens/LoginSign/LoginSign";
import MutualFund from "./screens/MutualFund/MutualFundRoutes";

const App = () => {
  return (
    <BrowserRouter>
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
          </Route>
        </Route>

        <Route path="*" element={<LoginSign />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
