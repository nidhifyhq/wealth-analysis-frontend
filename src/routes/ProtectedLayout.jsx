import { Outlet } from "react-router-dom";
import BottomBar from "../components/BottomBar/BottomBar";

const ProtectedLayout = () => {

  return (
    <div style={{ paddingBottom: 80 }}>
      <Outlet />
      <BottomBar />
    </div>
  );
};

export default ProtectedLayout;
