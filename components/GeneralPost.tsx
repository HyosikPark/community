import {
  faCommentDots,
  faFilm,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { ExBoardPost, PostSchema } from '../util/queryTypes';

interface GeneralPostProps {
  post: Omit<PostSchema, ExBoardPost>;
  isMobile: boolean;
}

function postDate(date: string) {
  const now = moment(new Date().toISOString());
  const postDate = moment(date);

  if (moment.duration(now.diff(postDate)).asDays() < 1) {
    return moment(date).format('hh:mm');
  }

  return moment(date).format('MM.DD');
}

function GeneralPost({ post, isMobile }: GeneralPostProps) {
  const router = useRouter();
  const { id: star } = router.query;

  const countUnit = useCallback((count: number) => {
    if (count >= 1000) {
      return <span className='big_count'>{(count / 1000).toFixed(1)}k</span>;
    } else return `${count}`;
  }, []);

  const titleUI = useCallback((content: string) => {
    return content.includes('<img src=');
  }, []);

  const videoUI = useCallback((content: string) => {
    return content.includes('<iframe');
  }, []);

  return (
    <>
      <a href={`/board/${star}/${post.number}`}>
        {isMobile ? (
          <li className='mobile_list'>
            <p className='title_post'>{post.title}</p>
            <div className='content_info'>
              <p className='nickname_post'>{post.nickname} |</p>
              <p className='date_post'>{postDate(post.createdAt)} |</p>
              <p className='views_post'>views: {countUnit(post.views)} |</p>
              <p className='hot_post'>hot: {countUnit(post.likeCount)} |</p>
              <p className='post_info'>
                {titleUI(post.content) ? (
                  <FontAwesomeIcon color={'#079653'} icon={faImage} />
                ) : null}{' '}
                {videoUI(post.content) ? (
                  <FontAwesomeIcon color={'#1a1de2'} icon={faFilm} />
                ) : null}{' '}
                <FontAwesomeIcon color={'#11bfeb'} icon={faCommentDots} />
                <span className='comment_info'>[{post.commentCount}]</span>
              </p>
            </div>
          </li>
        ) : (
          <li className='desktop_list'>
            <p className='number_post'>{post.number}</p>
            <p className='title_post'>
              <span className='title'>{post.title} </span>
              <span className='post_info'>
                {titleUI(post.content) ? (
                  <FontAwesomeIcon color={'#079653'} icon={faImage} />
                ) : null}{' '}
                {videoUI(post.content) ? (
                  <FontAwesomeIcon color={'#1a1de2'} icon={faFilm} />
                ) : null}{' '}
                <FontAwesomeIcon color={'#11bfeb'} icon={faCommentDots} />
                <span className='comment_info'>[{post.commentCount}]</span>
              </span>
            </p>
            <p className='nickname_post'>{post.nickname}</p>
            <p className='date_post'>{postDate(post.createdAt)}</p>
            <p className='views_post'>{countUnit(post.views)}</p>
            <p className='hot_post'>{countUnit(post.likeCount)}</p>
          </li>
        )}
      </a>
    </>
  );
}

export default React.memo(GeneralPost);
