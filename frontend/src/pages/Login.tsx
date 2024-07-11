import React, { FormEvent, useEffect, useState } from 'react'
import { useContext } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from "../context/UserContext";
import Footer from '../components/Footer';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const { saveFullname, saveUsername, setIsLogin } = useContext(UserContext)
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/v1/user/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            const data = await response.json();
            if (response.status == 200) {
                saveUsername(data.user.username);
                saveFullname(data.user.fullName);
                setIsLogin(true);
                navigate("/chat");
            }
            setMessage(data?.message || "Internal Server Error.");
        } else {
            setMessage("Internal Server Error.");
        }
    };

    useEffect(() => {
        toast.info('Don\'t forgot to fill feedback', {
            position: "bottom-right",
            autoClose: 9000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }, []);


    return (
        <>
            <Header />
            <main className='min-h-screen bg-neutral-800 flex justify-center items-center'>
                <div className="bg-neutral-900 p-7 rounded-md w-96 max-w-full">
                    <h1 className='font-bold text-6xl mb-6'>Join Now</h1>
                    <form className='w-full text-white' onSubmit={handleSubmit}>
                        <input className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none" type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Enter username..." required autoFocus />
                        <input className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter Password..." required />
                        <button type="submit" className="w-full mt-2 bg-orange-500 rounded-full p-2">Join</button>
                        <p className='text-center text-orange-500 mt-3'>{message}</p>
                    </form>
                    <p className='mt-3'>If you didn't have account? <Link to="/signup" className='text-orange-500 underline'>Create Account</Link></p>
                </div>
            </main >
            <Footer />
        </>
    )
}

export default Login