import { faHotjar } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HOTPOSTS, HOTPOSTSMUTATION } from '../components/gqlFragment';
import moment from 'moment';
import {
  faCommentDots,
  faEye,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';

Home.getInitialProps = async (ctx) => {
  const result = await ctx.apolloClient.query({
    query: HOTPOSTS,
  });
  return result.data;
};

export default function Home({ hotPosts }) {
  const reFetchNum = useRef(0);
  const [posts, setPosts] = useState(hotPosts);
  const target = useRef(null);

  const [fetching, setFetching] = useState(true);

  const [fetchMore] = useMutation(HOTPOSTSMUTATION, {
    onCompleted({ hotPosts }) {
      if (!hotPosts.length) return setFetching(false);
      setPosts(posts.concat(hotPosts));
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

  useEffect(() => {
    const handleIntersection = ([entry]) => {
      if (entry.isIntersecting) {
        reFetchNum.current++;
        fetchMore({ variables: { number: reFetchNum.current } });
      }
    };

    const io = new IntersectionObserver(handleIntersection, { threshold: 1 });

    if (fetching && target.current) {
      io.observe(target.current);
    }

    return () => io && io.disconnect();
  }, [posts, fetching]);

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
            {posts.map((post, i) => (
              <div
                key={post._id}
                className='post'
                onClick={() => goToPost(post.category, post.number)}
                ref={posts.length - 1 == i ? target : null}
              >
                {haveImg(post.content)}
                <div className='post_main'>
                  <h3 className='title'>{post.title}</h3>
                  <div className='user_info'>
                    <p className='user_nickname'>
                      by <span className='nickname'>{post.nickname}</span>
                    </p>
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
