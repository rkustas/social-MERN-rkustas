import Resizer from "react-image-file-resizer";
import axios from "axios";
import React, { Fragment, useContext } from "react";
import { AuthContext } from "../context/authContext";
import Image from "./Image";

const FileUpload = ({
  setLoading,
  setValues,
  values,
  loading,
  singleUpload = false,
}) => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  const fileResizeandUpload = (e) => {
    setLoading(true);
    // use file resizer
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          e.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            // console.log(uri);
            axios
              .post(
                `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: user.token,
                  },
                }
              )
              .then((response) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD SUCCESS", response);

                // Set values to parent component based on whether used for single or multiple image upload
                if (singleUpload) {
                  // Single upload

                  const { image } = values;

                  // Post response to state for single image
                  setValues({
                    ...values,
                    image: response.data,
                  });
                } else {
                  const { images } = values;

                  // Post response to state
                  setValues({
                    ...values,
                    images: [...images, response.data],
                  });
                }
              })
              .catch((error) => {
                setLoading(false);
                console.log("CLOUDINARY UPLOAD FAILED", error);
              });
          },
          "base64"
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  // console.log(username);

  const handleImageRemoval = (id) => {
    setLoading(true);
    // Remove image upon clicking on image, need to send headers due to middleware in the backend
    axios
      .post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        {
          public_id: id,
        },
        {
          headers: {
            authtoken: user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        // Set values to parent component based on whether used for single or multiple image upload
        if (singleUpload) {
          // For single image upload
          const { image } = values;
          setValues({
            ...values,
            image: {
              url: "",
              public_id: "",
            },
          });
        } else {
          // Figure out which image has been deleted and return images that are not equal to the id passed, set that to state
          const { images } = values;
          let filteredImages = images.filter((item) => {
            return item.public_id !== id;
          });
          setValues({
            ...values,
            images: filteredImages,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="row my-3">
      <div className="col-md-3">
        <div className="form-group">
          <label
            className="btn btn-raised btn-primary"
            style={{ cursor: "pointer" }}
          >
            Upload Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={fileResizeandUpload}
              className="form-control"
              placeholder="Image"
            />
          </label>
        </div>
      </div>
      <div className="col-md-9 text-center">
        {/* for single image upload */}
        {values.image && (
          <Image
            image={values.image}
            key={values.image.public_id}
            handleImageRemoval={handleImageRemoval}
          />
        )}
        {/* for multiple images */}
        {values.images &&
          values.images.map((image) => (
            <Image
              image={image}
              key={image.public_id}
              handleImageRemoval={handleImageRemoval}
            />
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
