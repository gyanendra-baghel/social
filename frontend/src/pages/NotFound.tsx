import Header from "../components/Header";

function NotFound() {
  return (
    <>
      <Header />
      <div className="bg-neutral-800 flex flex-col justify-center items-center min-h-screen font-bold">
        <p className="m-5 text-5xl">404</p>
        <p className="font-bold text-6xl">Not Found</p>
      </div>
    </>
  );
}

export default NotFound;
