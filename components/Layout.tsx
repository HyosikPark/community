import Link from 'next/link';
import React from 'react';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Layout() {
  return (
    <div className='layout_container'>
      <nav className='sub_nav'>
        <Link href='/board/Notice?curPage=1'>
          <a>
            <li className='notice_container'>
              <h2 className='board'>Notice</h2>
            </li>
          </a>
        </Link>
        <Link href='/board/Suggestion?curPage=1'>
          <a>
            <li className='suggestion_container'>
              <h2 className='board'>Suggestion</h2>
            </li>
          </a>
        </Link>
      </nav>
      <nav className='log'>
        <Link href='/'>
          <a>
            <h2>BK</h2>
          </a>
        </Link>
        <ul className='nav'>
          <Link href='/category'>
            <a>
              <li className='categories_container'>
                <h2 className='board'>Categories</h2>
              </li>
            </a>
          </Link>
          {/* <li>
              <FontAwesomeIcon className='search_icon' icon={faSearch} />
            </li> */}
        </ul>
      </nav>
    </div>
  );
}

export default React.memo(Layout);
