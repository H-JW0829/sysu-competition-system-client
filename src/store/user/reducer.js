import * as ActionTypes from '../actionType';
import { combineReducers } from 'redux';

const initialState = {
  id: '',
  name: '',
  role: '',
  tel: '',
  staffId: '',
};

function userInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_USER_INFO:
      return {
        ...state,
        ...action.data,
      };
    // return action.data;
    default:
      return state;
  }
}

export default userInfo;
