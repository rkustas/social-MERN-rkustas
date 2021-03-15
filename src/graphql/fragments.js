import { gql } from "@apollo/client";

// GQL fragments
export const USER_INFO = gql`
  fragment userInfo on User {
    _id
    name
    username
    email
    images {
      url
      public_id
      __typename @skip(if: true)
    }
    about
    createdAt
    updatedAt
  }
`;

export const POST_DATA = gql`
  fragment postData on Post {
    _id
    content
    image {
      url
      public_id
      __typename @skip(if: true)
    }
    postedBy {
      _id
      username
    }
  }
`;

export const COMMENT_DATA = gql`
  fragment commentData on Comment {
    _id
    comment
    createdAt
    postedBy {
      _id
      username
      email
      images {
        url
        public_id
      }
    }
    post {
      _id
      content
      image {
        url
        public_id
        __typename @skip(if: true)
      }
      postedBy {
        _id
        username
        images {
          url
          public_id
        }
      }
    }
  }
`;
