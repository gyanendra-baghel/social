import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ChatContextProvider from "../context/ChatContext";
import { useUser } from "../hooks/useUser";

const PrivateRoute: React.FC = () => {
  const { isLogin } = useUser();

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
