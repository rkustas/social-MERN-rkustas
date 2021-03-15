import { USER_INFO, POST_DATA, COMMENT_DATA } from "./fragments";
import { gql } from "@apollo/client";

// Write query from gql
export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

// All Posts
export const GET_ALL_POSTS = gql`
  query allPosts($page: Int!) {
    allPosts(page: $page) {
      ...postData
    }
  }
  ${POST_DATA}
`;

// All users
export const ALL_USERS = gql`
  query {
    allUsers {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

// Get single user posts
export const POSTS_BY_USER = gql`
  query {
    postsByUser {
      ...postData
    }
  }
  ${POST_DATA}
`;

// Get single post
export const SINGLE_POST = gql`
  query singlePost($postId: String!) {
    singlePost(postId: $postId) {
      ...postData
    }
  }
  ${POST_DATA}
`;

export const TOTAL_POSTS = gql`
  query {
    totalPosts
  }
`;

export const SEARCH = gql`
  query search($query: String!) {
    search(query: $query) {
      ...postData
    }
  }
  ${POST_DATA}
`;

// Public profile query
export const PUBLIC_PROFILE = gql`
  query publicProfile($username: String!) {
    publicProfile(username: $username) {
      _id
      username
      name
      email
      images {
        url
        public_id
      }
      about
    }
  }
`;

// Get single user posts
export const COMMENTS_BY_POST = gql`
  query commentsByPost($postId: String!) {
    commentsByPost(postId: $postId) {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;

// All comments
export const GET_ALL_COMMENTS = gql`
  query {
    allComments {
      ...commentData
    }
  }
  ${COMMENT_DATA}
`;

export const TOTAL_COMMENTS_BY_POST = gql`
  query totalCommentsPerPost($postId: String!) {
    totalCommentsPerPost(postId: $postId)
  }
`;
