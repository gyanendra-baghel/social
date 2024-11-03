import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import RequestButton from "./ui/RequestButton";
import config from "../config";
import { User } from "../@types";
import ProfileImage from "./ProfileImage";

const FriendRequest: React.FC = () => {
  const [pendingFriends, setPendingFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          config.apiUrl + "/api/v1/friend/pendings",
          {
            credentials: "include",
          }
        );
        console.log(response);
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          if (result.success) {
            setPendingFriends(result.data);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex bg-neutral-900 min-h-screen w-full sm:w-96">
      <Sidebar />
      <div className="h-full max-w-md px-4 flex-grow">
        <h1 className="text-3xl font-bold text-center mt-3">Requests</h1>
        <div className="">
          {pendingFriends.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-3">
              No pending requests
            </p>
          ) : (
            <div className="p-3">
              {pendingFriends.map((user: User) => (
                <div
                  key={user.username}
                  className="flex justify-between p-2 m-1 border border-gray-500 rounded-md"
                >
                  <div className="flex items-center">
                    <ProfileImage firstName={user.fullname} />
                    <div className="ml-2">
                      <p className="font-bold">{user.fullname}</p>
                      <p className="text-sm">{user.username}</p>
                    </div>
                  </div>
                  <RequestButton
                    className="px-3 bg-black cursor-pointer rounded-lg"
                    initialText="Accept"
                    friend={user.username}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
