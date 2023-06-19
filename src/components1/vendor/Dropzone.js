import classNames from 'classnames';
import React from 'react';
import DropzoneAlias from 'react-dropzone';

function Dropzone({ multiple, className, ...props }) {
  const classes = classNames('dropzone', multiple && 'dropzone-multiple', className);

  return (
    <DropzoneAlias multiple={multiple} {...props}>
      {({ getRootProps, getInputProps }) => (
        <div className={classes} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="dz-message">Drop or select file to upload</div>
        </div>
      )}
    </DropzoneAlias>
  );
}

// export default Dropzone;
export {Dropzone};
