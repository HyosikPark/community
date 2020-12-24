import React from 'react';

type noticeMenu = {
  url: string;
  title: string;
}[];
const notice: noticeMenu = [
  { url: '#', title: '공지사항' },
  { url: '#', title: '버그/신고' },
  { url: '#', title: '건의/요청' },
];
const Notice = () => {
  return (
    <ul className='notice'>
      <h4 className='support_title'>고객지원</h4>
      {notice.map((menu) => (
        <li className='list' key={menu.title}>
          <a className='list_menu' href={menu.url}>
            <span>{menu.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default React.memo(Notice);
