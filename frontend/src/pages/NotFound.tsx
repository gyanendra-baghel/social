import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[7rem] font-extrabold text-slate-800 leading-none select-none">404</p>
      <h1 className="text-2xl font-bold text-slate-100 mt-2 mb-3">Page not found</h1>
      <p className="text-sm text-slate-500 max-w-xs mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
