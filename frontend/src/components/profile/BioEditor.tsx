import React, { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import config from "../../config";

type BioEditorProps = {
  bio: string;
};

const BioEditor: React.FC<BioEditorProps> = ({ bio: initialBio }) => {
  const [bio, setBio] = useState(initialBio);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(initialBio);

  useEffect(() => {
    setBio(initialBio);
    setDraft(initialBio);
  }, [initialBio]);

  const handleSave = async () => {
    if (draft === bio) { setEditMode(false); return; }
    try {
      const response = await fetch(config.apiUrl + "/api/v1/user", {
        method: "POST",
        body: JSON.stringify({ bio: draft }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBio(draft);
          setEditMode(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setDraft(bio);
    setEditMode(false);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-slate-200">Bio</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors">
              <Check size={14} /> Save
            </button>
            <button onClick={handleCancel} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>
      <div className="px-5 py-4">
        {editMode ? (
          <textarea
            className="w-full bg-[#0f0f16] border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-600/50 resize-none transition-colors"
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tell people about yourself..."
            autoFocus
          />
        ) : (
          <p className="text-sm text-slate-400 leading-relaxed">
            {bio || <span className="text-slate-600 italic">No bio yet. Click Edit to add one.</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default BioEditor;
