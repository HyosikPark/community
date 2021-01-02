import {
  CREATECOMMENT,
  DELETECOMMENT,
  GETPOST,
  LIKEPOST,
  UNLIKEPOST,
} from '../../../components/gqlFragment';
import moment from 'moment';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import PostComment from '../../../components/PostComment';

const FROALA_AD =
  '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>';

Post.getInitialProps = async (ctx) => {
  const { id: star, pid: pageNum } = ctx.query;
  const result = await ctx.apolloClient.query({
    query: GETPOST,
    variables: { category: star, number: +pageNum },
  });
  return result.data.getPost;
};

function Post({
  post: {
    _id,
    category,
    nickname,
    password,
    title,
    content,
    createdAt,
    comments,
    commentCount,
    likeCount,
    views,
    likeUser,
  },
  alreadyLike,
}) {
  const likeNum = useRef(likeCount);
  const commentsArr = useRef(comments);
  const commentNum = useRef(commentCount);
  const commentBtn = useRef(null);
  const commentPasswordForm = useRef(null);

  const [like, setLike] = useState(false);
  const [value, setValue] = useState({
    nickname: '',
    password: '',
    content: '',
  });
  const [commentPassword, setCommentPassword] = useState('');
  const [verifyComment, setVerifyComment] = useState({
    _id: '',
    password: '',
    index: 0,
  });

  const inputContent = useCallback(() => {
    return { __html: content.replace(FROALA_AD, '') };
  }, [content]);

  const [likePost] = useMutation(LIKEPOST, {
    variables: { category, number: +_id },
    onError() {
      alert('Error');
    },
  });
  const [unlikePost] = useMutation(UNLIKEPOST, {
    variables: { category, number: +_id },
    onError() {
      alert('Error');
    },
  });

  const [createComment] = useMutation(CREATECOMMENT, {
    variables: { category, number: +_id, ...value },
    onError() {
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

  const likeToggle = useCallback(
    (e) => {
      if (like) {
        likeNum.current--;
        unlikePost();
      } else {
        let check = false;
        for (let i = 0; i <= 100 * 3; i += 100) {
          check = !check;
          if (check) {
            setTimeout(() => {
              e.target.style.transform = 'scale(1.2)';
            }, i);
          } else {
            setTimeout(() => {
              e.target.style.transform = 'scale(1.0)';
            }, i);
          }
        }
        likeNum.current++;
        likePost();
      }
      setLike((prev) => !prev);
    },

    [like]
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

  const commentDel = useCallback((e, commentId, commentPassword, index) => {
    setCommentPassword('');
    commentPasswordForm.current.style.top = `${e.pageY}px`;
    commentPasswordForm.current.style.left = `${e.pageX - 250}px`;
    commentPasswordForm.current.style.display = 'block';
    setVerifyComment({ _id: commentId, password: commentPassword, index });
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

  const changeCommentPassword = useCallback((e) => {
    setCommentPassword(e.target.value);
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

  const handleClickOutside = useCallback((e) => {
    if (!commentPasswordForm.current.contains(e.target)) {
      commentPasswordForm.current.style.display = 'none';
    }
  }, []);

  useEffect(() => {
    alreadyLike ? setLike(true) : setLike(false);
    document.addEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <>
      {/* <Head>
      
      </Head> */}
      <div className='post_container'>
        <div className='post_head'>
          <h1>{title}</h1>
          <div className='head_util'>
            <div className='user_info'>
              <h3>{nickname}</h3>
              <h3>{moment(createdAt).format('YYYY-MM-DD hh:mm:ss')}</h3>
            </div>
            <div className='post_edit'>
              <h3 className='edit'>EDIT | </h3>
              <h3 className='delete'>&nbsp; DELETE</h3>
            </div>
          </div>
        </div>
        <div className='for_underline'></div>
        <div
          className='post_body'
          dangerouslySetInnerHTML={inputContent()}
        ></div>
        <div className='icon_container'>
          <div className='heart_icon_container' onClick={likeToggle}>
            <FontAwesomeIcon
              color={like ? 'rgb(248, 63, 63)' : null}
              icon={faHeart}
              className='heart_icon'
            />
          </div>
          <h3 className='like_count'>{likeNum.current}</h3>
        </div>

        <div className='for_underline'>
          <p>comment({commentNum.current})</p>
        </div>
        <PostComment
          comments={comments}
          category={category}
          commentCount={commentCount}
          _id={_id}
        />

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
            />
            <input
              type='password'
              id='password'
              name='password'
              className='password'
              placeholder='password'
              value={value.password}
              onChange={changeValue}
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
      </div>
    </>
  );
}

export default Post;
