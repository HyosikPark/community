import React from 'react';
import Category from './Category';
import Notice from './Notice';
import Link from 'next/link';

function Sidebar() {
  return (
    <aside className='sidebar'>
      <section className='sidebar_container'>
        <div className='menu'>
          <Notice />
          <Category />
        </div>
      </section>
    </aside>
  );
}

export default React.memo(Sidebar);
