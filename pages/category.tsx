import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback, useState, useRef } from 'react';
import { menu } from '../util/Menu';

export async function getStaticProps() {
  return {
    props: { menu },
  };
}

function Category({ menu }) {
  const [search, setSearch] = useState('');

  const findStar = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const category = useCallback(
    (a) => {
      const filtered = a.names.filter((x) => x.toLowerCase().includes(search));
      return filtered.sort().map((name, i) => (
        <Link key={i} href={`/board/${name}?curPage=1`}>
          <a>
            <li>{name}</li>
          </a>
        </Link>
      ));
    },
    [search]
  );

  return (
    <>
      <Head>
        <title>Categories - biaskpop Forum</title>
        <meta
          name='description'
          content='BTS BlackPink TWICE NCT SEVENTEEN EXO The Boyz GOT7 IZONE GI-DLE Oh My Girl SHINEE...'
        />
      </Head>
      <div className='category_container'>
        <div className='category_head'>
          <label htmlFor='search'>
            <input
              type='text'
              id='search'
              name='search'
              placeholder='Search...'
              value={search}
              onChange={findStar}
            />
          </label>
        </div>
        <div className='category'>
          {menu.map((a) => (
            <ul key={a.initial} className={a.initial}>
              <div
                className={`${a.initial.slice(0, 1)} category_title`}
              >{`${a.initial.slice(0, 1).toUpperCase()} `}</div>
              <div className='artist_list'>{category(a)}</div>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}

export default Category;
