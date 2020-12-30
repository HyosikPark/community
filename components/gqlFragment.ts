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
    ) {
      _id
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
    }
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
