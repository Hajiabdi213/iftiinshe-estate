// import useUserStore from "../store/user.store";

import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/AppContext";

const PrivateRoute = () => {
  const { currentUser } = useUserContext();
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
