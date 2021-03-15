import React, { useState } from "react";
import Image from "./Image";
import { Link, useHistory } from "react-router-dom";
import Comment from "../components/Comment";
import { useQuery } from "@apollo/client";
import { COMMENTS_BY_POST, TOTAL_COMMENTS_BY_POST } from "../graphql/queries";

const PostCard = ({
  post,
  showUpdateButton = false,
  showDeleteButton = false,
  showCommentCard = false,
  handleDelete = (f) => f, // by default function, do this so this function is not available on the home page
}) => {
  const { content, image, postedBy } = post;

  const history = useHistory();

  return (
    <div className="card text-center" style={{ minHeight: "375px" }}>
      <div className="card-body">
        <Link to={`/post/${post._id}`}>
          <Image image={image} />
        </Link>
        <h4 className="text-primary">@{postedBy.username}</h4>
        <hr />
        <h5 className="text-capitalize">{content}</h5>
        <br />
        <br />
        {showDeleteButton && (
          <button
            className="btn btn-raised btn-danger m-2"
            onClick={() => handleDelete(post._id)}
          >
            Delete
          </button>
        )}
        {showUpdateButton && (
          <button
            className="btn btn-raised btn-warning m-2"
            onClick={() => history.push(`/post/update/${post._id}`)}
          >
            Update
          </button>
        )}
        {showCommentCard && <Comment post={post} />}
      </div>
    </div>
  );
};

export default PostCard;
