import React, { useState, useMemo, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, gql } from "@apollo/client";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../../components/forms/Profile";
import FileUpload from "../../components/FileUpload";
import { Helmet } from "react-helmet";

const TITLE = "Profile";

const Profile = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });

  const { username, name, email, about, images } = values;

  const [loading, setLoading] = useState(false);

  // Get query for graphql
  const { data } = useQuery(PROFILE);

  // Mutation hook for changing data in gql destruction userUpdate function
  const [userUpdate] = useMutation(USER_UPDATE, {
    //
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated!");
    },
  });

  const { state } = useContext(AuthContext);
  const { user } = state;

  // Push user information from query into local state
  useMemo(() => {
    if (data) {
      console.log(data);
      // const newData = omitDeep(data.profile.images, ["__typename"]);
      // console.log(newData);
      setValues({
        ...values,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: data.profile.images,
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    setLoading(true);

    // user Update mutation
    userUpdate({ variables: { input: values } });

    setLoading(false);
  };

  const handleChange = (e) => {
    // update state as user types
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        <div className="row">
          <div className="col-md-12 pb-3">
            {loading ? (
              <h4 className="text-danger">Loading...</h4>
            ) : (
              <h4>Profile</h4>
            )}
          </div>
          <FileUpload
            setLoading={setLoading}
            setValues={setValues}
            values={values}
            loading={loading}
          />
        </div>
        <UserProfile
          // Values contain all props that we need so only need to spread the values and send as props
          {...values}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Profile;
