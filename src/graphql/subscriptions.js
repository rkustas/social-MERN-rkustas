import { POST_DATA, COMMENT_DATA } from "./fragments";
import { gql } from "@apollo/client";

// Subscription
export const POST_ADDED = gql`
  subscription {
    postAdded {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_UPDATED = gql`
  subscription {
    postUpdated {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_DELETED = gql`
  subscription {
    postDeleted {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const COMMENT_ADDED = gql`
  subscription {
    commentAdded {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;

export const COMMENT_UPDATED = gql`
  subscription {
    commentUpdated {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;

export const COMMENT_DELETED = gql`
  subscription {
    commentDeleted {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;
