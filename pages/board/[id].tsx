import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { ALLPOSTS } from '../../components/gqlFragment';
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

Board.getInitialProps = async (ctx) => {
  try {
    const { curPage, id: star } = ctx.query;
    const result = await ctx.apolloClient.query({
      query: ALLPOSTS,
      variables: { category: `${star}`, curPage: +curPage },
    });
    return { ...result.data.allPosts, curPage: Number(curPage), star };
  } catch (e) {
    ctx.res.writeHead(302, {
      Location: `/`,
    });
    ctx.res.end();
  }
};

function Board({ postInfo, postCount, curPage, star }) {
  const lastPage = Math.ceil(postCount / 15);

  const movePage = useCallback(
    (e) => {
      const elem = e.target.id;
      if (elem == 'double_left')
        return (window.location.href = `/board/${star}?curPage=1`);

      if (elem == 'left')
        return (window.location.href =
          curPage - 10 > 1
            ? `/board/${star}?curPage=${curPage - 10}`
            : `/board/${star}?curPage=1`);

      if (elem == 'right')
        return (window.location.href =
          curPage + 10 > lastPage
            ? `/board/${star}?curPage=${lastPage}`
            : `/board/${star}?curPage=${curPage + 10}`);

      if (elem == 'double_right')
        return (window.location.href = `/board/${star}?curPage=${lastPage}`);

      window.location.href = `/board/${star}?curPage=${elem}`;
    },
    [curPage, lastPage, star]
  );
  return (
    <>
      <div className='star_container'>
        <div className='board_container'>
          {star && <h2>{`${star} Board`}</h2>}
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
                <Link key={e._id} href={`/board/${star}/${e._id}`}>
                  <li>
                    <p className='number_post'>{e._id}</p>
                    <p className='title_post'>{e.title}</p>
                    <p className='nickname_post'>{e.nickname}</p>
                    <p className='date_post'>{postDate(e.createdAt)}</p>
                    <p className='views_post'>{e.views}</p>
                    <p className='hot_post'>{e.likeCount}</p>
                  </li>
                </Link>
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
              <li
                id='double_left'
                onClick={movePage}
                className='angle_double_left page_button'
              >
                <FontAwesomeIcon
                  className='fontawesome_icon'
                  icon={faAngleDoubleLeft}
                />
              </li>
            )}
            {curPage <= 10 ? null : (
              <li
                id='left'
                onClick={movePage}
                className='angle_left page_button'
              >
                <FontAwesomeIcon
                  className='fontawesome_icon'
                  icon={faAngleLeft}
                />
              </li>
            )}

            {pageNums(postCount, curPage).map((e) => (
              <li
                id={e}
                onClick={movePage}
                key={e}
                className={`${e}page page_button`}
              >
                {e}
              </li>
            ))}
            {curPage >= Math.floor((lastPage - 1) / 10) * 10 + 1 ? null : (
              <li
                id='right'
                onClick={movePage}
                className='angle_right page_button'
              >
                <FontAwesomeIcon
                  className='fontawesome_icon'
                  icon={faAngleRight}
                />
              </li>
            )}

            {lastPage == curPage || postCount == 0 ? null : (
              <li
                id='double_right'
                onClick={movePage}
                className='angle_double_right page_button'
              >
                <FontAwesomeIcon
                  className='fontawesome_icon'
                  icon={faAngleDoubleRight}
                />
              </li>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Board;
