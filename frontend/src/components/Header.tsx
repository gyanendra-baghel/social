import React from "react";
import { Link } from "react-router-dom";
import WhiteLogo from "../assets/logo-white.png";
import { useUser } from "../hooks/useUser";

const Header: React.FC = () => {
  const { authenticated } = useUser();

  return (
    <header className="fixed top-0 w-screen z-50 flex px-6 py-4 justify-between items-center border-b border-white/5 bg-[#0a0a0f]">
      <Link to="/" className="flex items-center gap-2.5">
        <img src={WhiteLogo} alt="logo" width="28px" height="auto" />
        <span className="font-bold text-base text-slate-100 tracking-tight">Social</span>
      </Link>
      <nav className="flex items-center gap-3">
        {authenticated ? (
          <Link
            to="/chat"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5"
          >
            Open App
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-5 rounded-full text-sm font-semibold transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
