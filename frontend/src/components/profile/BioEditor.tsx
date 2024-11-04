import React, { useState } from "react";
import config from "../../config";

type BioEditorProps = {
  bio: string;
};

type UpdateData = {
  bio?: string;
};

const BioEditor: React.FC<BioEditorProps> = (props) => {
  const [bio, setBio] = useState<string>(props.bio);
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleEdit = async () => {
    setEditMode((prev) => !prev);
  };

  const handleSubmit = async () => {
    const updatedData: UpdateData = {};
    if (bio !== props.bio && bio) updatedData.bio = bio;
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
        <h2 className="text-lg font-semibold">Bio</h2>
        <button className="text-gray-400" onClick={handleEdit}>
          Edit
        </button>
      </div>
      {editMode ? (
        <div className="mt-4">
          <textarea
            className="w-full bg-neutral-800 p-2 rounded-lg"
            value={bio || props.bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <button
            className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      ) : (
        <p>{bio || props.bio ? bio || props.bio : "No bio provided"}</p>
      )}
    </div>
  );
};

export default BioEditor;
