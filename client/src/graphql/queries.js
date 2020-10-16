import gql from 'graphql-tag';
export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        body
      }
      createAt
    }
  }
`;
export const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createAt
        body
      }
    }
  }
`;