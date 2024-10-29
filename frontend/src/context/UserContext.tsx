import { createContext, useState, useEffect } from "react";
import config from "../config";

export interface UserContextType {
  username: string;
  saveUsername: React.Dispatch<React.SetStateAction<string>>;
  fullname: string;
  saveFullname: React.Dispatch<React.SetStateAction<string>>;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | null>(null);

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
          if (response.status == 200) {
            const data = await response.json();
            setIsLogin(true);
            if (data.username) saveUsername(data.username);
            if (data.fullName) saveFullname(data.fullName);
          }
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading && !isLogin && (
        <div className="fixed top-0 left-0 h-screen w-screen flex flex-col justify-center items-center text-5xl font-bold bg-neutral-800 bg-opacity-70">
          <p className="text-center">Backend Service is Restarting.</p>
          <p className="text-2xl mt-4">Wait for a minute then reload</p>
          <p className="text-base">Deployed on Render (Free Tier)</p>
        </div>
      )}
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
    </>
  );
};

export default UserContextProvider;
