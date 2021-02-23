import Head from 'next/head';
import React, { useEffect, useRef } from 'react';
import S3 from 'react-aws-s3';

export const modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
      [{ 'direction': 'rtl' }], // text direction

      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  },
};

function QuillEditor({ QuillChange, value }) {
  const Quill = typeof window == 'object' ? require('quill') : () => false;

  const quillElement = useRef(null);
  const quillInstance = useRef(null);

  const onClickImageBtn = () => {
    // 이미지 커스텀 핸들링.
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = function () {
      const file = input.files[0];
      const maxSize = 2097152;

      if (file.size > maxSize) {
        return alert('Image size cannot exceed 2Mb.');
      }
      const fileName = file.name;

      const config = {
        bucketName: process.env.S3_BUCKET_NAME,
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_ID,
        secretAccessKey: process.env.S3_ACCESS_KEY,
      };

      const ReactS3Client = new S3(config);

      ReactS3Client.uploadFile(file, fileName).then((data) => {
        if (data.status === 204) {
          //커서 위치 받아오기 위함.
          const range = quillInstance.current.getSelection(true);
          // 1.현재 커서 위치에 2. 이미지를 3.src="" 로 나타냄.
          quillInstance.current.insertEmbed(
            range.index,
            'image',
            `${data.location}`
          );

          // 이미지 업로드 후 커서 이미지 한칸 옆으로 이동.
          quillInstance.current.setSelection(range.index + 1);
        } else {
          alert('error');
        }
      });
    };
  };

  useEffect(() => {
    if (quillElement.current) {
      quillInstance.current = new Quill(quillElement.current, {
        theme: 'snow',
        placeholder: 'Please enter the contents.',
        modules: modules,
      });
    }

    const quill = quillInstance.current;

    quill.on('text-change', () => {
      QuillChange(quill.root.innerHTML);
    });

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', onClickImageBtn);

    quillInstance.current.root.innerHTML = value;
  }, []);

  return <div ref={quillElement}></div>;
}

export default React.memo(QuillEditor);
