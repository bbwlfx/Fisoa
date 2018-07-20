import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from '../lib/utils';
import '../../scss/text-input.scss';

class TextInput extends Component {
  handleKeyDown(e) {
    const {
      noWrap,
      onEnter,
      value
    } = this.props;

    if(noWrap && e.keyCode === 13) {
      e.preventDefault();
      onEnter(value);
    }
  }

  focus() {
    this.textarea.focus();
  }
  render() {
    const {
      placeholder,
      className,
      onChange,
      showBorder,
      value,
      disabled,
      maxLength,
      spellcheck,
      onClick,
      onBlur
    } = this.props;
    const wrapClassName = utils.className(['flex-text-wrap', ...className.split(' '), {
      'show-border': showBorder,
      'text-input-disabled': disabled
    }]);
    return (<div className={wrapClassName} onClick={onClick}>
      <pre>
        <span>{value || placeholder}</span>
        <br />
      </pre>
      <textarea
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        spellCheck={spellcheck}
        maxLength={maxLength}
        onChange={(e) => {
          const {
            value
          } = e.target;
          onChange(value);
        }}
      />
      {disabled && <div className="text-mask" />}
    </div>);
  }
}

TextInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  noWrap: PropTypes.bool,
  maxLength: PropTypes.number,
  onEnter: PropTypes.func,
  spellcheck: PropTypes.bool,
  onClick: PropTypes.func,
  showBorder: PropTypes.bool,
  onBlur: PropTypes.func
};
TextInput.defaultProps = {
  value: '',
  placeholder: '',
  className: '',
  onChange: () => {},
  disabled: false,
  noWrap: false,
  maxLength: null,
  onEnter: () => {},
  spellcheck: true,
  onClick: () => {},
  showBorder: false,
  onBlur: () => {}
};
export default TextInput;
