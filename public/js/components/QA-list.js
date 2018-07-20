import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QAItem from './QA-item';

class QAList extends Component {
  render() {
    const { data, deleteQuestion, showControll } = this.props;
    return (
      <div className="feed-list">
        {data.map((item, index) => (
          <QAItem key={index} data={item} deleteQuestion={deleteQuestion} showControll={showControll} />
        ))}
      </div>
    );
  }
}
QAList.propTypes = {
  data: PropTypes.array.isRequired,
  deleteQuestion: PropTypes.func,
  showControll: PropTypes.bool
};
QAList.defaultProps = {
  showControll: true,
  deleteQuestion: () => {}
};
export default QAList;
