import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/AppContext";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200  shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}

        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Itiinshe</span>
            <span className="text-slate-700">Estate</span>
          </h1>{" "}
        </Link>

        {/* search */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>

        {/* menu */}
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className=" text-slate-700 hover:underline">About </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full w-7 h-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slate-700 hover:underline">Sign In </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
