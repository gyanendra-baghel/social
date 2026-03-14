import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import config from "../config";
import { useUser } from "../hooks/useUser";

const Login: React.FC = () => {
  const { saveFullname, saveUsername, setAuthenticated } = useUser();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(config.apiUrl + "/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (response.ok) {
        const user = result.data.user;
        saveUsername(user.username);
        saveFullname(user.fullname);
        setAuthenticated(true);
        navigate("/chat");
      } else if ([400, 401, 500].includes(response.status)) {
        setMessage(result.message);
      } else {
        setMessage("Something Bad Happen");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something Bad Happen");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen chat-bg flex justify-center items-center px-4">
        <div className="glass-card p-8 rounded-2xl w-96 max-w-full">
          <div className="mb-7">
            <h1 className="font-bold text-4xl text-slate-100 mb-1">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">Sign in to your account</p>
          </div>
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              autoFocus
            />
            <input
              className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full mt-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
              style={{ boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
            >
              Sign In
            </button>
            {message && (
              <p className="text-center text-blue-400 text-sm">{message}</p>
            )}
          </form>
          <p className="mt-5 text-slate-500 text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
