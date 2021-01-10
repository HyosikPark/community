import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

interface SearchPostsprops {}

function SearchPosts() {
  const [option, setOption] = useState('title');
  const [value, setValue] = useState('');

  const router = useRouter();
  const { id, curPage } = router.query;

  const optionChange = useCallback((e) => {
    setOption(e.target.value);
  }, []);

  const inputChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!value) return alert('Please enter the contents.');

      router.push(
        `/board/search/${id}?curPage=1&option=${option}&keyword=${value}`
      );
    },
    [option, value]
  );
  return (
    <>
      <form onSubmit={onSubmit} className='search_post'>
        <select value={option} onChange={optionChange}>
          <option value='title'>Title</option>
          <option value='content'>Content</option>
          <option value='title_content'>Title+Content</option>
          <option value='nickname'>Nickname</option>
        </select>
        <input
          type='text'
          value={value}
          onChange={inputChange}
          placeholder='search...'
        />
        <button>
          <i aria-hidden className='fas fa-search'></i>
        </button>
      </form>
    </>
  );
}

export default SearchPosts;
