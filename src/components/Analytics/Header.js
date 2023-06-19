import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Nav } from 'react-bootstrap';

//
// Header
//

const Header = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('header', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};


//
// Header body
//

Header.Body = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('header-body', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.Body.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Header footer
//

Header.Footer = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('header-footer', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.Footer.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Header image top
//

Header.ImageTop = React.forwardRef(({ as: Tag = 'img', className, ...props }, ref) => {
  const classes = classNames('header-img-top', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.ImageTop.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Header pretitle
//

Header.Pretitle = React.forwardRef(({ as: Tag = 'h6', className, ...props }, ref) => {
  const classes = classNames('header-pretitle', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.Pretitle.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Header subtitle
//

Header.Subtitle = React.forwardRef(({ as: Tag = 'p', className, ...props }, ref) => {
  const classes = classNames('header-subtitle', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.Subtitle.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Header tabs
//

Header.Tabs = React.forwardRef(({ className, ...props }, ref) => {
  const classes = classNames('header-tabs', className);

  return <Nav variant="tabs" className={classes} ref={ref} {...props} />;
});

//
// Header title
//

Header.Title = React.forwardRef(({ as: Tag = 'h1', className, ...props }, ref) => {
  const classes = classNames('header-title', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Header.Title.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default Header;
