import * as ActionTypes from '../actionType';

export function updateUserInfo(data) {
  return {
    type: ActionTypes.UPDATE_USER_INFO,
    data,
  };
}
