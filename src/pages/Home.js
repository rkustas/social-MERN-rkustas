import React, { useContext, useState } from "react";
import { useQuery, useLazyQuery, useSubscription } from "@apollo/client";
import { gql } from "@apollo/client";
import { AuthContext } from "../context/authContext";
import { useHistory } from "react-router-dom";
import {
  GET_ALL_COMMENTS,
  GET_ALL_POSTS,
  TOTAL_POSTS,
} from "../graphql/queries";
import {
  POST_ADDED,
  POST_UPDATED,
  POST_DELETED,
  COMMENT_ADDED,
  COMMENT_UPDATED,
  COMMENT_DELETED,
} from "../graphql/subscriptions";
import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const TITLE = "Home";

const Home = () => {
  // Page as state variable
  const [page, setPage] = useState(1);
  // UseQuery results
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });

  // Query all comments
  const { data: allComments } = useQuery(GET_ALL_COMMENTS);

  // Total posts
  const { data: postCount } = useQuery(TOTAL_POSTS);

  // Subscription for all comments
  const { data: newComment } = useSubscription(COMMENT_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);

      // readquery from cache, all existing posts
      const { allComments } = cache.readQuery({
        query: GET_ALL_COMMENTS,
      });

      // writeback to cache with a new post
      cache.writeQuery({
        query: GET_ALL_COMMENTS,
        data: {
          allComments: [...data.commentAdded, ...allComments],
        },
      });

      // refetch all posts to update ui
      fetchComments({
        refetchQueries: [{ query: allComments }],
      });

      // show toast notification
      toast.success("New comment!");
    },
  });

  // Subscription to update all comments
  const { data: updatedComment } = useSubscription(COMMENT_UPDATED, {
    onSubscriptionData: () => {
      // show toast notification
      toast.success("Comment Updated!");
    },
  });

  // Subscription to delete comments
  const { data: deletedComment } = useSubscription(COMMENT_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);

      // readquery from cache, all existing posts
      const { allComments } = cache.readQuery({
        query: GET_ALL_COMMENTS,
      });

      // Create new array of posts and filtered out the one that has been deleted
      let filteredComments = allComments.filter(
        (comment) => comment._id !== data.commentDeleted._id
      );
      // writeback to cache with a new post
      cache.writeQuery({
        query: GET_ALL_COMMENTS,
        data: {
          allComments: filteredComments,
        },
      });

      // refetch all posts to update ui
      fetchComments({
        refetchQueries: [{ query: GET_ALL_COMMENTS }],
      });

      // show toast notification
      toast.success("Comment Deleted!");
    },
  });

  // Subscription query postAdded
  const { data: newPost } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);

      // readquery from cache, all existing posts
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      // writeback to cache with a new post
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [...data.postAdded, ...allPosts],
        },
      });

      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      // show toast notification
      toast.success("New post!");
    },
  });

  // Subscription query postUpdated, already in local cache, no need to write and read
  const { data: updatedPost } = useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      // show toast notification
      toast.success("Post Updated!");
    },
  });

  // Subscription query postDeleted
  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);

      // readquery from cache, all existing posts
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });

      // Create new array of posts and filtered out the one that has been deleted
      let filteredPosts = allPosts.filter(
        (post) => post._id !== data.postDeleted._id
      );
      // writeback to cache with a new post
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPosts,
        },
      });

      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      // show toast notification
      toast.success("Post Deleted!");
    },
  });

  //   Lazy query for clicking on button to load posts
  const [fetchPosts, { data: postsData }] = useLazyQuery(GET_ALL_POSTS);

  // Get all comments, lazy
  const [fetchComments, { data: commentsData }] = useLazyQuery(
    GET_ALL_COMMENTS
  );

  //   Access context
  const { state, dispatch } = useContext(AuthContext);

  //   React router
  let history = useHistory();

  // Example of using dispatch
  const updateUserName = () => {
    dispatch({
      type: "LOGGED_IN_USER",
      payload: "Ryan Kustas",
    });
  };

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
            data.allPosts.map((post) => (
              <div className="col-md-4 pt-5" key={post._id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>
        <PostPagination page={page} setPage={setPage} postCount={postCount} />
      </div>
    </>
  );
};

export default Home;
