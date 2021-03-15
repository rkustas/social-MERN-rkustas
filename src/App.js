import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import Nav from "./components/Nav";
import { ToastContainer } from "react-toastify";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";

// All app components
import Home from "./pages/Home";
import Users from "./pages/Users";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import CompleteRegistration from "./pages/auth/CompleteRegistration";
import { AuthContext } from "./context/authContext";
import PrivateRoute from "./components/PrivateRoute";
import SearchResults from "./components/SearchResults";
import PasswordUpdate from "./pages/auth/PasswordUpdate";
import Profile from "./pages/auth/Profile";
import Post from "./pages/post/Post";
import PostUpdate from "./pages/post/PostUpdate";
import SinglePost from "./pages/post/SinglePost";
import PasswordForgot from "./pages/auth/PasswordForgot";
import PublicRoute from "./components/PublicRoute";
import SingleUser from "./pages/SingleUser";
import Notify from "./components/Notify";

const App = () => {
  // Can access user
  const { state } = useContext(AuthContext);
  const { user } = state;

  // Create websocket link
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
    options: {
      reconnect: true,
    },
  });

  // Create http link
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });

  // Set context for authtoken
  const authLink = setContext(() => {
    return {
      headers: {
        authtoken: user ? user.token : "",
      },
    };
  });

  // concat http and authtoken
  const httpAuthLink = authLink.concat(httpLink);

  // Split http link or websocket link
  const link = split(
    ({ query }) => {
      // Split link based on operation type http or websocket
      const definition = getMainDefinition(query);
      //
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpAuthLink
  );

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  // // Create client
  // const cache = new InMemoryCache();

  // const client = new ApolloClient({
  //   cache,
  //   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  //   headers: {
  //     authtoken: user ? user.token : "",
  //   },
  // });
  // console.log(client);

  return (
    <ApolloProvider client={client}>
      <Nav />
      <Notify />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <PublicRoute exact path="/register" component={Register} />
        <Route
          exact
          path="/complete-registration"
          component={CompleteRegistration}
        />
        <PublicRoute exact path="/login" component={Login} />
        <Route exact path="/password/forgot" component={PasswordForgot} />
        <PrivateRoute
          exact
          path="/password/update"
          component={PasswordUpdate}
        />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/post/create" component={Post} />
        <PrivateRoute
          exact
          path="/post/update/:postid"
          component={PostUpdate}
        />
        <Route exact path="/user/:username" component={SingleUser} />
        <Route exact path="/post/:postid" component={SinglePost} />
        <Route exact path="/search/:query" component={SearchResults} />
      </Switch>
    </ApolloProvider>
  );
};

export default App;
