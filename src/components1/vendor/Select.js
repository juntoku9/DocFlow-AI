import classNames from 'classnames';
import React from 'react';
import SelectAlias, { components } from 'react-select';
import { Avatar } from '../Avatar';


const Select = React.forwardRef(({ isSearchable = false, ...props }, ref) => {
  // Control
  const Control = (props) => {
    const selectProps = props.selectProps;
    const selectClassName = selectProps.className;

    const size = selectProps.size;
    const layout = selectProps.layout;
    const isValid = selectClassName && selectClassName.includes('is-valid');
    const isInvalid = selectClassName && selectClassName.includes('is-invalid');

    const classes = classNames(
      layout && `form-control-${layout}`,
      props.isMulti ? 'form-control' : 'form-select',
      props.isMulti && size && `form-control-${size}`,
      !props.isMulti && size && `form-select-${size}`,
      isValid && 'is-valid',
      isInvalid && 'is-invalid'
    );

    return <components.Control className={classes} {...props} />;
  };

  // Menu
  const Menu = (props) => {
    const size = props.selectProps.size;
    const classes = classNames('dropdown-menu', size && `dropdown-menu-${size}`);

    return <components.Menu className={classes} {...props} />;
  };

  // Option
  const Option = (props) => {
    function imgOption(imgSrc, label) {
      return (
        <div className="d-flex align-items-center">
          <Avatar size="xs" className="me-3">
            <Avatar.Image src={imgSrc} className="rounded-circle" alt={label} />
          </Avatar>{' '}
          {label}
        </div>
      );
    }

    return (
      <components.Option className="dropdown-item" {...props}>
        {props.data.imgSrc ? imgOption(props.data.imgSrc, props.label) : props.children}
      </components.Option>
    );
  };

  const styles = {
    control: () => false,
    indicatorsContainer: () => false,
    input: () => false,
    menu: () => false,
    menuList: () => false,
    option: () => false,
    placeholder: () => false,
    singleValue: () => false,
    valueContainer: () => false,
  };

  return (
    <SelectAlias
      classNamePrefix="select"
      components={{ Control, Menu, Option }}
      isSearchable={isSearchable}
      ref={ref}
      styles={styles}
      {...props}
    />
  );
});

export default Select;
export {Select};
