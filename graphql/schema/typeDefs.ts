import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Comment {
    _id: ID!
    nickname: String!
    password: String!
    content: String!
    createdAt: String!
    ip: String!
  }

  type Post {
    _id: ID!
    number: Int!
    category: String!
    nickname: String!
    password: String!
    title: String!
    content: String!
    createdAt: String!
    comments: [Comment]!
    commentCount: Int!
    likeCount: Int!
    views: Int!
    likeUser: [String]!
    ip: String!
  }

  input PostInput {
    nickname: String!
    password: String!
    title: String!
    content: String!
    category: String!
  }

  type AllPosts {
    postCount: Int!
    postInfo: [Post!]
  }

  type getPost {
    alreadyLike: Boolean!
    post: Post!
  }

  input CommentInput {
    category: String!
    number: Int!
    nickname: String!
    password: String!
    content: String!
  }

  input EditInput {
    category: String!
    number: Int!
    nickname: String!
    password: String!
    title: String!
    content: String!
  }

  type Query {
    allPosts(category: String!, curPage: Int!): AllPosts!
    allPostsSortByLike(category: String!, curPage: Int!): AllPosts!
    allPostsSortByViews(category: String!, curPage: Int!): AllPosts!
    hotPosts: [Post!]
    getPost(category: String!, number: Int!): getPost!
  }

  type Mutation {
    createPost(postInput: PostInput): Int!
    editPost(editInput: EditInput): Boolean!
    deletePost(category: String!, number: Int!): Boolean!
    likePost(category: String!, number: Int!): Boolean!
    unlikePost(category: String!, number: Int!): Boolean!
    createComment(commentInput: CommentInput): Comment!
    deleteComment(category: String!, number: Int!, _id: ID!): Boolean!
    hotPosts(number: Int!): [Post!]
  }
`;

export default typeDefs;
