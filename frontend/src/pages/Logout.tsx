import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";
import { useUser } from "../hooks/useUser";

function Logout() {
  const { setIsLogin } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    toast.info("Don't forget to fill the feedback.", {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    const fetchData = async () => {
      try {
        const response = await fetch(config.apiUrl + "/api/v1/user/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.status == 200) {
          setIsLoading(false);
          setIsLogin(false);
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
