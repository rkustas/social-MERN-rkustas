import React, { useState, useContext, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation } from "@apollo/client";
import FileUpload from "../../components/FileUpload";
import { POST_CREATE, POST_DELETE } from "../../graphql/mutations";
import { POSTS_BY_USER } from "../../graphql/queries";
import PostCard from "../../components/PostCard";
import { Helmet } from "react-helmet";

const TITLE = "Post";

const Post = () => {
  const initialState = {
    content: "",
    image: {
      url: "https://via.placeholder.com/200x200.png?text=Post",
      public_id: "123",
    },
  };
  // State
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // queries
  const { data: posts } = useQuery(POSTS_BY_USER);

  const { content, image } = values;

  // Mutation post create
  const [postCreate] = useMutation(POST_CREATE, {
    // update cache and append to cache for instant changes to ui
    update: (cache, { data: { postCreate } }) => {
      // readQuery the cache
      const { postsByUser } = cache.readQuery({
        query: POSTS_BY_USER,
      });
      // Write a query to cache and append new post
      cache.writeQuery({
        query: POSTS_BY_USER,
        data: {
          postsByUser: [postCreate, ...postsByUser], // append new post to old posts
        },
      });
    },
    onError: (err) => console.log(err),
  });

  // Mutation post delete
  const [postDelete] = useMutation(POST_DELETE, {
    update: ({ data }) => {
      // Log mutated data
      console.log("POST DELETE MUTATION", data);
      toast.success("Post Deleted!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Post delete failed");
    },
  });

  const handleDelete = async (postId) => {
    // Window popup before delete
    let answer = window.confirm("Delete?");
    if (answer) {
      setLoading(true);
      // Delete post and refetch queries, another way to instantly update
      postDelete({
        variables: { postId },
        refetchQueries: [{ query: POSTS_BY_USER }],
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create post using the current values state as the variable
    postCreate({ variables: { input: values } });
    // Clear state
    setValues(initialState);
    setLoading(false);
    toast.success("Post created!");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const createForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <textarea
          value={content}
          onChange={handleChange}
          name="content"
          rows="10"
          className="md-textarea form-control p-2"
          placeholder="Write something cool"
          maxLength="150"
          disabled={loading}
          style={{ border: "solid 1px black" }}
        ></textarea>
      </div>
      <button
        className="btn btn-raised btn-primary btn-block"
        type="submit"
        disabled={loading || !content}
      >
        Post
      </button>
    </form>
  );
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>Create</h4>
        )}
        <FileUpload
          values={values}
          loading={loading}
          setValues={setValues}
          setLoading={setLoading}
          singleUpload={true}
        />
        <div className="row">
          <div className="col">{createForm()}</div>
        </div>
        <hr />
        {posts &&
          posts.postsByUser.map((post) => (
            <div className="posts" key={post._id}>
              <PostCard
                post={post}
                showUpdateButton={true}
                showDeleteButton={true}
                handleDelete={handleDelete}
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default Post;
