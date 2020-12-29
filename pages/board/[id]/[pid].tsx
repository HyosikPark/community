import React from 'react';
import { useRouter } from 'next/router';
// import Layout from '../../../components/layout';

function Post() {
  const router = useRouter();
  console.log(router);
  return (
    <>
      {/* <Layout /> */}
      <div className=''></div>
    </>
  );
}

export default React.memo(Post);
