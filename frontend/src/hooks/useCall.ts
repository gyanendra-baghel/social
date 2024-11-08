import { useContext } from "react";
import { CallContext, CallContextProps } from "../context/CallContext";

export const useCall = (): CallContextProps => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};
