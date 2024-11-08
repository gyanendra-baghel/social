import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ChatContextProvider from "../context/ChatContext";
import { useUser } from "../hooks/useUser";
import { CallContextProvider } from "../context/CallContext";

const PrivateRoute: React.FC = () => {
  const { authenticated } = useUser();

  return !authenticated ? (
    <Navigate to="/login" replace={true} />
  ) : (
    <ChatContextProvider>
      <CallContextProvider>
        <Outlet />
      </CallContextProvider>
    </ChatContextProvider>
  );
};

export default PrivateRoute;
