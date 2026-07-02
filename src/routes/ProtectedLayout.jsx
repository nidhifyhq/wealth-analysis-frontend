import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar/BottomBar";

const ProtectedLayout = () => {
  const { pathname } = useLocation();
  const hideBottomBar = pathname === "/assistant";

  return (
    <div style={{ paddingBottom: hideBottomBar ? 0 : 80 }}>
      <Outlet />
      {!hideBottomBar && <BottomBar />}
    </div>
  );
};

export default ProtectedLayout;
