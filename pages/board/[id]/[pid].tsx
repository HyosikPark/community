import {
  DELETEPOST,
  GETPOST,
  LIKEPOST,
  UNLIKEPOST,
} from '../../../components/gqlFragment';
import moment from 'moment';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import { useMutation } from '@apollo/client';
import PostComment from '../../../components/PostComment';
import { useRouter } from 'next/router';

const FROALA_AD =
  '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>';

Post.getInitialProps = async (ctx) => {
  try {
    const { id: star, pid: pageNum } = ctx.query;
    const result = await ctx.apolloClient.query({
      query: GETPOST,
      variables: { category: star, number: +pageNum },
    });
    return result.data.getPost;
  } catch (e) {
    const { id: star } = ctx.query;
    ctx.res.writeHead(302, {
      Location: `/board/${star}?curPage=1`,
    });
    ctx.res.end();
  }
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
  const router = useRouter();
  const likeNum = useRef(likeCount);
  const postPasswordForm = useRef(null);

  const [like, setLike] = useState(false);
  const [postPassword, setPostPassword] = useState('');
  const [editOrDel, setEditOrDel] = useState('');

  const inputContent = useCallback(() => {
    return { __html: content.replace(FROALA_AD, '') };
  }, [content]);

  const [deletePost] = useMutation(DELETEPOST, {
    variables: { category, number: +_id },
    onError() {
      alert('error');
    },
    onCompleted() {
      window.location.href = `/board/${category}?curPage=1`;
    },
  });

  const editPost = useCallback(() => {
    router.push(
      {
        pathname: '/edit/[id]/[pid]',
        query: {
          id: category,
          pid: _id,
          nickname,
          password,
          title,
          body: content,
        },
      },
      `/edit/${category}/${_id}`,
      { shallow: true }
    );
  }, []);

  const clickEvent = useCallback((e) => {
    setPostPassword('');
    postPasswordForm.current.style.top = `${e.pageY}px`;
    postPasswordForm.current.style.left = `${e.pageX - 250}px`;
    postPasswordForm.current.style.display = 'block';
    setEditOrDel(e.target.id);
  }, []);

  const changePostPassword = useCallback((e) => {
    setPostPassword(e.target.value);
  }, []);

  const submitPostPassword = useCallback(
    (e) => {
      e.preventDefault();

      if (password == postPassword) {
        editOrDel == 'edit' ? editPost() : deletePost();
      } else {
        alert('Incorrect password.');
      }
    },
    [editOrDel, postPassword]
  );

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

  const handleClickOutside = useCallback((e) => {
    if (!postPasswordForm.current.contains(e.target)) {
      return (postPasswordForm.current.style.display = 'none');
    }
  }, []);

  useEffect(() => {
    alreadyLike ? setLike(true) : setLike(false);
    addEventListener('mousedown', handleClickOutside);

    return () => removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <>
      {/* <Head>
      
      </Head> */}
      <div className='post_container'>
        <p className='view_info'>Views: {views}</p>
        <div className='post_head'>
          <h1>{title}</h1>
          <div className='head_util'>
            <div className='user_info'>
              <h3>{nickname}</h3>
              <h3>{moment(createdAt).format('YYYY-MM-DD hh:mm:ss')}</h3>
            </div>
            <div className='post_edit'>
              <h3 id='edit' className='edit' onClick={clickEvent}>
                EDIT |{' '}
              </h3>
              <h3 id='delete' className='delete' onClick={clickEvent}>
                &nbsp; DELETE
              </h3>
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
        <PostComment
          comments={comments}
          category={category}
          commentCount={commentCount}
          _id={_id}
        />
      </div>
      <form
        ref={postPasswordForm}
        className='post_password'
        onSubmit={submitPostPassword}
      >
        <input
          type='password'
          placeholder='password'
          value={postPassword}
          onChange={changePostPassword}
        />
        <button>Check</button>
      </form>
    </>
  );
}

export default Post;
