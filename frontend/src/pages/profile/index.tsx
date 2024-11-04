import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import config from "../../config";
import { useUser } from "../../hooks/useUser";
import ProfileImage from "../../components/ProfileImage";
import PersonalInfo from "../../components/profile/PersonalInfo";
import BioEditor from "../../components/profile/BioEditor";

const Profile: React.FC = () => {
  const { fullname, username } = useUser();
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [accountPublic, setAccountPublic] = useState<boolean>(false);

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
            if (result.data.public) setAccountPublic(result.data.public);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [username]);

  const handleMakeAccountPublic = async () => {
    try {
      const response = await fetch(config.apiUrl + "/api/v1/user", {
        method: "POST",
        body: JSON.stringify({ public: !accountPublic }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAccountPublic(result.data.public);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="flex min-h-screen w-screen overflow-hidden bg-neutral-800">
      <Sidebar />
      <div className="flex-grow overflow-y-scroll flex flex-col p-3 h-full">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col items-center mt-8">
            <ProfileImage firstName={fullname} size={120} />
            {/* <button className="mt-4 px-4 py-2 bg-gray-700 rounded-md text-sm">
              Upload new photo
            </button>
            <p className="text-gray-400 text-xs mt-2">
              At least 800×800 px recommended. JPG or PNG is allowed
            </p> */}
          </div>
          <PersonalInfo fullname={fullname} username={username} email={email} />
          <BioEditor bio={bio} />
          <div className="mt-6 bg-neutral-900 p-4 rounded-lg">
            <button
              className="w-full py-2 bg-red-500 text-white rounded-md"
              onClick={handleMakeAccountPublic}
            >
              Make account {accountPublic ? "Private" : "Public"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
