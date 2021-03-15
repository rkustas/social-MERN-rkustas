import React from "react";

const Image = ({ image, handleImageRemoval = (f) => f }) => (
  <img
    src={image.url}
    key={image.public_id}
    alt={image.public_id}
    style={{ height: "100px" }}
    className="img-thumbnail m-3"
    onClick={() => handleImageRemoval(image.public_id)}
  />
);

export default Image;
