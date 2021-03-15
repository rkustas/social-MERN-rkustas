import { USER_INFO, POST_DATA, COMMENT_DATA } from "./fragments";
import { gql } from "@apollo/client";

// Mutation to update user profile, check backend for clarifications
export const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const POST_CREATE = gql`
  mutation postCreate($input: PostCreateInput!) {
    postCreate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const POST_DELETE = gql`
  mutation postDelete($postId: String!) {
    postDelete(postId: $postId) {
      _id
    }
  }
`;

export const POST_UPDATE = gql`
  mutation postUpdate($input: PostUpdateInput!) {
    postUpdate(input: $input) {
      ...postData
    }
  }
  ${POST_DATA}
`;

// Mutation
export const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

export const COMMENT_CREATE = gql`
  mutation commentCreate($postId: String!, $input: CommentCreateInput!) {
    commentCreate(postId: $postId, input: $input) {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;

export const COMMENT_UPDATE = gql`
  mutation commentUpdate($input: CommentUpdateInput!) {
    commentUpdate(input: $input) {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;

export const COMMENT_DELETE = gql`
  mutation commentDelete($commentId: String!) {
    commentDelete(commentId: $commentId) {
      _id
    }
  }
`;
