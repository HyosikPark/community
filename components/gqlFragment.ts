import { gql } from '@apollo/client';

export const CREATEPOST = gql`
  mutation createPost(
    $nickname: String!
    $password: String!
    $title: String!
    $content: String!
    $category: String!
  ) {
    createPost(
      postInput: {
        nickname: $nickname
        password: $password
        title: $title
        content: $content
        category: $category
      }
    )
  }
`;

export const ALLPOSTS = gql`
  query allPosts($category: String!, $curPage: Int!) {
    allPosts(category: $category, curPage: $curPage) {
      postCount
      postInfo {
        _id
        nickname
        title
        createdAt
        commentCount
        likeCount
        views
      }
    }
  }
`;

export const GETPOST = gql`
  query getPost($category: String!, $number: Int!) {
    getPost(category: $category, number: $number) {
      post {
        _id
        category
        nickname
        password
        title
        content
        createdAt
        comments {
          _id
          nickname
          content
          createdAt
        }
        commentCount
        likeCount
        views
        likeUser
      }
      alreadyLike
    }
  }
`;

export const LIKEPOST = gql`
  mutation likePost($category: String!, $number: Int!) {
    likePost(category: $category, number: $number)
  }
`;

export const UNLIKEPOST = gql`
  mutation unlikePost($category: String!, $number: Int!) {
    unlikePost(category: $category, number: $number)
  }
`;
