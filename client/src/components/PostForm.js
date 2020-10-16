import React from 'react';
import { useForm } from '../util/hook';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_POST } from '../graphql/mutation';
import { Button, Form } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../graphql/queries'

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createCallback, {
    body: ''
  })
  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      // method cho phép bạn run Graphql query trực tiếp trên cache
      // https://www.apollographql.com/docs/react/caching/cache-interaction/
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      // data.getPosts = [result.data.getPost, ...data.getPosts];
      proxy.writeData({
        query: FETCH_POSTS_QUERY,
        data : {
          getPosts: [...data.getPosts, result.data.createPost]
        }
      })
      values.body = ''
    }
  })
  function createCallback (){
    createPost()
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Write a content"
            name="body"
            onChange={onChange}
            value={values.body}
            error= {error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {
        error && (
          <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
          </div>
        )
      }
    </>
  );
};

export default PostForm;