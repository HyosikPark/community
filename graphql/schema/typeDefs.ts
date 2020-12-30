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

  type Query {
    allPosts(category: String!, curPage: Int!): AllPosts
  }
  type Mutation {
    createPost(postInput: PostInput): Post!
  }
`;

export default typeDefs;
