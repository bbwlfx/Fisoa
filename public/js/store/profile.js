import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import profileReducer from '../containers/profile/profile_redux';

export default initState => createStore(profileReducer, initState, applyMiddleware(thunk));
