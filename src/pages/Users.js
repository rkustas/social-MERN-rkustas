import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "../graphql/queries";
import UserCard from "../components/UserCard";
import { Helmet } from "react-helmet";

const TITLE = "Users";

const Users = () => {
  // UseQuery results
  const { data, loading, error } = useQuery(ALL_USERS);

  if (loading) {
    return <p className="p-5">Loading...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container">
        <div className="row p-5">
          {data &&
            data.allUsers.map((user) => (
              <div className="col-md-4 pt-5" key={user._id}>
                <UserCard user={user} />
              </div>
            ))}
        </div>
        <div className="row p-5"></div>
      </div>
    </>
  );
};

export default Users;
