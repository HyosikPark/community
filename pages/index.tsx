import { faHotjar } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HOTPOSTS } from '../components/gqlFragment';
import moment from 'moment';
import {
  faCommentDots,
  faEye,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useLazyQuery } from '@apollo/client';

Home.getInitialProps = async (ctx) => {
  const result = await ctx.apolloClient.query({
    query: HOTPOSTS,
    variables: { number: 0 },
  });
  return result.data;
};

export default function Home({ hotPosts }) {
  const reFetchNum = useRef(1);
  const posts = useRef(hotPosts);

  const [fetching, setFetching] = useState(false);

  const [fetchMore] = useLazyQuery(HOTPOSTS, {
    variables: { number: reFetchNum.current },
    onCompleted(data) {
      reFetchNum.current++;
      posts.current = posts.current.concat(data.hotPosts);
      setFetching(!fetching);
    },
  });
  const haveImg = useCallback((content) => {
    const regEx = new RegExp(`https://kpop-app-image[^">]+`);
    const imgPath = content.match(regEx);
    if (imgPath) return <img src={imgPath} />;
    else return <img src='/no-img.png' />;
  }, []);

  const postCount = useCallback((count) => {
    return count > 1000 ? '1000+' : `${count}`;
  }, []);

  const goToPost = useCallback((category, number) => {
    window.location.href = `/board/${category}/${number}`;
  }, []);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setFetching(true);
      fetchMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className='home_container'>
        <div className='posts_container'>
          <div className='sort_by'>
            <h1 className='hot_posts'>
              <FontAwesomeIcon className='hot_icon' icon={faHotjar} />
              HOT
            </h1>
          </div>
          <div className='posts_list'>
            {posts.current.map((post) => (
              <div
                key={post._id}
                className='post'
                onClick={() => goToPost(post.category, post.number)}
              >
                {haveImg(post.content)}
                <div className='post_main'>
                  <h3 className='title'>{post.title}</h3>
                  <div className='user_info'>
                    <p className='user_nickname'>by {post.nickname}</p>
                    <p className='created_at'>
                      {moment(post.createdAt).format('YYYY.MM.DD')}
                    </p>
                  </div>
                </div>
                <div className='post_bottom'>
                  <p className='category_info'>#{post.category}</p>
                  <div className='post_count'>
                    <p>
                      <FontAwesomeIcon
                        className='fontawesome_icon'
                        icon={faEye}
                      />{' '}
                      {postCount(post.views)}
                    </p>
                    <p>
                      <FontAwesomeIcon
                        className='fontawesome_icon'
                        icon={faCommentDots}
                      />{' '}
                      {postCount(post.commentCount)}
                    </p>
                    <p>
                      <FontAwesomeIcon
                        className='fontawesome_icon'
                        icon={faHeart}
                      />{' '}
                      {postCount(post.likeCount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
