import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faImage,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import { ALLPOSTS_SORTBY_VIEWS } from '../../../components/gqlFragment';
import moment from 'moment';
import { useCallback } from 'react';

function pageNums(postCount: number, curPage: number) {
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

function postDate(date) {
  const now = moment(new Date().toISOString());
  const postDate = moment(date);
  if (moment.duration(now.diff(postDate)).asDays() < 1)
    return moment(date).fromNow();
  else return moment(date).format('YYYY-MM-DD');
}

SortByViewsBoard.getInitialProps = async (ctx) => {
  try {
    const { curPage, id: star } = ctx.query;
    const result = await ctx.apolloClient.query({
      query: ALLPOSTS_SORTBY_VIEWS,
      variables: { category: `${star}`, curPage: +curPage },
    });
    return {
      ...result.data.allPostsSortByViews,
      curPage: Number(curPage),
      star,
    };
  } catch (e) {
    ctx.res.writeHead(302, {
      Location: `/category`,
    });
    ctx.res.end();
    return {};
  }
};

function SortByViewsBoard({ postInfo, postCount, curPage, star }) {
  const lastPage = Math.ceil(postCount / 15);

  const countUnit = useCallback((count) => {
    if (count >= 1000) {
      return <span className='big_count'>{(count / 1000).toFixed(1)}k</span>;
    } else return `${count}`;
  }, []);

  const titleUI = useCallback((title, content, commentCount) => {
    const haveImg = content.includes('<img src=');

    return (
      <>
        <span className='title_info'>{title} </span>
        {haveImg ? (
          <FontAwesomeIcon color='#079653' icon={faImage} />
        ) : null}{' '}
        <span className='comment_info'>
          <FontAwesomeIcon color='#11bfeb' icon={faCommentDots} />[
          {commentCount}]
        </span>
      </>
    );
  }, []);

  return (
    <>
      <div className='star_container'>
        <div className='board_container'>
          {star && <h2 className='category_info'>{`${star}`}</h2>}
          <div className='sort_by_container'>
            <a href={`/board/${star}?curPage=1`}>
              <button>Latest</button>
            </a>
            <a href={`/board/hot/${star}?curPage=1`}>
              <button>Hot</button>
            </a>
            <a href={`/board/views/${star}?curPage=1`}>
              <button style={{ background: '#485a92', color: 'white' }}>
                Views
              </button>
            </a>
          </div>
          <div className='board'>
            <div className='board_head'>
              <h3 className='number_head'>Number</h3>
              <h3 className='title_head'>Title</h3>
              <h3 className='nickname_head'>Nickname</h3>
              <h3 className='date_head'>Date</h3>
              <h3 className='views_head'>Views</h3>
              <h3 className='hot_head'>Hot</h3>
            </div>
            <ul className='post'>
              {postInfo.map((e) => (
                <a key={e._id} href={`/board/${star}/${e.number}`}>
                  <li>
                    <p className='number_post'>{e.number}</p>
                    <p className='title_post'>
                      {titleUI(e.title, e.content, e.commentCount)}
                    </p>
                    <p className='nickname_post'>{e.nickname}</p>
                    <p className='date_post'>{postDate(e.createdAt)}</p>
                    <p className='views_post'>{countUnit(e.views)}</p>
                    <p className='hot_post'>{countUnit(e.likeCount)}</p>
                  </li>
                </a>
              ))}
            </ul>
          </div>
          <div className='board_bottom'>
            <form className='search_post'>
              <select name='' id=''>
                <option value='title'>Title</option>
                <option value='content'>Content</option>
                <option value='title_content'>Title+Content</option>
                <option value='nickname'>Nickname</option>
              </select>
              <input type='text' placeholder='search...' />
              <button>
                <FontAwesomeIcon className='search_icon' icon={faSearch} />
              </button>
            </form>

            <Link href={`/write/${star}`}>
              <button className='write_btn btn'>Write</button>
            </Link>
          </div>
          <div className='page_number_container'>
            {curPage <= 1 ? null : (
              <a href={`/board/views/${star}?curPage=1`}>
                <li id='double_left' className='angle_double_left page_button'>
                  <FontAwesomeIcon
                    className='fontawesome_icon'
                    icon={faAngleDoubleLeft}
                  />
                </li>
              </a>
            )}
            {curPage <= 10 ? null : (
              <a
                href={
                  curPage - 10 > 1
                    ? `/board/views/${star}?curPage=${curPage - 10}`
                    : `/board/views/${star}?curPage=1`
                }
              >
                <li id='left' className='angle_left page_button'>
                  <FontAwesomeIcon
                    className='fontawesome_icon'
                    icon={faAngleLeft}
                  />
                </li>
              </a>
            )}

            {pageNums(postCount, curPage).map((e) => (
              <a key={e} href={`/board/views/${star}?curPage=${e}`}>
                <li id={e} className={`${e}page page_button`}>
                  {e}
                </li>
              </a>
            ))}
            {curPage >= Math.floor((lastPage - 1) / 10) * 10 + 1 ? null : (
              <a
                href={
                  curPage + 10 > lastPage
                    ? `/board/views/${star}?curPage=${lastPage}`
                    : `/board/views/${star}?curPage=${curPage + 10}`
                }
              >
                <li id='right' className='angle_right page_button'>
                  <FontAwesomeIcon
                    className='fontawesome_icon'
                    icon={faAngleRight}
                  />
                </li>
              </a>
            )}

            {lastPage == curPage || postCount == 0 ? null : (
              <a href={`/board/views/${star}?curPage=${lastPage}`}>
                <li
                  id='double_right'
                  className='angle_double_right page_button'
                >
                  <FontAwesomeIcon
                    className='fontawesome_icon'
                    icon={faAngleDoubleRight}
                  />
                </li>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SortByViewsBoard;
