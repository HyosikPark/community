## K-pop community

It is a community site for foreigners who like K-pop. You can use the site anonymously without the need for membership.

### Stack

1. Next.js
2. TypeScript
3. GraphQL Apollo
4. Mongo DB
5. Quill Editor
6. AWS S3

### post Schema

```
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

  type Comment {
    _id: ID!
    nickname: String!
    password: String!
    content: String!
    createdAt: String!
    ip: String!
  }
```
