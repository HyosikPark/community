import Link from 'next/link';
import React from 'react';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Layout() {
  return (
    <div className='layout_container'>
      <div className='top_layout'>
        <div className='log'>
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
        </div>
      </div>
    </div>
  );
}

export default React.memo(Layout);
