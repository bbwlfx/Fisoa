import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import strings from 'strings';
import 'scss/question-item.scss';

class QAItem extends Component {
  render() {
    const { data, deleteQuestion, showControll } = this.props;
    const href = `/question/${data.qid}`;
    return (
      <div className="question-item card-container">
        <p className="question-title">
          <a href={href}>{data.title}</a>
        </p>
        <p className="question-description">
          <a href={href}>{data.content}</a>
        </p>
        <div className="controller">
          <div className="controller-left">
            <div className="comment">
              <Icon type="message" />&nbsp;
              <span>{data.comments_count}</span>
            </div>
          </div>
          {showControll &&
            <div className="controller-right">
              <span className="delete">
                <a onClick={() => deleteQuestion(data.qid)}><Icon type="delete" />{strings.common_delete}</a>
              </span>
            </div>}
        </div>
      </div>
    );
  }
}
QAItem.propTypes = {
  data: PropTypes.object.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  showControll: PropTypes.bool
};
QAItem.defaultProps = {
  showControll: true
};

export default QAItem;
