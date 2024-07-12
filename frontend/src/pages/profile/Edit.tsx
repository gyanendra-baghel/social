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
        fullName: newFullName,
        email: newEmail,
        password: newPassword,
      }),
    });
    const data = await response.json();
    // console.log(data);
    setMessage(data.message || "Internal Server Error.");
    if (data.status == 201) {
      navigate("/login");
    }
  };

  return (
    <main className="flex min-h-screen bg-neutral-800">
      <Sidebar />
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-neutral-900 p-7 rounded-md max-w-md">
          <h1 className="font-bold text-6xl mb-6">Change Info</h1>
          <form
            className="w-full text-white"
            action="/chat"
            onSubmit={handleSubmit}
          >
            <input
              className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              placeholder="Enter Current Password..."
              required
            />
            <hr className="mb-2" />
            <p className="text-sm text-orange-400">
              Only fill those fields which you want to change.
            </p>
            {type === "fullname" && (
              <input
                className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none"
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
                className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none"
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
                className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none"
                type="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                placeholder="Enter Password..."
                required
              />
            )}
            <button
              type="submit"
              className="w-full mt-2 bg-orange-500 rounded-full p-2"
            >
              Edit
            </button>
            <p className="text-center text-orange-500 mt-3">{message}</p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
