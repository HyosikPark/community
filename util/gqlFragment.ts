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

export const ALLPOSTS_SORTBY_LIKE = gql`
  query allPostsSortByLike($category: String!, $curPage: Int!) {
    allPostsSortByLike(category: $category, curPage: $curPage) {
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
        content
      }
    }
  }
`;

export const ALLPOSTS_SORTBY_VIEWS = gql`
  query allPostsSortByViews($category: String!, $curPage: Int!) {
    allPostsSortByViews(category: $category, curPage: $curPage) {
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
        content
      }
    }
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
        content
      }
    }
  }
`;

export const HOTPOSTS = gql`
  {
    hotPosts {
      _id
      number
      category
      nickname
      title
      content
      createdAt
      commentCount
      likeCount
      views
      likeUser
    }
  }
`;

export const HOTPOSTSMUTATION = gql`
  mutation hotPosts($number: Int!) {
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
        views
        likeCount
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

export const SEARCH_BY_TITLE = gql`
  query searchByTitle($category: String!, $curPage: Int!, $value: String!) {
    searchByTitle(category: $category, curPage: $curPage, value: $value) {
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
        content
      }
    }
  }
`;

export const SEARCH_BY_CONTENT = gql`
  query searchByContent($category: String!, $curPage: Int!, $value: String!) {
    searchByContent(category: $category, curPage: $curPage, value: $value) {
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
        content
      }
    }
  }
`;

export const SEARCH_BY_TITLE_AND_CONTENT = gql`
  query searchByTitleAndContent(
    $category: String!
    $curPage: Int!
    $value: String!
  ) {
    searchByTitleAndContent(
      category: $category
      curPage: $curPage
      value: $value
    ) {
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
        content
      }
    }
  }
`;

export const SEARCH_BY_NICKNAME = gql`
  query searchByNickname($category: String!, $curPage: Int!, $value: String!) {
    searchByNickname(category: $category, curPage: $curPage, value: $value) {
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
        content
      }
    }
  }
`;

export const ISAUTH = gql`
  {
    isAuth
  }
`;
