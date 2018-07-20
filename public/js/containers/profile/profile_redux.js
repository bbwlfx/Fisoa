import { combineReducers } from 'redux';

const ADD_FANS = 'ADD_FANS';
const MINUS_FANS = 'MINUS_FANS';

const initState = {
  fans: 0
};

const fans = (state = initState, action) => {
  switch(action.type) {
    case ADD_FANS:
      return state + 1;
    case MINUS_FANS:
      return state - 1;
    default:
      return state;
  }
};

export default combineReducers({
  fans
});

const addFans = () => dispatch =>
  dispatch({
    type: ADD_FANS
  });
const minusFans = () => dispatch =>
  dispatch({
    type: MINUS_FANS
  });

export {
  addFans,
  minusFans
};

