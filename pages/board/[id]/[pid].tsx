import { useRouter } from 'next/router';

function Post() {
  const router = useRouter();
  console.log(router);
  return (
    <>
      <div className=''></div>
    </>
  );
}

export default Post;
