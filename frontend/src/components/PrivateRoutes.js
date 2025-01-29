import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/context.js";

const PrivateRoutes = () => {
  const { userData } = useAuth();
  return userData.email !== "" ? <Outlet /> : <Navigate to="/sign-in" />;
};
export default PrivateRoutes;
