import React, { useState } from 'react';
import Layout from '../../components/layout';
import QuillEditor from '../../components/quill';

function Post() {
  const [value, setValue] = useState('');

  return (
    <>
      <Layout />
      <div className='post_container'>
        <div className='auth'>
          <input
            type='text'
            name='nickname'
            className='nickname'
            placeholder='nickname'
          />
          <input
            type='password'
            name='password'
            className='password'
            placeholder='password'
          />
        </div>
        <h3>You must enter a password to modify or delete the post.</h3>
        <input
          className='title'
          type='text'
          placeholder='Please enter a title.'
        />
        <QuillEditor />
      </div>
    </>
  );
}

export default React.memo(Post);
