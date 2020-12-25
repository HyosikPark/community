import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type RegisterUser {
    id: ID!
    email: String!
    nickname: String!
    createdAt: String!
  }
  type Post {
    id: ID!
    nickname: String!
    password: String!
    title: String!
    createdAt: String!
  }

  type Query {
    users: RegisterUser!
  }
  type Mutation {
    createPost: 
  }
`;

export default typeDefs;
