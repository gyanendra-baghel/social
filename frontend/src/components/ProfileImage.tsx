import React, { useEffect, useRef, useState } from "react";

interface ProfileImageProps {
  firstName: string;
  size?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  firstName,
  size = 40,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initial: string = firstName ? firstName[0].toUpperCase() : "";

  useEffect(() => {
    const generateImageWithInitials = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const color = getColorFromName(firstName);

      canvas.width = size;
      canvas.height = size;

      context.fillStyle = color;
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = `${size * 0.5}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.fillText(initial, size / 2, size / 2);

      setImageUrl(canvas.toDataURL());
    };

    generateImageWithInitials();
  }, [firstName, size, initial]);

  // Generate a unique color from the user's name
  const getColorFromName = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${firstName}'s profile`}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

export default ProfileImage;
