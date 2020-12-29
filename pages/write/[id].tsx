import React, { useCallback, useState } from 'react';
// import Layout from '../../components/layout';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { CREATEPOST } from '../../components/gqlFragment';
import { useMutation } from '@apollo/client';
import Head from 'next/head';

const Editor: React.ComponentType<any> = dynamic(
  () => {
    return new Promise((resolve) =>
      import('froala-editor/js/plugins.pkgd.min.js').then((e) => {
        import('react-froala-wysiwyg').then(resolve);
      })
    );
  },
  {
    loading: () => null,
    ssr: false,
  }
);

function Write() {
  const router = useRouter();
  const star = router.query.id;
  const [value, setValue] = useState({
    nickname: '',
    password: '',
    title: '',
    content: '',
  });
  const [createPost, { loading }] = useMutation(CREATEPOST, {
    variables: { ...value, category: `${star}` },
    onError(err) {
      console.log(err.message);
    },
    onCompleted(data) {
      window.location.href = `/board/${star}/${data.createPost._id}`;
    },
  });
  const changeValue = useCallback(
    (e) => {
      if (e.target)
        setValue({
          ...value,
          [e.target.name]: e.target.value,
        });
      else
        setValue({
          ...value,
          content: e,
        });
    },
    [value]
  );

  const onSubmit = useCallback((e) => {
    e.target.disabled = true;
    e.target.style.opacity = '0.4';
    createPost();
  }, []);

  const backToBoard = useCallback((e) => {
    e.target.disabled = true;
    router.back();
  }, []);

  return (
    <>
      {/* <Layout /> */}
      <div className='post_container'>
        <div>
          <div className='auth'>
            <input
              type='text'
              name='nickname'
              className='nickname'
              placeholder='nickname'
              value={value.nickname}
              onChange={changeValue}
            />
            <input
              type='password'
              name='password'
              className='password'
              placeholder='password'
              value={value.password}
              onChange={changeValue}
            />
          </div>
          <h3>You must enter a password to modify or delete the post.</h3>
          <input
            className='title'
            name='title'
            type='text'
            placeholder='Please enter a title.'
            value={value.title}
            onChange={changeValue}
          />
          <Editor
            model={value.content}
            onModelChange={changeValue}
            tag='textarea'
          />
          <div className='btn_bundle'>
            <button className='back_btn' onClick={backToBoard}>
              BACK
            </button>
            <button className='post_btn' onClick={onSubmit}>
              POST
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Write);
