import React from "react";

const UnderDevelopment: React.FC = () => {
  return (
    <div className="fixed flex items-center justify-center bg-gray-900 top-16 left-0 max-w-full rounded-tr-xl">
      <div className="p-8 py-3 rounded-lg shadow-lg">
        <p className="">
          This project is in development stage under{" "}
          <a
            href="https://gyanendra-baghel.vercel.app/"
            className="text-white hover:text-gray-400 transition duration-300 font-bold"
            target="_blank"
          >
            Gyanendra Baghel
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default UnderDevelopment;
