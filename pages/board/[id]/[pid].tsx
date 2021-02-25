import {
  DELETEPOST,
  GETPOST,
  ISAUTH,
  LIKEPOST,
  UNLIKEPOST,
} from '../../../util/gqlFragment';
import moment from 'moment';
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  MouseEvent,
  ChangeEvent,
  FormEvent,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import { useLazyQuery, useMutation } from '@apollo/client';
import PostComment from '../../../components/PostComment';
import { useRouter } from 'next/router';
import { menu } from '../../../util/Menu';
import { NextPageContext } from 'next';
import { PostQuery } from '../../../util/queryTypes';

interface PostProps {
  post: PostQuery;
  alreadyLike: boolean;
}

Post.getInitialProps = async (ctx: NextPageContext) => {
  try {
    const { id: star, pid: pageNum } = ctx.query;
    const existBoard = menu.filter(
      (a) => a.names.filter((e) => e === star).length
    ).length;

    if (!existBoard) throw new Error('no Page');

    const result = await ctx.apolloClient.query({
      query: GETPOST,
      variables: { category: star, number: +pageNum },
    });

    return result.data.getPost;
  } catch (e) {
    const { id: star } = ctx.query;

    ctx.res.writeHead(302, {
      Location: `/board/${star}?curPage=1`,
    });
    ctx.res.end();
  }
};

function Post({
  post: {
    number,
    category,
    nickname,
    password,
    title,
    content,
    createdAt,
    comments,
    commentCount,
    likeCount,
    views,
  },
  alreadyLike,
}: PostProps) {
  const router = useRouter();
  const { id } = router.query;

  const likeNum = useRef(likeCount);
  const postPasswordForm = useRef<HTMLFormElement>(null);

  const [like, setLike] = useState(false);
  const [postPassword, setPostPassword] = useState('');
  const [editOrDel, setEditOrDel] = useState('');

  const [auth] = useLazyQuery(ISAUTH, {
    fetchPolicy: 'network-only',
    onError() {
      alert('Only Master can Access');
    },
    onCompleted() {
      if (password === postPassword) {
        editOrDel === 'edit' ? editPost() : deletePost();
      } else {
        alert('Incorrect password.');
      }
    },
  });

  const inputContent = useCallback(() => {
    return { __html: content };
  }, [content]);

  const [deletePost] = useMutation(DELETEPOST, {
    variables: { category, number },
    onError() {
      alert('error');
    },
    onCompleted() {
      window.location.href = `/board/${category}?curPage=1`;
    },
  });

  const editPost = useCallback(() => {
    router.push(
      {
        pathname: '/edit/[id]/[pid]',
        query: {
          id: category,
          pid: number,
          nickname,
          password,
          title,
          body: content,
        },
      },
      `/edit/${category}/${number}`,
      { shallow: true }
    );
  }, []);

  const clickEvent = useCallback((e: MouseEvent<HTMLHeadingElement>) => {
    setPostPassword('');
    postPasswordForm.current.style.display = 'block';

    if (window.innerWidth > 480) {
      postPasswordForm.current.style.top = `${e.pageY}px`;
      postPasswordForm.current.style.left = `${e.pageX - 250}px`;
    } else {
      postPasswordForm.current.style.top = `${e.pageY}px`;
      postPasswordForm.current.style.left = `${e.pageX - 150}px`;
    }

    const heading = e.target as HTMLHeadingElement;

    setEditOrDel(heading.id);
  }, []);

  const changePostPassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPostPassword(e.target.value);
  }, []);

  const submitPostPassword = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (id === 'Notice') {
        return auth();
      }

      if (password === postPassword) {
        editOrDel === 'edit' ? editPost() : deletePost();
      } else {
        alert('Incorrect password.');
      }
    },
    [editOrDel, postPassword]
  );

  const [likePost] = useMutation(LIKEPOST, {
    variables: { category, number: +number },
    onError() {
      alert('Error');
    },
  });
  const [unlikePost] = useMutation(UNLIKEPOST, {
    variables: { category, number: +number },
    onError() {
      alert('Error');
    },
  });

  const likeToggle = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const elem = e.target as HTMLDivElement;
      if (like) {
        likeNum.current--;

        unlikePost();
      } else {
        let check = false;

        for (let i = 0; i <= 100 * 3; i += 100) {
          check = !check;
          if (check) {
            setTimeout(() => {
              elem.style.transform = 'scale(1.2)';
            }, i);
          } else {
            setTimeout(() => {
              elem.style.transform = 'scale(1.0)';
            }, i);
          }
        }

        likeNum.current++;
        likePost();
      }

      setLike((prev) => !prev);
    },

    [like]
  );

  const handleClickOutside = useCallback((e) => {
    if (!postPasswordForm.current.contains(e.target)) {
      return (postPasswordForm.current.style.display = 'none');
    }
  }, []);

  const metaContent = useCallback(() => {
    const regEx = /<[^>]+>/gs;

    return content.replace(regEx, '').slice(0, 161);
  }, [content]);

  const metaImg = useCallback(() => {
    const regEx = new RegExp(`https://kpop-app-image[^">]+`);
    const imgPath = content.match(regEx);

    if (imgPath) return imgPath[0];
    else
      return 'https://kpop-app-image-storage.s3.us-east-2.amazonaws.com/biaskpop.png';
  }, []);

  useEffect(() => {
    alreadyLike ? setLike(true) : setLike(false);

    addEventListener('mousedown', handleClickOutside);

    return () => removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <Head>
        <title>{title} - biaskpop Forum</title>
        <meta name='description' content={metaContent()} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={metaContent()} />
        <meta property='og:image' content={metaImg()} />
      </Head>
      <div className='post_page_container'>
        <div className='post_container'>
          <div className='post_top'>
            <div className='btn_bundle'>
              <a href={`/board/${category}?curPage=1`}>
                <button className='board_btn btn'>Board</button>
              </a>
            </div>
            <p className='view_info'>Views: {views}</p>
          </div>
          <header className='post_head'>
            <h1>{title}</h1>
            <div className='head_util'>
              <div className='user_info'>
                <h3>
                  by <span className='nickname'>{nickname}</span>
                </h3>
                <h3>{moment(createdAt).format('YYYY.MM.DD')}</h3>
              </div>
              <div className='post_edit'>
                <h3 id='edit' className='edit' onClick={clickEvent}>
                  EDIT |{' '}
                </h3>
                <h3 id='delete' className='delete' onClick={clickEvent}>
                  &nbsp; DELETE
                </h3>
              </div>
            </div>
          </header>
          <div className='for_underline'></div>
          <main
            className='post_body'
            dangerouslySetInnerHTML={inputContent()}
          ></main>
          <div className='icon_container'>
            <div className='heart_icon_container' onClick={likeToggle}>
              <FontAwesomeIcon
                color={like ? 'rgb(248, 63, 63)' : null}
                icon={faHeart}
                className='heart_icon'
              />
            </div>
            <h3 className='like_count'>{likeNum.current}</h3>
          </div>
          <PostComment
            comments={comments}
            category={category}
            commentCount={commentCount}
            number={number}
          />
        </div>
        <form
          ref={postPasswordForm}
          className='post_password'
          onSubmit={submitPostPassword}
        >
          <input
            type='password'
            placeholder='password'
            value={postPassword}
            onChange={changePostPassword}
          />
          <button>Check</button>
        </form>
      </div>
    </>
  );
}

export default Post;
