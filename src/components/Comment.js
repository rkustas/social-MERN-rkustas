import {
  useMutation,
  useQuery,
  useSubscription,
  useLazyQuery,
} from "@apollo/client";
import React, { useRef, useContext, useState } from "react";
import { COMMENT_CREATE, COMMENT_DELETE } from "../graphql/mutations";
import { COMMENTS_BY_POST, TOTAL_COMMENTS_BY_POST } from "../graphql/queries";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import CommentCard from "./CommentCard.js";
import Editable from "../components/Editable";
// import CommentPagination from "./CommentPagination";
import {
  COMMENT_ADDED,
  COMMENT_UPDATED,
  COMMENT_DELETED,
} from "../graphql/subscriptions";

const Comment = ({ post }) => {
  const initialState = {
    comment: "",
  };

  //   Context
  const { state } = useContext(AuthContext);
  const { user } = state;

  // Page as state variable
  // const [page, setPage] = useState(1);

  // Editable ref
  const textareaRef = useRef();

  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  //   Get comments query
  const { data: comments } = useQuery(COMMENTS_BY_POST, {
    variables: { postId: post._id },
  });

  // Lazy query for function to bring in all comments by post
  const [fetchComments, { data: commentsData }] = useLazyQuery(
    COMMENTS_BY_POST,
    {
      variables: { postId: post._id },
    }
  );

  // Total comments per post
  // const { data: commentCount } = useQuery(TOTAL_COMMENTS_BY_POST, {
  //   variables: { postId: post._id },
  // });

  //   Mutation comment create
  const [commentCreate] = useMutation(COMMENT_CREATE, {
    // update cache and append to cache for instant changes to ui
    update: (cache, { data: { commentCreate } }) => {
      // readQuery the cache
      const { commentsByPost } = cache.readQuery({
        query: COMMENTS_BY_POST,
        variables: {
          postId: post._id,
        },
      });
      // Write a query to cache and append new post
      cache.writeQuery({
        query: COMMENTS_BY_POST,
        variables: {
          postId: post._id,
        },
        data: {
          commentsByPost: [commentCreate, ...commentsByPost], // append new comment to old comments
        },
      });
    },
    onError: (err) => console.log(err),
  });

  // Mutation comment delete
  const [commentDelete] = useMutation(COMMENT_DELETE, {
    update: ({ data }) => {
      // Log mutated data
      console.log("COMMENT DELETE MUTATION", data);
      toast.success("Comment Deleted!");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create comment on submit
    setLoading(true);
    commentCreate({
      variables: {
        input: values,
        postId: post._id,
      },
    });
    setValues(initialState);
    setLoading(false);
    toast.success("Comment created!");
  };

  // Subscriptions commentAdded
  const { data: newComment } = useSubscription(COMMENT_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);

      // readquery from cache, all existing posts
      const { commentsByPost } = cache.readQuery({
        query: COMMENTS_BY_POST,
        variables: { postId: post._id },
      });

      // writeback to cache with a new post
      cache.writeQuery({
        query: COMMENTS_BY_POST,
        variables: { postId: post._id },
        data: {
          commentsByPost: [...data.commentAdded, ...commentsByPost],
        },
      });

      // refetch all posts to update ui
      fetchComments({
        variables: { postId: post._id },
        refetchQueries: [
          { query: COMMENTS_BY_POST, variables: { postId: post._id } },
        ],
      });

      // show toast notification
      toast.success("New comment!");
    },
  });

  // Subscriptions commentUpdated already in local cache
  const { data: updatedComment } = useSubscription(COMMENT_UPDATED, {
    onSubscriptionData: () => {
      // show toast notification
      toast.success("Comment Updated!");
    },
  });

  // Subscriptions commentDeleted
  const { data: deletedComment } = useSubscription(COMMENT_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data);

      // readquery from cache, all existing posts
      const { commentsByPost } = cache.readQuery({
        query: COMMENTS_BY_POST,
        variables: { postId: post._id },
      });

      // Create new array of posts and filtered out the one that has been deleted
      let filteredComments = commentsByPost.filter(
        (comment) => comment._id !== data.commentDeleted._id
      );
      // writeback to cache with a new post
      cache.writeQuery({
        query: COMMENTS_BY_POST,
        variables: { postId: post._id },
        data: {
          commentsByPost: filteredComments,
        },
      });

      // refetch all posts to update ui
      fetchComments({
        variables: { postId: post._id },
        refetchQueries: [
          { query: COMMENTS_BY_POST, variables: { postId: post._id } },
        ],
      });

      // show toast notification
      toast.success("Comment Deleted!");
    },
  });

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleDelete = (commentId) => {
    // Window popup before delete
    let answer = window.confirm("Delete?");
    if (answer) {
      setLoading(true);
      // Delete post and refetch queries, another way to instantly update
      commentDelete({
        variables: { commentId },
        refetchQueries: [
          {
            query: COMMENTS_BY_POST,
            variables: {
              postId: post._id,
            },
          },
        ],
      });
      setLoading(false);
    }
  };

  const createComment = () => (
    <form onSubmit={handleSubmit}>
      <Editable
        text={values.comment}
        placeholder="Click here to comment"
        type="textarea"
        childRef={textareaRef}
      >
        <textarea
          ref={textareaRef}
          value={values.comment}
          name="comment"
          rows="5"
          className="md-textarea form-control p-2"
          placeholder="250 character max"
          maxLength="250"
          onChange={handleChange}
          style={{ border: "solid 1px black" }}
        />
      </Editable>
      <button
        className="btn btn-raised btn-primary float-right"
        type="submit"
        disabled={!user || !values.comment}
      >
        {user ? "Post" : "Login to Comment"}
      </button>
    </form>
  );

  return (
    <div className="container">
      {loading ? <h4 className="text-danger">Loading...</h4> : ""}
      {comments &&
        comments.commentsByPost.map((comment) => (
          <div key={comment._id}>
            {
              <CommentCard
                post={post}
                comment={comment}
                showDeleteButton={true}
                handleDelete={handleDelete}
              />
            }
          </div>
        ))}
      {createComment()}
      {/* <CommentPagination
        page={page}
        setPage={setPage}
        commentCount={commentCount}
      /> */}
    </div>
  );
};

export default Comment;
