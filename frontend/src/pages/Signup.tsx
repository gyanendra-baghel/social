import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import config from "../config";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [fullname, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(config.apiUrl + "/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, email, password }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const result = await response.json();
        setMessage(result.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something bad happen");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen chat-bg flex justify-center items-center px-4 py-16">
        <div className="glass-card p-8 rounded-2xl w-96 max-w-full">
          <div className="mb-7">
            <h1 className="font-bold text-4xl text-slate-100 mb-1">
              Create account
            </h1>
            <p className="text-slate-500 text-sm">Join the Social network</p>
          </div>
          <form
            className="w-full flex flex-col gap-3"
            action="/chat"
            onSubmit={handleSubmit}
          >
            <input
              className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
              type="text"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              required
            />
            <input
              className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              className="glass-input w-full px-4 py-3 text-sm text-slate-100 placeholder-slate-600 rounded-xl outline-none"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
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
              Create Account
            </button>
            {message && (
              <p className="text-center text-blue-400 text-sm">{message}</p>
            )}
          </form>
          <p className="mt-5 text-slate-500 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Signup;
