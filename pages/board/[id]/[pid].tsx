import React from 'react';
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

export default React.memo(Post);
