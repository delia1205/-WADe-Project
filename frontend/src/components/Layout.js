import React, { useContext, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserContext } from "../hooks/context";
import Title from "./Title";

export default function Layout() {
  let { userData } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {!userData.isLogged ? (
        <nav className="see-through">
          <div className="title">
            <Title />
          </div>
          <button
            className="dropdown"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Dropdown
          </button>
          <ul className="list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sign-in">Sign in</Link>
            </li>
            <li>
              <Link to="/tutorial">Tutorial</Link>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/query">Query</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/tutorial">Tutorial</Link>
            </li>
          </ul>
        </nav>
      )}

      <Outlet />
    </>
  );
}
