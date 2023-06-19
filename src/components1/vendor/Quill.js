import 'react-quill/dist/quill.core.css';

import React from 'react';

const Quill = React.forwardRef(({ ...props }, ref) => {
  const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

  const modules = {
    toolbar: [
      ['bold', 'italic'],
      ['link', 'blockquote', 'code', 'image'],
      [
        {
          list: 'ordered',
        },
        {
          list: 'bullet',
        },
      ],
    ],
  };

  return <ReactQuill modules={modules} theme="snow" ref={ref} {...props} />;
});

export {Quill};
