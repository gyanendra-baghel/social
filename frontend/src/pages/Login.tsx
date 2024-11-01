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
      <main className="min-h-screen bg-neutral-800 flex justify-center items-center">
        <div className="bg-neutral-900 p-7 rounded-md w-96 max-w-full">
          <h1 className="font-bold text-6xl mb-6">Join Now</h1>
          <form className="w-full text-white" onSubmit={handleSubmit}>
            <input
              className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter username..."
              required
              autoFocus
            />
            <input
              className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter Password..."
              required
            />
            <button
              type="submit"
              className="w-full mt-2 bg-orange-500 rounded-full p-2"
            >
              Join
            </button>
            <p className="text-center text-orange-500 mt-3">{message}</p>
          </form>
          <p className="mt-3">
            If you didn't have account?{" "}
            <Link to="/signup" className="text-orange-500 underline">
              Create Account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
