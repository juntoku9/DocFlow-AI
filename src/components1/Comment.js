import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//
// Comment
//

const Comment = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('comment', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Comment.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Comment body
//

Comment.Body = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('comment-body', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Comment.Body.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Comment text
//

Comment.Text = React.forwardRef(({ as: Tag = 'p', className, ...props }, ref) => {
  const classes = classNames('comment-text', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Comment.Text.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Comment time
//

Comment.Time = React.forwardRef(({ as: Tag = 'time', className, ...props }, ref) => {
  const classes = classNames('comment-time', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Comment.Time.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Comment title
//

Comment.Title = React.forwardRef(({ as: Tag = 'h5', className, ...props }, ref) => {
  const classes = classNames('comment-title', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Comment.Title.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export {Comment};
