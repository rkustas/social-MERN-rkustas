import React, { useContext, useRef, useState, useMemo } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Image from "./Image";
import { COMMENT_UPDATE } from "../graphql/mutations";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/client";
import Editable from "../components/Editable";
import { AuthContext } from "../context/authContext";
import { PROFILE } from "../graphql/queries";

const CommentCard = ({
  post,
  comment,
  showDeleteButton = false,
  handleDelete = (f) => f,
}) => {
  // Comment state
  const textareaRef = useRef();
  const [updatedComment, setComment] = useState({
    _id: comment._id,
    comment: comment.comment,
  });

  // User state
  const [dbuser, setUser] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });

  // Context
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;

  // Get query for graphql
  const { data } = useQuery(PROFILE);

  //  comment Update mutation
  const [commentUpdate] = useMutation(COMMENT_UPDATE, {
    variables: { postId: post._id },
  });

  const handleChange = (e) => {
    setComment({ ...updatedComment, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // console.log(updatedComment);
    // Update DB
    if (updatedComment.comment === comment.comment) {
      return;
    }
    commentUpdate({
      variables: {
        input: updatedComment,
      },
    })
      .then(() => toast.success("Comment Updated!"))
      .catch((err) => {
        if (err) {
          setComment({ ...updatedComment, comment: comment.comment });
          return toast.error(err.message);
        }
      });
  };

  // Push user information from query into local state
  useMemo(() => {
    if (data) {
      console.log(data);
      // const newData = omitDeep(data.profile.images, ["__typename"]);
      // console.log(newData);
      setUser({
        ...dbuser,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: data.profile.images,
      });
    }
  }, [data]);

  // User validation
  const validation = dbuser.username === comment.postedBy.username;

  return (
    <div className="row alert alert-secondary p-2 justify-content-between mx-0">
      <div className="col-md-4">
        <Link to={`/user/${comment.postedBy.username}`}>
          <h6 className="text-primary pt-2">@{comment.postedBy.username}</h6>
        </Link>
        <Image image={comment.postedBy.images[0]} />
      </div>
      <div className="col-md-8">
        <span className="pull-right text-warning">
          {moment(comment.createdAt).fromNow()}
        </span>
        <Editable
          text={updatedComment.comment}
          placeholder="Comment here...250 character limit"
          type="textarea"
          childRef={textareaRef}
        >
          <textarea
            ref={textareaRef}
            value={updatedComment.comment}
            name="comment"
            rows="5"
            className="md-textarea form-control p-2"
            placeholder="Comment here...250 character limit"
            maxLength="250"
            onChange={handleChange}
            style={{ border: "solid 1px black" }}
            onBlur={handleSubmit}
          />
        </Editable>
        {validation && showDeleteButton && (
          <button
            className="btn btn-raised btn-danger m-2"
            onClick={() => handleDelete(comment._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
