import React, { useContext, useEffect, useState } from "react";
import { Route, Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import LoadingtoRedirect from "./LoadingtoRedirect";

// Children props , components themselves and the rest of the props
const PrivateRoute = ({ ...rest }) => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(false);

  // Make user we have up to date user
  useEffect(() => {
    if (state.user) {
      setUser(true);
    }
  }, [state.user]);

  // Fixed sidebar with a couple of menus

  const navLinks = () => (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/password/update">
            Password
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/post/create">
            Post
          </Link>
        </li>
      </ul>
    </nav>
  );

  // render content using a function, only use parentheses to avoid using return keyword
  const renderContent = () => (
    <div className="container-fluid pt-5">
      <div className="row">
        <div className="col-md-3">{navLinks()}</div>
        <div className="col-md-9">
          {/* return route and the rest of the props in the content side of the page */}
          <Route {...rest} />
        </div>
      </div>
    </div>
  );

  return user ? renderContent() : <LoadingtoRedirect path="/login" />;
};

export default PrivateRoute;
