import React from "react";
import { NavLink } from "react-router-dom";
import { MessageCircle, Users, User, LogOut } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <nav className="py-4 px-2 flex flex-col justify-between items-center bg-[#0a0a0f] border-r border-white/5 mini-sidebar">
      <div className="flex flex-col items-center gap-1">
        <NavLink to="/chat" data-tip="Chats">
          <MessageCircle size={22} />
        </NavLink>
        <NavLink to="/connections" data-tip="Connections">
          <Users size={22} />
        </NavLink>
      </div>
      <div className="flex flex-col items-center gap-1">
        <NavLink to="/profile" data-tip="Profile">
          <User size={22} />
        </NavLink>
        <NavLink to="/logout" data-tip="Logout" style={{ color: "rgba(239,68,68,0.65)" }}>
          <LogOut size={22} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
