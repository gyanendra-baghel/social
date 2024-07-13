import { createContext, useState, useEffect } from "react";
import config from "../config";

export const UserContext = createContext<any>(null);

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, saveUsername] = useState<string>("");
  const [fullname, saveFullname] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLogin) {
          const response = await fetch(config.apiUrl + "/api/v1/user", {
            method: "GET",
            credentials: "include",
          });
          // console.log(data);
          if (response.status == 200) {
            const data = await response.json();
            setIsLogin(true);
            if (data.username) saveUsername(data.username);
            if (data.fullName) saveFullname(data.fullName);
          }
        }
      } catch (err) {
        // console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  });

  if (isLoading && !isLogin)
    return (
      <div className="h-screen flex flex-col justify-center items-center text-5xl font-bold bg-neutral-800">
        <p>Backend Service is Restarting.</p>
        <p className="text-2xl mt-4">Wait for a minute then reload</p>
      </div>
    );

  return (
    <UserContext.Provider
      value={{
        fullname,
        saveFullname,
        username,
        saveUsername,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
