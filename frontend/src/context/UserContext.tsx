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
          const data = await response.json();
          // console.log(data);
          if (response.status == 200) {
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
  }, []);

  if (isLoading && !isLogin) return <div className="">Loading..</div>;

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
