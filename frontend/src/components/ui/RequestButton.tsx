import React, { useState } from "react";
import config from "../../config";

type Props = {
  className: string;
  friend: string;
  initialText: string;
};

const RequestButton: React.FC<Props> = (props) => {
  const { friend, className, initialText } = props;
  const [buttonText, setButtonText] = useState(initialText);

  const friendRequest = async () => {
    try {
      const response = await fetch(config.apiUrl + `/api/v1/friend/request`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ friendUsername: friend }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status == 201) {
        const data = await response.json();
        setButtonText("Done");
        console.log(data);
      } else {
        console.error("Error fetching search results:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <button
      className={className}
      onClick={() => {
        friendRequest();
      }}
    >
      {buttonText}
    </button>
  );
};

export default RequestButton;
