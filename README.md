## K-pop community

a community site for foreigners who like K-pop. You can use the site anonymously without the need for membership.

## Stack

1. Next.js
2. TypeScript
3. GraphQL Apollo
4. Mongo DB
5. Quill Editor
6. AWS S3

## Features

> ### HomePage

- The posts images were lazy loaded to improve performance and implemented as an infinite scroll using intersectionObserver.<br>
- The posts are arranged in order of likeCount.
- It was implemented as a server-side rendering for SEO.

> ### Category

- Each artist's general is arranged alphabetically.
- You can search for artists without case distinction.

> ### General

- Because all general are similar in shape, I made it into a dynamic page.
- You can search for posts with titles, contents, nicknames, etc.
- You can view the posts in order of latest, popular, and views.

> ### Write

- When you write a post, you can enter your nickname and password and write freely.

> ### Post

- You can modify or delete a post by entering the password you set.
- If you press the heart mark, the popularity of the post goes up. The server remembers the ip of the person who clicked the heart, so only one like is possible per computer.
- You can leave comments freely

## post Schema

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
