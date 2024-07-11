import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Logout() {
  const { setIsLogin } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/user/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.status == 200) {
          setIsLoading(false);
          setIsLogin(false);
        }
      } catch (err) {
        // console.log(err);
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
