import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { gql, useMutation } from "@apollo/client";
import AuthForm from "../../components/forms/AuthForm";
import { USER_CREATE } from "../../graphql/mutations";
import { Helmet } from "react-helmet";

const TITLE = "Complete Registration";

const CompleteRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   Bring in context
  const { dispatch } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    //   Grab email from local storage
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, [history]);

  // Pass mutation to state
  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set loading true
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    // Make sure we have email and password
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    try {
      // Sign in user with email link, use full url as parameter
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      //   console.log(result);
      if (result.user.emailVerified) {
        // Remove email from localstorage
        window.localStorage.removeItem("emailForRegistration");
        // Get currently logged in user
        let user = auth.currentUser;
        // Update user password with current state password
        user.updatePassword(password);

        // dispatch user with token and email
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: { email: user.email, token: idTokenResult.token },
        });

        // make request to save user/update user in mongodb useMutation
        userCreate();

        dispatch({ type: "NOTIFY", payload: { loading: false } });

        // redirect user
        history.push("/profile");
      }
    } catch (error) {
      console.log("Register complete error", error.message);
      // Reset loading to false
      dispatch({ type: "NOTIFY", payload: { loading: false } });
      toast.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        <h4>Complete Registration</h4>
        <AuthForm
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
          password={password}
          setPassword={setPassword}
          showPasswordInput="true"
        />
      </div>
    </>
  );
};
export default CompleteRegistration;
