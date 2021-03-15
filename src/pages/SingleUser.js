import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import UserCard from "../components/UserCard";
import { PUBLIC_PROFILE } from "../graphql/queries";
import { Helmet } from "react-helmet";

const TITLE = "User";

const SingleUser = () => {
  //   Grab page params
  let params = useParams();

  // Execute the query and pass username as a variable
  const { loading, data } = useQuery(PUBLIC_PROFILE, {
    variables: { username: params.username },
  });

  if (loading) {
    return <p className="p-5">Loading...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container">
        <br />
        <br />
        <UserCard user={data.publicProfile} />
      </div>
    </>
  );
};

export default SingleUser;
