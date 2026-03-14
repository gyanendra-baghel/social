import React, { FormEvent, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RequestButton from "../components/ui/RequestButton";
import ProfileImage from "../components/ProfileImage";
import config from "../config";
import { User } from "../@types";
import { Search, UserCheck, Users } from "lucide-react";

type Tab = "requests" | "discover";

const ConnectionsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("requests");
  const [pendingFriends, setPendingFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);

  useEffect(() => {
    fetchPending();
    fetchRecommendations();
  }, []);

  const fetchPending = async () => {
    try {
      const response = await fetch(config.apiUrl + "/api/v1/friend/pendings", {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) setPendingFriends(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(config.apiUrl + "/api/v1/friend/recommends", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) setRecommendations(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `${config.apiUrl}/api/v1/user/search?q=${encodeURIComponent(searchQuery)}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) setSearchResults(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0a0a0f] text-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 max-w-2xl mx-auto px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Connections</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your connections and requests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass-card rounded-xl p-1 mb-6 self-start">
          <button
            onClick={() => setTab("requests")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "requests"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserCheck size={15} />
            Requests
            {pendingFriends.length > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {pendingFriends.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("discover")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "discover"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users size={15} />
            Discover
          </button>
        </div>

        {/* ── REQUESTS TAB ── */}
        {tab === "requests" && (
          <div className="flex flex-col gap-2">
            {pendingFriends.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <UserCheck size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No pending connection requests</p>
              </div>
            ) : (
              pendingFriends.map((user: User) => (
                <div
                  key={user.username}
                  className="glass-card flex justify-between items-center p-4 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <ProfileImage firstName={user.fullname} size={44} />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{user.fullname}</p>
                      <p className="text-xs text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                  <RequestButton
                    className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium cursor-pointer rounded-lg border border-blue-500/30 transition-colors"
                    initialText="Accept"
                    friend={user.username}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* ── DISCOVER TAB ── */}
        {tab === "discover" && (
          <div className="flex flex-col gap-6">
            {/* Search */}
            <form className="glass-input flex items-center px-4 py-3 gap-3" onSubmit={handleSearch}>
              <Search className="text-slate-500 shrink-0" size={16} />
              <input
                type="text"
                placeholder="Search people by name or username..."
                className="bg-transparent w-full outline-none text-sm text-slate-200 placeholder-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  Search Results
                </h2>
                <div className="flex flex-col gap-2">
                  {searchResults.map((user: User) => (
                    <div
                      key={user.username}
                      className="glass-card flex justify-between items-center p-4 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <ProfileImage firstName={user.fullname} size={44} />
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{user.fullname}</p>
                          <p className="text-xs text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                      <RequestButton
                        className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium cursor-pointer rounded-lg border border-blue-500/30 transition-colors"
                        friend={user.username}
                        initialText={user?.requested == true ? "Requested" : "Add Connection"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.length > 0 && searchResults.length === 0 && (
              <p className="text-slate-600 text-sm text-center">
                No users found for &quot;{searchQuery}&quot;
              </p>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  People You May Know
                </h2>
                <div className="flex flex-col gap-2">
                  {recommendations.map((user: User) => (
                    <div
                      key={user.username}
                      className="glass-card flex justify-between items-center p-4 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <ProfileImage firstName={user.fullname} size={44} />
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{user.fullname}</p>
                          <p className="text-xs text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                      <RequestButton
                        className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium cursor-pointer rounded-lg border border-blue-500/30 transition-colors"
                        friend={user.username}
                        initialText={user?.requested == true ? "Requested" : "Add Connection"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ConnectionsPage;
