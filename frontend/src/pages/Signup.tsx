import React, { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer';
import Header from '../components/Header';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/v1/user/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ fullName, username, email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            // console.log(data);
            setMessage(data.message || "Internal Server Error.");
            if (data.status == 201) {
                navigate("/login");
            }
        } else {
            setMessage("Internal Server Error.");
        }
    };

    return (
        <>
            <Header />
            <main className='min-h-screen bg-neutral-800 flex justify-center items-center'>
                <div className="bg-neutral-900 p-7 rounded-md w-96 max-w-full">
                    <h1 className='font-bold text-6xl mb-6'>Join Us</h1>
                    <form className='w-full text-white' action="/chat" onSubmit={handleSubmit}>
                        <input className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none" type="text" value={fullName} onChange={(e) => { setFullName(e.target.value) }} placeholder="Enter fullname..." required />
                        <input className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none" type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Enter username..." required />
                        <input className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none" type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter email..." required />
                        <input className="rounded-sm bg-transparent w-full px-4 py-2 my-2 border-gray-500 border outline-none" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Enter Password..." required />
                        <button type="submit" className="w-full mt-2 bg-orange-500 rounded-full p-2">Join</button>
                        <p className='text-center text-orange-500 mt-3'>{message}</p>
                    </form>
                    <p className='mt-3 text-center'>If you already have account? <Link to="/login" className='text-orange-500 underline'>Join Now</Link></p>
                </div>
            </main >
            <Footer />
        </>
    )
}

export default Signup