import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectIsPinSet,
  selectIsPinVerifiedThisSession,
} from "../store/auth/auth.selectors";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isPinSet = useSelector(selectIsPinSet);
  const isPinVerifiedThisSession = useSelector(selectIsPinVerifiedThisSession);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPinSet) {
    return <Navigate to="/PinLock?mode=set" replace />;
  }

  if (!isPinVerifiedThisSession) {
    return <Navigate to="/PinLock?mode=verify" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
