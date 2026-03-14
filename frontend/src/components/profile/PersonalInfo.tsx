import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type PersonalInfoProps = {
  fullname: string;
  username: string;
  email: string;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ fullname, username, email }) => {
  const rows = [
    { label: "Full Name", value: fullname, editType: "fullname" },
    { label: "Username", value: `@${username}`, editType: null },
    { label: "Email", value: email, editType: "email" },
    { label: "Password", value: "••••••••", editType: "password" },
  ];

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-slate-200">Personal Info</h2>
      </div>
      <div className="divide-y divide-white/5">
        {rows.map(({ label, value, editType }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">{label}</p>
              <p className="text-sm text-slate-200">{value || <span className="text-slate-600 italic">Not set</span>}</p>
            </div>
            {editType && (
              <Link
                to={`/profile/edit/${editType}`}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Edit <ChevronRight size={14} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
