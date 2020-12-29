import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@apollo/client';
import { ALLPOSTS } from '../../components/gqlFragment';
import moment from 'moment';

const postDate = (date) => {
  const now = moment(new Date().toISOString());
  const postDate = moment(date);
  if (moment.duration(now.diff(postDate)).asDays() < 1)
    return moment(date).fromNow();
  else return moment(date).format('YYYY-MM-DD');
};

function Board() {
  const router = useRouter();
  const { page, id: star } = router.query;
  const { data } = useQuery(ALLPOSTS, {
    variables: { category: `${star}`, page },
  });
  return (
    <>
      <Layout />
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
              {data &&
                data.allPosts.postInfo.map((e) => (
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
        </div>
      </div>
    </>
  );
}

export default React.memo(Board);
