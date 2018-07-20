import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import strings from '../strings';

class ArticleItem extends Component {
  render() {
    const { data, deleteArticle, showControll } = this.props;
    const href = `/article/${data.aid}`;
    return (
      <div className="article-item card-container">
        <p className="article-title">
          <a href={href}>{data.title}</a>
        </p>
        <p className="article-description">
          <a href={href}>{data.description}</a>
        </p>
        <div className="controller">
          <div className="controller-left">
            <div className="view">
              <Icon type="eye-o" />&nbsp;
              <span>{data.view}</span>
            </div>
            <div className="comment">
              <Icon type="message" />&nbsp;
              <span>{data.comments_count}</span>
            </div>
            <div className="like">
              <Icon type="like-o" />&nbsp;
              <span>{data.support_count}</span>
            </div>
            <div className="collect">
              <Icon type="heart-o" />&nbsp;
              <span>{data.collect_count}</span>
            </div>
          </div>
          {showControll &&
            <div className="controller-right">
              <span className="edit">
                <Icon type="edit" />
                <a href={`/edit/${data.aid}`}>{strings.common_edit}</a>
              </span>
              <span className="delete">
                <a onClick={() => deleteArticle(data.aid)}><Icon type="delete" />{strings.common_delete}</a>
              </span>
            </div>}
        </div>
      </div>
    );
  }
}
ArticleItem.propTypes = {
  data: PropTypes.object.isRequired,
  deleteArticle: PropTypes.func.isRequired,
  showControll: PropTypes.bool
};
ArticleItem.defaultProps = {
  showControll: true
};

export default ArticleItem;
