import { gql } from '@apollo/client';

export const CREATEPOST = gql`
  mutation createPost(
    $nickname: String!
    $password: String!
    $title: String!
    $content: String!
  ) {
    createPost(
      postInput: {
        nickname: $nickname
        password: $password
        title: $title
        content: $content
      }
    ) {
      id
      nickname
      password
      title
      content
      createdAt
      comments {
        id
        nickname
        content
        createdAt
      }
      commentCount
      likeCount
    }
  }
`;
