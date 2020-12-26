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
    nickname: String!
    password: String!
    title: String!
    content: String!
    createdAt: String!
    comments: [Comment]!
    commentCount: Int!
    likeCount: Int!
  }

  input PostInput {
    nickname: String!
    password: String!
    title: String!
    content: String!
  }

  type Query {
    allPosts: [Post!]
  }
  type Mutation {
    createPost(postInput: PostInput): Post!
  }
`;

export default typeDefs;
