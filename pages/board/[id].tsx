import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Board() {
  const router = useRouter();
  const star = router.query.id;

  return (
    <>
      <Layout />
      <div className='star_container'>
        <div className='board_container'>
          {star && <h2>{`${star} Board`}</h2>}
          <div className='board'>
            <div className='board_head'>
              <h2>Number</h2>
              <h2>Title</h2>
              <h2>Nickname</h2>
              <h2>Date</h2>
              <h2>Views</h2>
              <h2>Hot</h2>
            </div>
            <div className='post'></div>
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
