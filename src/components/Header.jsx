import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [pageState, setPageState] = useState("Sign In");
  const auth = getAuth();
  // Using useEffect to check the changing of auth
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);

  // NavLink Style Function
  const navLinkStyles = ({ isActive }) => {
    return {
      color: isActive ? "#000000" : "none",
      borderBottom: isActive ? "5px solid #008000" : "none",
    };
  };

  return (
    <>
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
          <div>
            <h1 className="h-5 cursor-pointer font-bold">
              <Link to="/">JD Homes</Link>
            </h1>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li
                className="py-3 sm:text-sm text-[12px] font-semibold text-gray-400 
                    border-b-[3px] border-b-transparent cursor-pointer"
              >
                <NavLink to="/" style={navLinkStyles}>
                  Home
                </NavLink>
              </li>
              <li
                className="py-3 sm:text-sm text-[12px] font-semibold text-gray-400 
                    border-b-[3px] border-b-transparent cursor-pointer"
              >
                <NavLink to="/about-us" style={navLinkStyles}>
                  About
                </NavLink>
              </li>
              <li
                className="py-3 sm:text-sm text-[12px] font-semibold text-gray-400 
                    border-b-[3px] border-b-transparent cursor-pointer"
              >
                <NavLink to="/offers" style={navLinkStyles}>
                  Offers
                </NavLink>
              </li>
              <li
                className="py-3 sm:text-sm text-[12px] font-semibold text-gray-400 
                    border-b-[3px] border-b-transparent cursor-pointer"
              >
                <NavLink to="/profile" style={navLinkStyles}>
                  {pageState}
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </>
  );
};

export default Header;
