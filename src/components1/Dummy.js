import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Dummy
 */

const Dummy = React.forwardRef(
  ({ component = 'div', className, ...props }, ref) => {
    const Tag = component;
    const classes = classNames('dummy', className);

    return <Tag className={classes} ref={ref} {...props} />;
  }
);

Dummy.propTypes = {
  component: PropTypes.any,
};

export { Dummy };
