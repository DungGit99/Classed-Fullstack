import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {FETCH_POSTS_QUERY} from '../graphql/queries'
import { Grid } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import '../App.css';

const Home = () => {
  const {loading,data:dataPosts} = useQuery(FETCH_POSTS_QUERY);
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          dataPosts &&
          dataPosts.getPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;