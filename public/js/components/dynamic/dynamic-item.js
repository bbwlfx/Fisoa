import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from 'components/tag';
import { articleType } from 'constants/articleType';
import moment from 'moment';
import strings from 'strings';

export default class DynamicItem extends Component {
  render() {
    const { data } = this.props;
    const isArticle = data.type === articleType.Article;
    const href = isArticle ? `/article/${data.id}` : `/question/${data.id}`;
    const union = isArticle ? '发布了' : '提问了';
    const color = isArticle ? '#0084ff' : '#43d480';
    return (
      <div className="dynamic-item">
        <Tag color={color}>{isArticle ? strings.common_article : strings.common_question}</Tag>
        <span className="content">
          <a href={`/profile/${data.uid}`} target="_blank">{data.nickname}</a>&nbsp;
          {union}&nbsp;
          《<a href={href} target="_blank">{data.title}</a>》&nbsp;
          {<span className="time">{moment(+data.time).format('MM-DD hh:mm')}</span>}
        </span>
      </div>
    );
  }
}

DynamicItem.propTypes = {
  data: PropTypes.object.isRequired
};
