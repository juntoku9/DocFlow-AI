import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Kanban = {};

//
// Kanban add form
//

Kanban.AddForm = React.forwardRef(({ as: Tag = 'form', className, ...props }, ref) => {
  const classes = classNames('kanban-add-form', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Kanban.AddForm.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Kanban category
//

Kanban.Category = React.forwardRef(({ as: Tag = 'div', className, ...props }, ref) => {
  const classes = classNames('kanban-category', className);

  return <Tag className={classes} ref={ref} {...props} />;
});

Kanban.Category.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

//
// Kanban item
//

Kanban.Item = React.forwardRef(({ as: Tag = 'div', dragging, dropped, className, ...props }, ref) => {
  const classes = classNames(
    'kanban-item',
    dragging && 'kanban-item-dragging',
    dropped && 'kanban-item-dropped',
    className
  );

  return <Tag className={classes} ref={ref} {...props} />;
});

Kanban.Item.propTypes = {
  as: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  dragging: PropTypes.bool,
};

export {Kanban};
