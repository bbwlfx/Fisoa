import React, { Component } from 'react';
import utils from 'lib/utils';
import { GET_DYNAMIC_CONTENT } from 'constants/url';
import Divider from 'components/divider';
import strings from 'strings';
import DynamicItem from './dynamic-item';
import './dynamic.scss';

export default class Dynamic extends Component {
  constructor() {
    super();
    this.state = {
      newData: [],
      oldData: [],
      loading: true
    };
  }
  componentDidMount() {
    utils.fetch(GET_DYNAMIC_CONTENT, {}).then((res) => {
      if(res.type === 0) {
        this.setState({
          newData: res.data.new_record,
          oldData: res.data.old_record,
          loading: false
        });
      }
    }, () => {
      this.setState({
        loading: false
      });
    });
  }
  render() {
    const { newData, oldData, loading } = this.state;
    const hasNew = newData.length > 0;
    const hasOld = oldData.length > 0;
    const hasData = hasNew || hasOld;

    return (
      <div>
        {loading && <div className="loading">{strings.common_loading}</div>}
        {!loading && !hasData && <div className="no-new-record">{strings.nav_no_dynamic}</div>}
        {!loading && hasData &&
        <div className="dynamic-list">
          {!hasNew && <div className="no-new-record">{strings.dynamic_no_new}</div>}
          {hasNew && newData.map((item, index) => <DynamicItem data={item} key={index + 100} />)}
          <Divider>{strings.dynamic_new_content}</Divider>
          {oldData.map((item, index) => <DynamicItem data={item} key={1000 + index} />)}
        </div>}
      </div>
    );
  }
}
