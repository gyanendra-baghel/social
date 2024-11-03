import { Link } from "react-router-dom";
import WhiteLogo from "../assets/logo-white.png";
import { useUser } from "../hooks/useUser";

const Header: React.FC = () => {
  const { authenticated } = useUser();

  return (
    <header className="bg-black text-center text-white fixed top-0 w-screen shadow-md z-50 flex p-4 justify-between">
      <Link to="/" className="flex">
        <img src={WhiteLogo} alt="logo" width="40px" height="auto" />
        <p className="font-sans font-bold text-xl ml-2">Social</p>
      </Link>
      <nav>
        <Link
          to="/feedback"
          className="text-white py-2 px-3 font-bold hidden mr-7 sm:inline"
        >
          Feedback
        </Link>
        {authenticated ? (
          <Link
            to="/logout"
            className="bg-orange-500 text-white py-2 px-7 rounded-full font-bold hover:border-orange-600 border-2 border-transparent hover:bg-transparent hover:text-orange-500 mx-2"
          >
            Logout
          </Link>
        ) : (
          <Link
            to="/chat"
            className="bg-orange-500 text-white py-2 px-7 rounded-full font-bold hover:border-orange-600 border-2 border-transparent hover:bg-transparent hover:text-orange-500"
          >
            Join Now
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
