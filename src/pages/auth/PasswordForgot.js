import React, { useContext, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../context/authContext";

const TITLE = "Forgot Password";

const PasswordForgot = () => {
  const [email, setEmail] = useState("");

  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    // utilize auth module from firebase
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    // Firebase config
    const config = {
      url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        // Reset email
        setEmail("");
        // Reset loading to false
        dispatch({ type: "NOTIFY", payload: { loading: false } });
        // Show toast message
        toast.success(
          `Email is sent to ${email}.  Click on the link to reset your password`
        );
      })
      .catch((error) => {
        dispatch({ type: "NOTIFY", payload: { loading: false } });
        console.log("Error on password forgot email", error);
      });
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        <h4>Forgot Password</h4>

        <AuthForm
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default PasswordForgot;
