import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HOTPOSTS, HOTPOSTSMUTATION } from '../util/gqlFragment';
import moment from 'moment';
import {
  faCommentDots,
  faEye,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';
import Head from 'next/head';
import { ExHotPost, PostSchema } from '../util/queryTypes';
import { NextPageContext } from 'next';

interface HomeProps {
  hotPosts: Omit<PostSchema, ExHotPost>[];
}

export interface NextWithApolloContext extends NextPageContext {
  apolloClient: any;
}

Home.getInitialProps = async (ctx: NextWithApolloContext) => {
  const result = await ctx.apolloClient.query({
    query: HOTPOSTS,
  });
  return result.data;
};

export default function Home({ hotPosts }: HomeProps) {
  const [posts, setPosts] = useState(hotPosts);
  const [fetching, setFetching] = useState(true);

  const reFetchNum = useRef(0);
  const target = useRef<HTMLElement>(null);

  const [fetchMore] = useMutation(HOTPOSTSMUTATION, {
    onCompleted({ hotPosts }) {
      if (!hotPosts.length) return setFetching(false);

      setPosts(posts.concat(hotPosts));
    },
  });

  const haveImg = useCallback((content: string) => {
    const regEx = new RegExp(`https://kpop-app-image[^">]+`);
    const imgPath = content.match(regEx);

    if (imgPath) return <img className='preview_img' data-src={imgPath[0]} />;
    else return <img className='preview_img' data-src='/no-img.png' />;
  }, []);

  const postCount = useCallback((count: number) => {
    if (count >= 1000) {
      return <span className='big_count'>{(count / 1000).toFixed(1)}k</span>;
    }

    return `${count}`;
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(handleIntersection, { threshold: 0 });
    const imgs = document.querySelectorAll('.preview_img');

    imgs.forEach((img) => io.observe(img));

    if (fetching && target.current) {
      io.observe(target.current);
    }

    return () => {
      io && io.disconnect();
    };
  }, [posts, fetching]);

  const handleIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.className === 'preview_img') {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src;
        } else {
          reFetchNum.current++;
          fetchMore({ variables: { number: reFetchNum.current } });
        }
      } else {
        if (entry.target.className === 'preview_img') {
          const img = entry.target as HTMLImageElement;
          img.src = './grey_img.jpg';
        }
      }
    });
  };
  return (
    <>
      <Head>
        <title>biaskpop | K-POP Forum</title>
        <meta
          name='naver-site-verification'
          content='fb9e25ae6dcb7b98c81467d11230cf7b5143b602'
        />
        <meta
          name='description'
          content='K-POP forum community for K-pop, kpoper fans around the world! Post freely without signing up for membership. BTS, BlackPink, EXO, NCT, SEVENTEEN, TWICE, NCT, GOT7, Super Junior, SHINee, Stray Kids'
        />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta
          name='google-site-verification'
          content='ntTeC9gGZQikjYJC695zknszT4Y0idIMv896Qaqa2Ps'
        />
        <meta name='robots' content='index,follow' />
        <meta property='og:title' content='biaskpop | K-POP Forum' />
        <meta
          property='og:description'
          content='K-POP forum for K-pop fans around the world! Post freely without signing up for membership. BTS, BlackPink, EXO, NCT, SEVENTEEN, TWICE... '
        />
        <meta
          property='og:image'
          content='https://kpop-app-image-storage.s3.us-east-2.amazonaws.com/biaskpop.png'
        />
        <meta name='msvalidate.01' content='FF33EEABEE4049B79C7EF5EAFFB03E72' />
      </Head>
      <div className='home_container'>
        <main className='posts_container'>
          <div className='sort_by'>
            <div className='sort_by_hot'>
              <div className='hot_posts'>HOT</div>
            </div>
          </div>
          <section className='posts_list'>
            {posts.map((post, i) => (
              <a key={post._id} href={`/board/${post.category}/${post.number}`}>
                <article
                  className='post'
                  ref={posts.length - 1 === i ? target : null}
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
                      <p className='view_info'>
                        <FontAwesomeIcon
                          className='fontawesome_icon'
                          icon={faEye}
                        />{' '}
                        {postCount(post.views)}
                      </p>
                      <p className='comment_info'>
                        <FontAwesomeIcon
                          className='fontawesome_icon'
                          icon={faCommentDots}
                        />{' '}
                        {postCount(post.commentCount)}
                      </p>
                      <p className='like_info'>
                        <FontAwesomeIcon
                          className='fontawesome_icon'
                          icon={faHeart}
                        />{' '}
                        {postCount(post.likeCount)}
                      </p>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
