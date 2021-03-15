import React, { useContext, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PublicRoute = ({ ...rest }) => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  let history = useHistory();

  useEffect(() => {
    if (user) {
      // Redirect
      history.push("profile");
    }
  }, [user]);

  return (
    <div className="container-fluid p-5">
      <Route {...rest} />
    </div>
  );
};

export default PublicRoute;
