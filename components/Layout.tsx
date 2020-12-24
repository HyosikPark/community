import Link from 'next/link';
import React from 'react';

function Layout() {
  return (
    <div className='layout_container'>
      <div className='top_layout'>
        <div className='log'>
          <Link href='/'>
            <a>
              <h2>I LOVE K-POP</h2>
            </a>
          </Link>
          <div className='nav'></div>
        </div>
        <div className='main_img'>
          <img className='bts_pic' src='/bts.jpg' alt='' />
          <img className='blackpink_pic' src='/blackpink.jpg' alt='' />
        </div>
      </div>
    </div>
  );
}

export default React.memo(Layout);
