import React, { Component } from 'react';
import { GET_ARTICLE_RANK } from 'constants/url';
import { Icon } from 'antd';
import utils from 'lib/utils';
import strings from '../strings';

class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    utils.fetch(GET_ARTICLE_RANK, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          data: res.data
        });
      }
    });
  }
  render() {
    const { data } = this.state;
    const hasData = data.length > 0;
    return (
      <div className="recommend-container card-container">
        <h2 className="title">{strings.recommend_title}</h2>
        <div className="recommend-wrapper">
          <div className={`recommend-content ${hasData ? 'has-data' : 'no-data'}`}>
            {!hasData && strings.no_recomment}
            {hasData &&
              data.map((item, index) =>
                <div key={index} className="recomment-item">
                  <Icon type="star" />
                  <a href={`/article/${item.aid}`}>{`《${item.title}》- 作者:${item.author}`}</a>
                </div>)}
          </div>
        </div>
      </div>
    );
  }
}
export default Recommend;
