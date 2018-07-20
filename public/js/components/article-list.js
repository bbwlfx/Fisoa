import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticleItem from './article-item';

class ArticleList extends Component {
  render() {
    const { data, deleteArticle, showControll } = this.props;
    return (
      <div className="feed-list">
        {data.map((item, index) => (
          <ArticleItem key={index} data={item} deleteArticle={deleteArticle} showControll={showControll} />
        ))}
      </div>
    );
  }
}
ArticleList.propTypes = {
  data: PropTypes.array.isRequired,
  deleteArticle: PropTypes.func,
  showControll: PropTypes.bool
};
ArticleList.defaultProps = {
  showControll: true,
  deleteArticle: () => {}
};
export default ArticleList;
