import React, { Fragment, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { AuthContext } from "../context/authContext";
import Search from "./Search";
import HomeIcon from "@material-ui/icons/Home";
const Nav = () => {
  const { state, dispatch } = useContext(AuthContext);
  let history = useHistory();

  // Grab user from state and check if we have user
  const { user } = state;

  const logout = () => {
    // Sign out user
    auth.signOut();

    // Reset context
    dispatch({
      type: "LOGGED_IN_USER",
      payload: null,
    });

    // Redirect
    history.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand flex-grow-1" to="/">
        <HomeIcon color="secondary" fontSize="large" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="ml-auto">
          <Search />
        </div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/users">
              Subscribers
            </Link>
          </li>
          {user && (
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                {user && user.email.split("@")[0]}
              </Link>
            </li>
          )}
          {!user && (
            <Fragment>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </Fragment>
          )}
          {user && (
            <li className="nav-item">
              <a onClick={logout} href="/login" className="nav-item nav-link">
                Logout
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
