import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { SINGLE_POST } from "../../graphql/queries";
import { useParams } from "react-router";
import FileUpload from "../../components/FileUpload";
import PostCard from "../../components/PostCard";
import { Helmet } from "react-helmet";

const TITLE = "User Post";

const SinglePost = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
    postedBy: {},
  });

  //   Use params from router
  const { postid } = useParams();

  // useLazy query and get singlePost as data as well as getSinglePost function
  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  // console.log(singlePost);

  //   State upon loading page
  useMemo(() => {
    if (singlePost) {
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
        postedBy: singlePost.singlePost.postedBy,
      });
    }
  }, [singlePost]);

  //   Pass id to query
  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });
  }, []);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="container p-5">
        <PostCard post={values} showCommentCard={true} />
      </div>
    </>
  );
};

export default SinglePost;
