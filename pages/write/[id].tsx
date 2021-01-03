import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { CREATEPOST } from '../../components/gqlFragment';
import { useMutation } from '@apollo/client';
import Head from 'next/head';
import QuillEditor from '../../components/QuillEditor';

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
      alert('error');
    },
    onCompleted(data) {
      window.location.href = `/board/${star}/${data.createPost}`;
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

  console.log(value.content);

  return (
    <>
      <Head>
        <link
          href='https://cdn.quilljs.com/1.3.6/quill.snow.css'
          rel='stylesheet'
        ></link>
      </Head>
      <div className='write_container'>
        <div>
          <div className='auth'>
            <input
              type='text'
              name='nickname'
              className='nickname'
              placeholder='nickname'
              value={value.nickname}
              onChange={changeValue}
              maxLength={16}
            />
            <input
              type='password'
              name='password'
              className='password'
              placeholder='password'
              value={value.password}
              onChange={changeValue}
              maxLength={20}
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
            maxLength={80}
          />

          <div className='quill_editor'>
            <QuillEditor QuillChange={changeValue} />
          </div>
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

export default Write;
