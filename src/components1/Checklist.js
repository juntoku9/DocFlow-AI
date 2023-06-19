import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//
// Checklist
//

const Checklist = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('checklist', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Checklist.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Checklist item
//

Checklist.Item = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('checklist-item', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Checklist.Item.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default Checklist;
