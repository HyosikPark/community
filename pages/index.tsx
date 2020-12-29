import Layout from '../components/Layout';

export default function Home() {
  return (
    <>
      <Layout />
      <div className='main_img'>
        <img className='bts_pic' src='/bts.jpg' alt='' />
        <img className='blackpink_pic' src='/blackpink.jpg' alt='' />
      </div>
    </>
  );
}
