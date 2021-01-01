import { GETPOST, LIKEPOST, UNLIKEPOST } from '../../../components/gqlFragment';
import moment from 'moment';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import { useMutation } from '@apollo/client';

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
  const [like, setLike] = useState(false);
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

  const likeToggle = useCallback(
    (e) => {
      if (like) {
        likeNum.current--;
        unlikePost();
      } else {
        likeNum.current++;
        likePost();
      }
      setLike((prev) => !prev);
    },

    [like]
  );

  useEffect(() => {
    alreadyLike ? setLike(true) : setLike(false);
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
        <div className='for_underline'></div>
        <div className='comment_container'>
          <div className='comment_user'>
            <input
              type='text'
              id='nickname'
              name='nickname'
              className='nickname'
              placeholder='nickname'
            />
            <input
              type='password'
              id='password'
              name='password'
              className='password'
              placeholder='password'
            />
          </div>
          <textarea
            name='comment_body'
            id='comment_body'
            className='comment_body'
          ></textarea>
        </div>
      </div>
    </>
  );
}

export default Post;
