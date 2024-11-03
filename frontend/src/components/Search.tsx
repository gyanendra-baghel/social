import React, { FormEvent, useEffect, useState } from "react";
import RequestButton from "./ui/RequestButton";
import config from "../config";
import { User } from "../@types";
import ProfileImage from "./ProfileImage";

const SearchUser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommandations, setRecommandations] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          config.apiUrl + "/api/v1/friend/recommends",
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (response.status == 200) {
          const result = await response.json();
          if (result.success) {
            setRecommandations(result.data);
          }
        } else {
          console.error("Error fetching search results:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
    fetchData();
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.apiUrl}/api/v1/user/search?q=${encodeURIComponent(
          searchQuery
        )}`,
        { credentials: "include" }
      );
      if (response.status == 200) {
        const result = await response.json();
        if (result.success) {
          setSearchResults(result.data);
        }
      } else {
        console.error("Error fetching search results:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="pt-10 h-full flex-1">
      <div className="mx-10">
        <form
          className="flex items-center mb-4 max-w-xl mx-auto bg-neutral-900 px-8 rounded-full shadow-md"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search users..."
            className="rounded-sm bg-transparent w-full px-4 py-2 my-2 outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <button
            className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-md hidden"
            type="submit"
          >
            Search
          </button>
        </form>

        <div className="">
          {searchResults.length === 0 ? (
            searchQuery.length != 0 && (
              <p className="text-gray-500 text-sm text-center">
                No users found
              </p>
            )
          ) : (
            <div className="flex flex-wrap mx-auto">
              {searchResults.map((user: User) => (
                <div
                  key={user.username}
                  className="flex justify-between p-2 m-1 border-gray-500 border w-80 rounded"
                >
                  <div className="flex items-center">
                    <ProfileImage firstName={user.fullname} />
                    <div className="ml-2">
                      <p className="font-bold">{user.fullname}</p>
                      <p className=" text-xs">{user.username}</p>
                    </div>
                  </div>
                  <RequestButton
                    className="px-3 bg-black cursor-pointer rounded-lg"
                    friend={user.username}
                    initialText={
                      user?.requested == true ? "Requested" : "Request"
                    }
                  />
                </div>
              ))}
            </div>
          )}
          {recommandations.length != 0 && (
            <h2 className="text-3xl font-bold mt-3">Recommandations</h2>
          )}
          <div className="flex flex-wrap mx-auto">
            {recommandations.map((user: User) => (
              <div
                key={user.username}
                className="flex justify-between p-2 m-1 border-gray-500 border w-80 rounded"
              >
                <div className="flex items-center">
                  <ProfileImage firstName={user.fullname} />
                  <div className="ml-2">
                    <p className="font-bold">{user.fullname}</p>
                    <p className=" text-xs">{user.username}</p>
                  </div>
                </div>
                <RequestButton
                  className="px-3 bg-black cursor-pointer rounded-lg"
                  friend={user.username}
                  initialText={
                    user?.requested == true ? "Requested" : "Request"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
