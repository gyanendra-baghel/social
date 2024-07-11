import React from "react";
import { BoxArrowLeft, ChatFill, HouseFill, UserFill } from "../assets/icons";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <nav className="py-3 px-2 flex flex-col justify-between items-center bg-black text-slate-400 mini-sidebar">
      <div className="flex flex-col items-center">
        <NavLink to="/explore">
          <HouseFill className="my-2" height={30} width={30} />
        </NavLink>
        <NavLink to="/chat">
          <ChatFill className="my-2" height={30} width={30} />
        </NavLink>
      </div>
      <div className="flex flex-col items-center">
        <NavLink to="/profile">
          <UserFill className="my-2" height={35} width={35} />
        </NavLink>
        <NavLink to="/logout">
          <BoxArrowLeft className="my-2 text-red-600" height={30} width={30} />
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
