import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import Layout from '../components/Layout';
import { menu } from '../util/Menu';

export async function getStaticProps() {
  return {
    props: { menu },
  };
}

function category({ menu }) {
  const [search, setSearch] = useState('');
  const findStar = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [search]
  );

  const category = useCallback(() => {
    return menu.map((a) => (
      <ul key={a.initial} className={a.initial}>
        <div
          className={`${a.initial.slice(0, 1)} category_title`}
        >{`${a.initial.slice(0, 1).toUpperCase()} `}</div>
        {a.names
          .map((name, i) => (
            <Link key={i} href={`/board/${name}?page=1`}>
              <a>
                <li>{name}</li>
              </a>
            </Link>
          ))
          .filter((x) =>
            x.props.children.props.children.props.children
              .toLowerCase()
              .includes(search)
          )}
      </ul>
    ));
  }, [search]);

  return (
    <>
      <Layout />
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
        <div className='category'>{category()}</div>
      </div>
    </>
  );
}

export default React.memo(category);
