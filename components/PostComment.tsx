import { useMutation } from '@apollo/client';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CREATECOMMENT, DELETECOMMENT } from './gqlFragment';

function PostComment({ comments, category, commentCount, _id }) {
  const commentsArr = useRef(comments);
  const commentPasswordForm = useRef(null);
  const commentNum = useRef(commentCount);
  const commentBtn = useRef(null);
  const [commentPassword, setCommentPassword] = useState('');
  const [verifyComment, setVerifyComment] = useState({
    _id: '',
    password: '',
    index: 0,
  });
  const [value, setValue] = useState({
    nickname: '',
    password: '',
    content: '',
  });

  const [createComment] = useMutation(CREATECOMMENT, {
    variables: { category, number: +_id, ...value },
    onError(e) {
      alert('error');
      commentBtn.current.style.pointerEvents = '';
    },
    onCompleted(data) {
      commentNum.current++;
      commentsArr.current.push(data.createComment);
      setValue({
        nickname: '',
        password: '',
        content: '',
      });
      commentBtn.current.style.pointerEvents = '';
    },
  });

  const [deleteComment] = useMutation(DELETECOMMENT, {
    onError() {
      alert('error');
    },
  });

  const commentDel = useCallback((e, commentId, commentPassword, index) => {
    setCommentPassword('');
    commentPasswordForm.current.style.top = `${e.pageY}px`;
    commentPasswordForm.current.style.left = `${e.pageX - 250}px`;
    commentPasswordForm.current.style.display = 'block';
    setVerifyComment({ _id: commentId, password: commentPassword, index });
  }, []);

  const submitCommentPassword = useCallback(
    (e) => {
      e.preventDefault();
      if (verifyComment.password == commentPassword) {
        deleteComment({
          variables: { category, number: +_id, _id: verifyComment._id },
        });
        commentsArr.current.splice(verifyComment.index, 1);
        commentNum.current--;
        setCommentPassword('');
        commentPasswordForm.current.style.display = 'none';
      } else alert('Incorrect password.');
    },
    [verifyComment, commentPassword]
  );

  const changeCommentPassword = useCallback((e) => {
    setCommentPassword(e.target.value);
  }, []);

  const changeValue = useCallback(
    (e) => {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    },
    [value]
  );

  const submitComment = useCallback(
    (e) => {
      e.preventDefault();

      if (!value.nickname) {
        return alert('Please enter your nickname.');
      }
      if (!value.password) {
        return alert('Please enter your password.');
      }
      if (!value.content) {
        return alert('Please enter the content.');
      }

      createComment();
      commentBtn.current.style.pointerEvents = 'none';
    },
    [value]
  );

  const handleClickOutside = useCallback((e) => {
    if (!commentPasswordForm.current.contains(e.target)) {
      commentPasswordForm.current.style.display = 'none';
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className='for_underline'>
        <p className='comment_count'>comment({commentNum.current})</p>
      </div>
      {commentsArr.current.map((comment, i) => (
        <ul key={comment._id} className='comment_box'>
          <li className='comment_info'>
            <div className='comment_left'>
              <p className='comment_nickname'>{comment.nickname}</p>
              <p className='comment_date'>
                {moment(comment.createdAt).format('MM.DD hh:mm:ss')}
              </p>
            </div>
            <div className='comment_body'>
              <p>{comment.content}</p>
            </div>
            <FontAwesomeIcon
              icon={faTrashAlt}
              className='comment_delete'
              onClick={(e) => commentDel(e, comment._id, comment.password, i)}
            />
          </li>
        </ul>
      ))}
      <form
        ref={commentPasswordForm}
        className='comment_password'
        onSubmit={submitCommentPassword}
      >
        <input
          type='password'
          placeholder='password'
          value={commentPassword}
          onChange={changeCommentPassword}
        />
        <button>Check</button>
      </form>
      <div className='comment_container'>
        <div className='comment_user'>
          <input
            type='text'
            id='nickname'
            name='nickname'
            className='nickname'
            placeholder='nickname'
            value={value.nickname}
            onChange={changeValue}
            maxLength={16}
          />
          <input
            type='password'
            id='password'
            name='password'
            className='password'
            placeholder='password'
            value={value.password}
            onChange={changeValue}
            maxLength={20}
          />
        </div>
        <div className='text_with_submit'>
          <textarea
            name='content'
            id='content'
            className='comment_body'
            value={value.content}
            onChange={changeValue}
          ></textarea>
          <button
            ref={commentBtn}
            onClick={submitComment}
            className='comment_btn btn'
          >
            submit
          </button>
        </div>
      </div>
    </>
  );
}

export default React.memo(PostComment);
