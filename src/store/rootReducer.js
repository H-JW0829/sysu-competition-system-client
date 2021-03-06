// rootReducer.ts
// 合并所有的reducer
import { combineReducers } from 'redux';
import userInfo from './user/reducer';
import competitionInfo from './competition/reducer';
const rootReducer = combineReducers({
  userInfo,
  competitionInfo,
});

export default rootReducer;
