import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar/BottomBar";

const ProtectedLayout = () => {
  const { pathname } = useLocation();

  return (
    <div style={{ paddingBottom: 80 }}>
      <Outlet />
      <BottomBar />
    </div>
  );
};

export default ProtectedLayout;
