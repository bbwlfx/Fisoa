import React, { Component } from 'react';
import moment from 'moment';
import { ADMIN_GET_BULLETIN } from 'constants/url';
import utils from 'lib/utils';
import { message } from 'antd';
import strings from '../../../strings';
import TabHead from './tab-head';
import '../../../../scss/userspace-home.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bulletinList: []
    };
  }

  componentDidMount() {
    this.getBulletin();
  }

  getBulletin() {
    utils.fetch(ADMIN_GET_BULLETIN, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          bulletinList: res.data
        });
      } else {
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      message.error(strings.common_server_error);
    });
  }

  render() {
    const { bulletinList } = this.state;
    const hasBulletin = bulletinList.length > 0;
    return (
      <div>
        <TabHead curTab={TabHead.Home} />
        <div className="home-container card-container">
          <ul>
            {!hasBulletin && <div className="no-bulletin">暂无公告</div>}
            {hasBulletin && bulletinList.map((item, index) => (
              <li key={index}>
                <a href={`/article/${item.aid}`}>
                  <span className="title">{item.title}</span>
                  <span className="date">{moment(+item.time).format('YYYY-MM-DD')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
Home.propTypes = {};
Home.defaultProps = {};
