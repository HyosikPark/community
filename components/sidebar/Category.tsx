import React from 'react';

type CategoryInfo = {
  url: string;
  title: string;
}[];

const category: CategoryInfo = [
  { url: '#', title: '라이프 스타일' },
  { url: '#', title: '펫/동물' },
  { url: '#', title: '음악/댄스' },
  { url: '#', title: '뷰티/패션' },
  { url: '#', title: '영화/애니메이션' },
  { url: '#', title: '키즈/유아' },
  { url: '#', title: '게임' },
  { url: '#', title: '여행/아웃도어' },
  { url: '#', title: '스포츠/건강' },
  { url: '#', title: '뉴스/정치/이슈' },
  { url: '#', title: '기관/단체/정부' },
  { url: '#', title: '엔터테인먼트' },
  { url: '#', title: '먹방/푸드' },
  { url: '#', title: '인물/유명인' },
  { url: '#', title: '기술/과학/IT' },
  { url: '#', title: '취미' },
  { url: '#', title: '자동차/선박/비행기' },
  { url: '#', title: '교육/강의' },
  { url: '#', title: '경제/금융' },
];
const Category = () => {
  return (
    <ul className='category'>
      <h4 className='category_title'>카테고리</h4>
      {category
        .sort((a: any, b: any): number => {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        })
        .map((menu) => (
          <li className='list' key={menu.title}>
            <a className='list_menu' href={menu.url}>
              <span>{menu.title}</span>
            </a>
          </li>
        ))}
    </ul>
  );
};

export default React.memo(Category);
