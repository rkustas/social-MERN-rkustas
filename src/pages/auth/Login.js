import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { gql, useMutation } from "@apollo/client";
import AuthForm from "../../components/forms/AuthForm";
import { USER_CREATE } from "../../graphql/mutations";
import { Helmet } from "react-helmet";

const TITLE = "Login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let history = useHistory();

  // Pass mutation to state
  const [userCreate] = useMutation(USER_CREATE);

  // Context
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          // Destructure use
          const { user } = result;
          // Grab token
          const idTokenResult = await user.getIdTokenResult();

          // Dispatch user to context state
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              email: user.email,
              token: idTokenResult.token,
            },
          });

          dispatch({ type: "NOTIFY", payload: { loading: false } });

          // Make request to server sending user info mongodb to either update/create
          userCreate();

          // Redirect user
          history.push("/profile");
        });
    } catch (error) {
      console.log("Login error", error);
      toast.error(error.message);
      dispatch({ type: "NOTIFY", payload: { loading: false } });
    }
  };

  // Function to sign in with google
  const googleLogin = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    auth.signInWithPopup(googleAuthProvider).then(async (result) => {
      // Destructure user
      const { user } = result;
      // Grab token
      const idTokenResult = await user.getIdTokenResult();

      // Dispatch user to context state
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          email: user.email,
          token: idTokenResult.token,
        },
      });
      dispatch({ type: "NOTIFY", payload: { loading: false } });

      // Make request to server sending user info mongodb to either update/create
      userCreate();

      // Redirect user
      history.push("/profile");
    });
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        <h4>Login</h4>
        <button
          onClick={googleLogin}
          className="btn btn-raised btn-danger my-3"
        >
          Login with Google
        </button>
        <AuthForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          showPasswordInput="true"
        />
        <Link className="text-danger float-right" to="/password/forgot">
          Forgot Password
        </Link>
      </div>
    </>
  );
};

export default Login;
