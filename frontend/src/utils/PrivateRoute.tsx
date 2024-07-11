import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import ChatContextProvider from "../context/ChatContext";

const PrivateRoute: React.FC = () => {
  const { isLogin } = useContext(UserContext);

  // return <Outlet/>

  return !isLogin ? (
    <Navigate to="/login" replace={true} />
  ) : (
    <ChatContextProvider>
      <Outlet />
    </ChatContextProvider>
  );
};

export default PrivateRoute;
