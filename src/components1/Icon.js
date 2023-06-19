import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//
// Icon
//

const Icon = React.forwardRef(({ as: Tag = 'div', active, className, ...props }, ref) => {
  const classes = classNames('icon', active && 'active', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Icon.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default Icon;
