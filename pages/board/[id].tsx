import Link from 'next/link';
import { ALLPOSTS } from '../../util/gqlFragment';
import { useCallback, useEffect, useState } from 'react';
import SearchPosts from '../../components/SearchPosts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { menu, navMenu } from '../../util/Menu';
import Head from 'next/head';
import { ExBoardPost, PostSchema } from '../../util/queryTypes';
import { NextWithApolloContext } from '..';
import GeneralPost from '../../components/GeneralPost';

export interface BoardProps {
  postInfo: Omit<PostSchema, ExBoardPost>[];
  postCount: number;
  curPage: number;
  star: string;
}

function pageNums(postCount: number, curPage: number): number[] {
  if (!postCount) return [1];

  let arr = [];

  const calc1 = Math.ceil(curPage / 10);
  const restPage = postCount - 150 * (calc1 - 1);
  const calc2 = Math.ceil(restPage / 15);

  let initPage = 10 * calc1 - 9;
  const lastPage = calc2 >= 10 ? initPage + 9 : initPage + calc2 - 1;

  while (initPage <= lastPage) {
    arr.push(initPage);
    initPage++;
  }

  return arr;
}

Board.getInitialProps = async (ctx: NextWithApolloContext) => {
  try {
    const { curPage, id: star } = ctx.query;

    const existBoard = menu.filter(
      (a) => a.names.filter((e) => e === star).length
    ).length;

    if (!existBoard) {
      if (!navMenu.includes(star as string)) throw new Error('');
    }

    const result = await ctx.apolloClient.query({
      query: ALLPOSTS,
      variables: { category: `${star}`, curPage: +curPage },
    });

    return { ...result.data.allPosts, curPage: Number(curPage), star };
  } catch (e) {
    ctx.res.writeHead(302, {
      Location: `/category`,
    });
    ctx.res.end();
    return {};
  }
};

function Board({ postInfo, postCount, curPage, star }: BoardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const lastPage = Math.ceil(postCount / 15);

  const mobileCheck = useCallback(() => {
    if (window.innerWidth <= 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 767) {
      setIsMobile(true);
    }

    window.addEventListener('resize', mobileCheck);

    return () => window.removeEventListener('resize', mobileCheck);
  }, []);

  return (
    <>
      <Head>
        <title>{star} K-POP Forum - biaskpop</title>
        <meta
          name='description'
          content={`This is the ${star} fan page. Feel free to share your writing without signing up.`}
        />
        <meta property='og:title' content={`${star} K-POP Forum - biaskpop`} />
        <meta
          property='og:description'
          content={`This is the ${star} fan page. Feel free to share your writing without signing up.`}
        />
        <meta
          property='og:image'
          content='https://kpop-app-image-storage.s3.us-east-2.amazonaws.com/biaskpop.png'
        />
      </Head>
      <div className='star_container'>
        <div className='board_container'>
          {star && <h2 className='category_info'>{`${star}`}</h2>}
          <div className='sort_by_container'>
            <a href={`/board/${star}?curPage=1`}>
              <button style={{ background: '#485a92', color: 'white' }}>
                Latest
              </button>
            </a>
            <a href={`/board/hot/${star}?curPage=1`}>
              <button>Hot</button>
            </a>
            <a href={`/board/views/${star}?curPage=1`}>
              <button>Views</button>
            </a>
          </div>
          <div className='board'>
            {isMobile ? (
              <div className='board_head'>
                <h2 className='content_head'>Content</h2>
              </div>
            ) : (
              <div className='board_head'>
                <h3 className='number_head'>Number</h3>
                <h3 className='title_head'>Title</h3>
                <h3 className='nickname_head'>Nickname</h3>
                <h3 className='date_head'>Date</h3>
                <h3 className='views_head'>Views</h3>
                <h3 className='hot_head'>Hot</h3>
              </div>
            )}
            <ul className='post'>
              {postInfo.map((post) => (
                <GeneralPost post={post} key={post._id} isMobile={isMobile} />
              ))}
            </ul>
          </div>
          <div className='board_bottom'>
            <SearchPosts />
            {star === 'Notice' ? null : (
              <Link href={`/write/${star}`}>
                <button className='write_btn btn'>Write</button>
              </Link>
            )}
          </div>
          <div className='page_number_container'>
            {curPage <= 1 ? null : (
              <a href={`/board/${star}?curPage=1`}>
                <li id='double_left' className='angle_double_left page_button'>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </li>
              </a>
            )}
            {curPage <= 10 ? null : (
              <a
                href={
                  curPage - 10 > 1
                    ? `/board/${star}?curPage=${curPage - 10}`
                    : `/board/${star}?curPage=1`
                }
              >
                <li id='left' className='angle_left page_button'>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </li>
              </a>
            )}

            {pageNums(postCount, curPage).map((e) => (
              <a key={e} href={`/board/${star}?curPage=${e}`}>
                <li className={`${e}page page_button`}>{e}</li>
              </a>
            ))}
            {/* <a href={`/board/${star}?curPage=3`}>
              <li id='3' className={`3page page_button`}>
                3
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='4' className={`4page page_button`}>
                4
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='5' className={`5page page_button`}>
                5
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='6' className={`6page page_button`}>
                6
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='7' className={`7page page_button`}>
                7
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='8' className={`8page page_button`}>
                8
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='9' className={`9page page_button`}>
                9
              </li>
            </a>
            <a href={`/board/${star}?curPage=3`}>
              <li id='10' className={`3page page_button`}>
                10
              </li>
            </a> */}
            {curPage >= Math.floor((lastPage - 1) / 10) * 10 + 1 ? null : (
              <a
                href={
                  curPage + 10 > lastPage
                    ? `/board/${star}?curPage=${lastPage}`
                    : `/board/${star}?curPage=${curPage + 10}`
                }
              >
                <li id='right' className='angle_right page_button'>
                  <FontAwesomeIcon icon={faAngleRight} />
                </li>
              </a>
            )}

            {lastPage === curPage || postCount === 0 ? null : (
              <a href={`/board/${star}?curPage=${lastPage}`}>
                <li
                  id='double_right'
                  className='angle_double_right page_button'
                >
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </li>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Board;
