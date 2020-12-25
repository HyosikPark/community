import Link from 'next/link';
import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Layout() {
  return (
    <div className='layout_container'>
      <div className='top_layout'>
        <div className='log'>
          <Link href='/'>
            <a>
              <h2>Mongle</h2>
            </a>
          </Link>
          <ul className='nav'>
            <Link href='/category'>
              <li>
                <h2 className='board'>Category</h2>
              </li>
            </Link>
            <li>
              <FontAwesomeIcon className='search_icon' icon={faSearch} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Layout);
