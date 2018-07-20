import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete } from 'antd';
import utils from '../lib/utils';
import { jobDataSource } from '../constants/setting';
import strings from '../strings';
import '../../scss/question.scss';

const { TextArea } = Input;

class Question extends Component {
  constructor() {
    super();
    utils.bindMethods(['onPressEnter', 'postQuestion'], this);
  }
  onPressEnter() {
    this.textarea.focus();
  }
  render() {
    const { changeTitle, changeTags, changeContent } = this.props;
    return (
      <div className="question-container">
        <div className="question-content">
          <p className="tips">{strings.question_tips}</p>
          <Input
            className="question-title"
            placeholder={strings.question_title_placeholer}
            onPressEnter={this.onPressEnter}
            onChange={changeTitle}
          />
          <AutoComplete
            className="question-field"
            placeholder={strings.question_area_placeholer}
            dataSource={jobDataSource}
            onChange={changeTags}
          />
          <TextArea
            className="question-description"
            placeholder={strings.question_desc_placeholer}
            onChange={changeContent}
          />
        </div>
      </div>
    );
  }
}
Question.propTypes = {
  changeTitle: PropTypes.func.isRequired,
  changeTags: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired
};
export default Question;
