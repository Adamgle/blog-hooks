import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FilterSelect from "./FilterSelect";

const Header = ({ sortMethod, setSortMethod }) => {
  const navigate = useNavigate();
  
  return (
    <header>
      <h1 onClick={() => navigate("/blog-hooks/posts", { replace: true })}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none " }}>
          _Log
        </Link>
      </h1>
      <nav>
        <ul>
          <li>
            <NavLink
              to="home"
              style={({ isActive }) => ({
                color: isActive ? "aqua" : "#fff",
                textDecoration: "none",
              })}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="null"
              style={({ isActive }) => ({
                color: isActive ? "aqua" : "#fff",
                textDecoration: "none",
              })}
            >
              Portfolio
            </NavLink>
          </li>
          <li>Contact</li>
          <li>About us</li>
          <FilterSelect sortMethod={sortMethod} setSortMethod={setSortMethod} />
          <li onClick={() => localStorage.clear()}>Clear Storage</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
