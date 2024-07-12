import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { UserContext } from "../../context/UserContext";
import config from "../../config";

const Profile: React.FC = () => {
  const { fullname, username } = useContext(UserContext);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(config.apiUrl + "/api/v1/user/", {
        credentials: "include",
      });
      if (response.status == 200) {
        const data = await response.json();
        // console.log(data);
        setEmail(data.email);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen bg-neutral-800">
      <Sidebar />
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-neutral-900 p-7 rounded-md">
          <h1 className="font-bold text-6xl mb-6 text-center">Profile</h1>
          <table className="w-full text-xl">
            <tbody>
              <tr>
                <td className="font-semibold">Fullname</td>
                <td>{fullname}</td>
                <td className="text-right pl-5 py-1">
                  <Link
                    to="/profile/edit/fullname"
                    className="w-full bg-orange-500 rounded-full px-3 py-1 text-sm text-right mb-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="font-semibold pr-5">Username</td>
                <td>{username}</td>
              </tr>
              <tr>
                <td className="font-semibold">Email</td>
                <td>{email}</td>
                <td className="text-right py-1">
                  <Link
                    to="/profile/edit/email"
                    className="w-full bg-orange-500 rounded-full px-3 py-1 text-sm text-right mb-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="font-semibold">Password</td>
                <td>****</td>
                <td className="text-right py-1">
                  <Link
                    to="/profile/edit/password"
                    className="w-full bg-orange-500 rounded-full px-3 py-1 text-sm text-right mb-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Profile;
