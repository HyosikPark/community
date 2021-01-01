import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Comment {
    _id: ID!
    nickname: String!
    content: String!
    createdAt: String!
  }

  type Post {
    _id: ID!
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

  type Query {
    allPosts(category: String!, curPage: Int!): AllPosts!
    getPost(category: String!, number: Int!): getPost!
  }
  type Mutation {
    createPost(postInput: PostInput): Int!
    likePost(category: String!, number: Int!): Boolean!
    unlikePost(category: String!, number: Int!): Boolean!
  }
`;

export default typeDefs;
