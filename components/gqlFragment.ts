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

export const EDITPOST = gql`
  mutation editPost(
    $category: String!
    $number: Int!
    $nickname: String!
    $password: String!
    $title: String!
    $content: String!
  ) {
    editPost(
      editInput: {
        category: $category
        number: $number
        nickname: $nickname
        password: $password
        title: $title
        content: $content
      }
    )
  }
`;

export const DELETEPOST = gql`
  mutation deletePost($category: String!, $number: Int!) {
    deletePost(category: $category, number: $number)
  }
`;

export const ALLPOSTS = gql`
  query allPosts($category: String!, $curPage: Int!) {
    allPosts(category: $category, curPage: $curPage) {
      postCount
      postInfo {
        _id
        number
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

export const HOTPOSTS = gql`
  query hotPosts($number: Int!) {
    hotPosts(number: $number) {
      _id
      number
      category
      nickname
      password
      title
      content
      createdAt
      comments {
        _id
        nickname
        password
        content
        createdAt
      }
      commentCount
      likeCount
      views
      likeUser
      ip
    }
  }
`;

export const GETPOST = gql`
  query getPost($category: String!, $number: Int!) {
    getPost(category: $category, number: $number) {
      post {
        _id
        number
        category
        nickname
        password
        title
        content
        createdAt
        comments {
          _id
          nickname
          password
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

export const CREATECOMMENT = gql`
  mutation createComment(
    $category: String!
    $number: Int!
    $nickname: String!
    $password: String!
    $content: String!
  ) {
    createComment(
      commentInput: {
        category: $category
        number: $number
        nickname: $nickname
        password: $password
        content: $content
      }
    ) {
      _id
      nickname
      password
      content
      createdAt
    }
  }
`;

export const DELETECOMMENT = gql`
  mutation deleteComment($category: String!, $number: Int!, $_id: ID!) {
    deleteComment(category: $category, number: $number, _id: $_id)
  }
`;
