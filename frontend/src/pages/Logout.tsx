import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import config from "../config";
import { useUser } from "../hooks/useUser";
import { useChat } from "../hooks";

function Logout() {
  const { setAuthenticated } = useUser();
  const { socket } = useChat();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      socket?.disconnect();
      try {
        const response = await fetch(config.apiUrl + "/api/v1/user/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.status == 200) {
          setIsLoading(false);
          setAuthenticated(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center text-5xl font-bold bg-neutral-800">
        Loading..
      </div>
    );
  return <Navigate to="/login" replace={true} />;
}

export default Logout;
