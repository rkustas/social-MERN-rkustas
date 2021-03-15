import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyQuery, useMutation } from "@apollo/client";
import { POST_UPDATE } from "../../graphql/mutations";
import { SINGLE_POST } from "../../graphql/queries";
import { useParams } from "react-router";
import FileUpload from "../../components/FileUpload";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";

const TITLE = "Update Post";

const PostUpdate = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
  });
  const { content } = values;

  // useLazy query and get singlePost as data as well as getSinglePost function
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [loading, setLoading] = useState(false);

  //  useMutation
  const [postUpdate] = useMutation(POST_UPDATE);

  // History
  const history = useHistory();

  //   Use params from router
  const { postid } = useParams();

  //   State upon loading page
  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
      });
    }
  }, [singlePost]);

  //   Pass id to query
  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Execute mutation
    postUpdate({ variables: { input: values } });
    setLoading(false);
    toast.success("Post Updated!");
    history.push("/post/create");
  };

  const handleChange = (e) => {
    // update state
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const updateForm = () => (
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
          style={{ border: "solid 1px black" }}
          disabled={loading}
        ></textarea>
      </div>
      <button
        className="btn btn-raised btn-primary btn-block"
        type="submit"
        disabled={loading || !content}
      >
        Update
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
          <h4>Update</h4>
        )}
        <FileUpload
          values={values}
          loading={loading}
          setValues={setValues}
          setLoading={setLoading}
          singleUpload={true}
        />
        {updateForm()}
      </div>
    </>
  );
};

export default PostUpdate;
