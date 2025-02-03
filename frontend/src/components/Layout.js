import React, { useContext, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserContext } from "../hooks/context";
import Title from "./Title";

export default function Layout() {
  const { userData } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className={"see-through"}>
        <div className="title">
          <Title />
        </div>

        <ul className="list">
          <li>
            <Link to="/">Home</Link>
          </li>
          {userData.email === "" ? (
            <>
              <li>
                <Link to="/sign-in">Sign in</Link>
              </li>
              <li>
                <Link to="/tutorial">Tutorial</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/query">Query</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/tutorial">Tutorial</Link>
              </li>
            </>
          )}
        </ul>

        <button className="icon" onClick={toggleDropdown}>
          &#9776;
        </button>

        {isDropdownOpen && (
          <ul className="dropdown">
            <li>
              <Link to="/">Home</Link>
            </li>
            {userData.email === "" ? (
              <>
                <li>
                  <Link to="/sign-in">Sign in</Link>
                </li>
                <li>
                  <Link to="/tutorial">Tutorial</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/query">Query</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/tutorial">Tutorial</Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>

      <Outlet />
    </>
  );
}
