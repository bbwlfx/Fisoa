import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FeedCard from './feed-card';

class FeedList extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className="feed-list">
        {data.map((item, index) => (
          <FeedCard key={index} data={item} />
        ))}
      </div>
    );
  }
}
FeedList.defaultProps = {};
FeedList.propTypes = {
  data: PropTypes.array.isRequired
};
export default FeedList;
