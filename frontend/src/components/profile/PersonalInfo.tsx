import React, { useState } from "react";
import config from "../../config";

type PersonalInfoProps = {
  fullname: string;
  username: string;
  email: string;
};

type UpdateUserData = {
  fullname?: string;
  email?: string;
  password?: string;
};

const PersonalInfo: React.FC<PersonalInfoProps> = (props) => {
  const [fullname, setFullname] = useState<string>(props.fullname);
  const [email, setEmail] = useState<string>(props.email);
  const [password, setPassword] = useState<string>("******");
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleEdit = async () => {
    setEditMode((prev) => !prev);
  };

  const handleSubmit = async () => {
    const updatedData: UpdateUserData = {};
    if (fullname !== props.fullname && fullname)
      updatedData.fullname = fullname;
    if (email !== props.email && email) updatedData.email = email;
    if (password !== "******" && password) updatedData.password = password;
    try {
      const response = await fetch(config.apiUrl + "/api/v1/user", {
        method: "POST",
        body: JSON.stringify(updatedData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(result.data);
          setPassword("******");
          setEditMode(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-6 bg-neutral-900 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Personal Info</h2>
        <button className="text-gray-400" onClick={handleEdit}>
          Edit
        </button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <p className="text-gray-400">Full Name</p>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="bg-transparent text-right w-1/2"
            disabled={!editMode}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-gray-400">Username</p>
          <p>{props.username}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-gray-400">Email</p>
          <input
            type="text"
            value={email || props.email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent text-right w-1/2"
            disabled={!editMode}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-gray-400">Password</p>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClick={() => setPassword("")}
            className="bg-transparent text-right w-1/2"
            disabled={!editMode}
          />
        </div>
        {editMode && (
          <div className="flex justify-between items-center mt-2">
            <button
              className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
              onClick={handleSubmit}
            >
              Save
            </button>
            <p className="text-red-800 text-xs">Click on the word</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
