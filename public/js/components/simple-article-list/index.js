import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import strings from 'strings';
import Button from 'components/button';
import './simple-article-list.scss';

export default class SimpleArticleList extends Component {
  constructor() {
    super();
    moment.locale('zh-cn');
  }
  render() {
    const { list, uid, loading } = this.props;
    const hasList = list.length > 0;
    return (
      <div className="simple-article-list-container">
        {loading && <div className="no-data">{strings.story_loading_other_articles}</div>}
        {!hasList && !loading && <div className="no-data">{strings.no_article}</div>}
        {hasList && !loading && <div className="simple-article-list-wrapper">
          {
            list.map((item, index) =>
              (<ul className="simple-article-list" key={index}>
                <li className="simple-article-list-item">
                  <a href={`/article/${item.aid}`}>
                    <div className="article-info">
                      <p className="title">{item.title}</p>
                      <p>
                        <span className="view">{`${item.view}阅读`}</span>
                        <span className="time">{moment(+item.time).format('YYYY-MM-DD')}</span>
                      </p>
                    </div>
                    {item.cover && <div className="cover">
                      <img src={item.cover} />
                    </div>}
                  </a>
                </li>
              </ul>))
          }
          <div className="view-more">
            <a href={`/profile/${uid}`}>
              <Button>{strings.story_view_more}</Button>
            </a>
          </div>
        </div>}
      </div>
    );
  }
}

SimpleArticleList.propTypes = {
  list: PropTypes.array.isRequired,
  uid: PropTypes.number.isRequired,
  loading: PropTypes.bool
};
SimpleArticleList.defaultProps = {
  loading: false
};
