import React, { useState, Fragment, useContext } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../context/authContext";

const TITLE = "Password Update";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  // function to update password in firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    // update password in firebase
    auth.currentUser
      .updatePassword(password)
      .then(() => {
        dispatch({ type: "NOTIFY", payload: { loading: false } });
        toast.success("Password updated!");
      })
      .catch((error) => {
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
        <h4>Password Update</h4>
        <AuthForm
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          showPasswordInput="true"
          hideEmailInput="true"
        />
      </div>
    </>
  );
};

export default PasswordUpdate;
