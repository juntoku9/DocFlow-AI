import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//
// Avatar
//

const Avatar = React.forwardRef(({ as: Tag = 'div', ratio, size, status, className, ...props }, ref) => {
  const classes = classNames(
    'avatar',
    ratio && `avatar-${ratio}`,
    size && `avatar-${size}`,
    status && `avatar-${status}`,
    className
  );

  return <Tag className={classes} ref={ref} {...props} />;
});

Avatar.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  ratio: PropTypes.string, // '4by3'
  size: PropTypes.string, // 'xs' | 'sm' | 'lg' | 'xl' | 'xxl'
  status: PropTypes.string, // 'online' | 'offline'
};

//
// Avatar group
//

Avatar.Group = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('avatar-group', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Avatar.Group.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Avatar image
//

Avatar.Image = React.forwardRef(({ as: Tag = 'img', className, ...props }, ref) => {
  const classes = classNames('avatar-img', className);
  // set the default image for avatar when the image fails to load 
  return <Tag className={classes} ref={ref} {...props}                                 
    onError={(event)=>event.target.src="./img/gradient.jpg"}  />;
});

Avatar.Image.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};

//
// Avatar title
//

Avatar.Title = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('avatar-title', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Avatar.Title.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default Avatar;
export {Avatar};
