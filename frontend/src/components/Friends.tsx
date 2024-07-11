import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import RequestButton from './ui/RequestButton';

const FriendRequest: React.FC = () => {
    const [pendingFriends, setPendingFriends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/v1/friend/pendings", { credentials: "include" });
                if (response.status == 200) {
                    const data = await response.json();
                    // console.log(data.pendingFriends);
                    setPendingFriends(data.pendingFriends);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    return (
        <div className='flex bg-neutral-900 min-h-screen w-full sm:w-96'>
            <Sidebar />
            <div className='h-full max-w-md px-4 flex-grow'>
                <h1 className='text-3xl font-bold text-center mt-3'>Requests</h1>
                <div className="">
                    {pendingFriends.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center mt-3">No pending requests</p>
                    ) : (
                        <div className="p-3">
                            {pendingFriends.map((user: any) => (
                                <div key={user.username} className="flex justify-between p-2 m-1 border border-gray-500 rounded-md">
                                    <div>
                                        <p className="font-bold">{user.fullName}</p>
                                        <p className='text-sm'>{user.username}</p>
                                    </div>
                                    <RequestButton className='px-3 bg-black cursor-pointer rounded-lg' initialText='Accept' username={user.username} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendRequest;
