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
    <div className="flex bg-[#0d0d14] border-r border-white/5 min-h-screen w-full sm:w-[340px] flex-shrink-0">
      <Sidebar />
      <div className="h-full px-4 flex-grow overflow-y-auto">
        <div className="flex items-center justify-between py-4 border-b border-white/5 mb-4">
          <h1 className="text-lg font-semibold text-slate-100">Connection Requests</h1>
          {pendingFriends.length > 0 && (
            <span className="bg-blue-600/20 text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
              {pendingFriends.length}
            </span>
          )}
        </div>
        <div>
          {pendingFriends.length === 0 ? (
            <p className="text-slate-600 text-sm text-center mt-8">
              No pending requests
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingFriends.map((user: User) => (
                <div
                  key={user.username}
                  className="glass-card flex justify-between items-center p-3 rounded-xl"
                >
                  <div className="flex items-center">
                    <ProfileImage firstName={user.fullname} size={40} />
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-slate-100">{user.fullname}</p>
                      <p className="text-xs text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                  <RequestButton
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium cursor-pointer rounded-lg border border-blue-500/30 transition-colors"
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
