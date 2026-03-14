import React from "react";

interface OnlineIndicatorProps {
  status: "online" | "offline";
  size?: "sm" | "md";
}

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  status,
  size = "sm",
}) => {
  if (status !== "online") return null;

  const sizeClass = size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";

  return (
    <span
      className={`absolute bottom-0 right-0 ${sizeClass} bg-green-500 rounded-full ring-2 ring-[#0a0a0f]`}
      style={{ boxShadow: "0 0 6px #22c55e" }}
    />
  );
};

export default OnlineIndicator;
