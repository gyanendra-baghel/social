import React, { useState } from "react";

type Props = {
  className: string;
  username: string;
  initialText: string;
};

const RequestButton: React.FC<Props> = (props) => {
  const { username, className, initialText } = props;
  const [buttonText, setButtonText] = useState(initialText);

  const friendRequest = async () => {
    try {
      const response = await fetch(`/api/v1/friend/request`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username }),
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
