import React, { useContext, useState } from "react";
import { auth } from "../../firebase";
// Toast notification
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../context/authContext";

const TITLE = "Register";

const Register = () => {
  const [email, setEmail] = useState("");

  // Bring in context
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    // Firebase config
    const config = {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      handleCodeInApp: true,
    };

    // Send confirmation email to user's email address
    const result = await auth
      .sendSignInLinkToEmail(email, config)
      .then(() => {
        // console.log(result);

        // Show toast notification to user about email sent
        toast.success(
          `Email is sent to ${email}.  Click the link to complete registration.`
        );

        // Save user email to local storage
        window.localStorage.setItem("emailForRegistration", email);
        // Reset email state
        setEmail("");
        dispatch({ type: "NOTIFY", payload: { loading: false } });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: "NOTIFY", payload: { loading: false } });
        toast.error(error.message);
      });
  };
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        <h4>Register</h4>
        <AuthForm
          email={email}
          setEmail={setEmail}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default Register;
