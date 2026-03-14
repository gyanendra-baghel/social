import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import config from "../../config";
import { useUser } from "../../hooks/useUser";
import ProfileImage from "../../components/ProfileImage";
import PersonalInfo from "../../components/profile/PersonalInfo";
import BioEditor from "../../components/profile/BioEditor";
import { Globe, Lock } from "lucide-react";

const Profile: React.FC = () => {
  const { fullname, username } = useUser();
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [accountPublic, setAccountPublic] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.apiUrl + "/api/v1/user/", {
          credentials: "include",
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            if (result.data.email) setEmail(result.data.email);
            if (result.data.bio) setBio(result.data.bio);
            setAccountPublic(result.data.public ?? false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [username]);

  const handleTogglePublic = async () => {
    try {
      const response = await fetch(config.apiUrl + "/api/v1/user", {
        method: "POST",
        body: JSON.stringify({ public: !accountPublic }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) setAccountPublic(result.data.public);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="flex min-h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      <Sidebar />
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-8">

          {/* Avatar card */}
          <div className="glass-card rounded-2xl p-8 flex flex-col items-center mb-4">
            <div className="relative mb-4">
              <ProfileImage firstName={fullname} size={88} />
              <span
                className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-[#13131a]"
                style={{ boxShadow: "0 0 6px #22c55e" }}
              />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">{fullname}</h2>
            <p className="text-sm text-slate-500 mt-0.5">@{username}</p>
            <span className="mt-3 text-xs text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Online
            </span>
          </div>

          {/* Personal info */}
          <PersonalInfo fullname={fullname} username={username} email={email} />

          {/* Bio */}
          <div className="mt-4">
            <BioEditor bio={bio} />
          </div>

          {/* Privacy toggle */}
          <div className="mt-4">
            <button
              onClick={handleTogglePublic}
              className="w-full flex items-center justify-between px-5 py-4 glass-card rounded-2xl transition-colors hover:border-white/10 group"
            >
              <div className="flex items-center gap-3">
                {accountPublic
                  ? <Globe size={18} className="text-blue-400" />
                  : <Lock size={18} className="text-slate-500" />
                }
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-200">
                    {accountPublic ? "Public Account" : "Private Account"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {accountPublic
                      ? "Anyone can find and connect with you"
                      : "Only connections can see your profile"}
                  </p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${accountPublic ? "bg-blue-600" : "bg-white/10"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${accountPublic ? "left-[22px]" : "left-0.5"}`} />
              </div>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Profile;
