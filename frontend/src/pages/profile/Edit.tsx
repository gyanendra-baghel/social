import React, { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import config from "../../config";

const EditProfile: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const [newFullName, setNewFullName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch(config.apiUrl + "/api/v1/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        currentPassword,
        fullname: newFullName,
        email: newEmail,
        password: newPassword,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        setMessage(result.message || "Internal Server Error.");
        navigate("/login");
      }
    }
  };

  return (
    <main className="flex min-h-screen chat-bg">
      <Sidebar />
      <div className="flex justify-center items-center flex-grow px-4">
        <div className="glass-card p-8 rounded-2xl w-full max-w-md">
          <h1 className="font-bold text-3xl text-slate-100 mb-6">Change Info</h1>
          <form
            className="w-full flex flex-col gap-3"
            action="/chat"
            onSubmit={handleSubmit}
          >
            <input
              className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              placeholder="Enter Current Password..."
              required
            />
            <p className="text-xs text-slate-500">
              Only fill the fields you want to change.
            </p>
            {type === "fullname" && (
              <input
                className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
                type="text"
                value={newFullName}
                onChange={(e) => {
                  setNewFullName(e.target.value);
                }}
                placeholder="Enter Fullname..."
                required
              />
            )}
            {type === "email" && (
              <input
                className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
                type="text"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
                placeholder="Enter Email..."
                required
              />
            )}
            {type === "password" && (
              <input
                className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder="Enter New Password..."
                required
              />
            )}
            <button
              type="submit"
              className="w-full mt-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
              style={{ boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
            >
              Save Changes
            </button>
            {message && (
              <p className="text-center text-blue-400 text-sm mt-1">{message}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
