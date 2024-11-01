import { createContext, useState, useEffect } from "react";
import config from "../config";

export interface UserContextType {
  username: string;
  saveUsername: React.Dispatch<React.SetStateAction<string>>;
  fullname: string;
  saveFullname: React.Dispatch<React.SetStateAction<string>>;
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | null>(null);

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, saveUsername] = useState<string>("");
  const [fullname, saveFullname] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authenticated) {
          const response = await fetch(config.apiUrl + "/api/v1/user", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setAuthenticated(true);
              if (result.data.username) saveUsername(result.data.username);
              if (result.data.fullname) saveFullname(result.data.fullname);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-screen flex flex-col justify-center items-center text-5xl font-bold bg-neutral-800 bg-opacity-70">
        <p className="text-center">Backend Service is Restarting.</p>
        <p className="text-2xl mt-4">Wait for a minute then reload</p>
        <p className="text-base">Deployed on Render (Free Tier)</p>
      </div>
    );
  }

  return (
    <>
      {/* {isLoading && (
        <div className="fixed top-0 left-0 h-screen w-screen flex flex-col justify-center items-center text-5xl font-bold bg-neutral-800 bg-opacity-70">
          <p className="text-center">Backend Service is Restarting.</p>
          <p className="text-2xl mt-4">Wait for a minute then reload</p>
          <p className="text-base">Deployed on Render (Free Tier)</p>
        </div>
      )} */}
      <UserContext.Provider
        value={{
          fullname,
          saveFullname,
          username,
          saveUsername,
          authenticated,
          setAuthenticated,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export default UserContextProvider;
