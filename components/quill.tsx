import React, { useEffect, useRef } from 'react';

var toolbarOptions = [
  [{ 'font': [] }],

  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'direction': 'rtl' }], // text direction
  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'align': [] }],
  ['link', 'image', 'video', 'formula'],
  ['clean'], // remove formatting button
];

function QuillEditor() {
  const Quill = typeof window === 'object' ? require('quill') : () => false;

  const quillElemnt = useRef(null);

  const options = {
    theme: 'snow',
    placeholder: 'Please enter the contents...',
    modules: {
      toolbar: toolbarOptions,
    },
  };

  useEffect(() => {
    if (quillElemnt.current) {
      const editor = new Quill(quillElemnt.current, options);
    }
  });
  return (
    <>
      <div ref={quillElemnt}></div>
    </>
  );
}

export default React.memo(QuillEditor);
