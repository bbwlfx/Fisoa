import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HTMLContent extends Component {
  render() {
    const { component, children, ...props } = this.props;
    return React.createElement(component, {
      ...props,
      dangerouslySetInnerHTML: {
        __html: children
      }
    });
  }
}
HTMLContent.propTypes = {
  component: PropTypes.string,
  children: PropTypes.any
};
HTMLContent.defaultProps = {
  component: 'div',
  children: null
};
