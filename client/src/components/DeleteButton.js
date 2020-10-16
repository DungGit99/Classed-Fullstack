import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { DELETE_POST, DELETE_COMMENT } from '../graphql/mutation';
import { FETCH_POSTS_QUERY } from '../graphql/queries';

const DeleteButton = ({ postId, callback, commentId }) => {
  const [ confirmOpen, setConfirmOpen ] = useState(false)
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST
  const [deletePostOrComment] = useMutation(mutation,{
    variables: {
      postId,
      commentId
    },
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = data.getPosts.filter( p => p.id !== postId)
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data
      })
      if (callback) callback();
    }
  })
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick = {() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

export default DeleteButton;