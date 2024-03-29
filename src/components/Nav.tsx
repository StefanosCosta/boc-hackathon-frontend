import React from "react";
import { Link } from "react-router-dom";
import logo from "./BankVerifyPro.png";

const Nav = (props: { name: string; setName: (name: string) => void }) => {
  const logout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).catch((err) => {
      console.error(err);
      console.log("NAME ", props.name);
      props.setName("");
    });
    props.setName("");
  };

  let menu;
  console.log("props ", props);
  if (props.name === "") {
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
        <li className="nav-item active">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    );
  } else {
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link to="/login" className="nav-link" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img
            style={{ width: "190px", height: "60px" }}
            src={logo}
            alt="BankVerifyPro"
          ></img>
        </Link>

        <div>{menu}</div>
      </div>
    </nav>
  );
};

export default Nav;
