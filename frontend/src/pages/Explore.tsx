import React from "react";
// import Header from '../components/Header'
import SearchUser from "../components/Search";
import FriendRequest from "../components/Friends";

const Explore: React.FC = () => {
  return (
    <main className="bg-neutral-800 flex flex-col sm:flex-row">
      <FriendRequest />
      <SearchUser />
    </main>
  );
};

export default Explore;
