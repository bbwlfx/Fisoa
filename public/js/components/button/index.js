import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from 'lib/utils';
import './scss/button.scss';

export default class Button extends Component {
  render() {
    const {
      loading,
      shape,
      type,
      onClick,
      href,
      target,
      disabled,
      size,
      className,
      children
    } = this.props;

    const _shape = ['circle', 'rect'].includes(shape) ? shape : 'rect';
    const _type = ['dashed', 'primary', 'default'].includes(type) ? type : 'default';
    const _size = ['large', 'small'].includes(size) ? size : 'small';
    const _className = utils.className([
      'mf-button',
      `mf-button-${_shape}`,
      `mf-button-${_type}`,
      `mf-button-${_size}`,
      {
        'mf-button-loading': loading,
        'mf-button-disabled': disabled
      },
      ...className.split(' ')
    ]);

    // return Tag <a>
    if(href) {
      const props = { href };
      if(target) {
        props.target = '_blank';
      }
      return (
        <button
          className={_className}
          disabled={disabled || loading}
          onClick={onClick}
        >
          <a {...props}>
            <span>{children}</span>
          </a>
        </button>
      );
    }

    // return normal button
    return (
      <button
        className={_className}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {!loading && <span>{children}</span>}
        {loading && <i className="icon_loading" />}
      </button>
    );
  }
}

Button.defaultProps = {
  loading: false,
  shape: 'rect',
  type: 'default',
  onClick: () => {},
  href: '',
  target: true,
  disabled: false,
  size: 'small',
  className: '',
  children: null
};
Button.propTypes = {
  loading: PropTypes.bool,
  shape: PropTypes.oneOf(['circle', 'rect']),
  type: PropTypes.oneOf(['dashed', 'primary', 'default']),
  onClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small']),
  className: PropTypes.string,
  children: PropTypes.any
};
