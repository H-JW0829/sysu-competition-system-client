import * as ActionTypes from '../actionType';
import { combineReducers } from 'redux';

const initState = {
  competitions: [],
};

function competitionInfo(state = initState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_COMPETITION_INFO:
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
}

export default competitionInfo;
