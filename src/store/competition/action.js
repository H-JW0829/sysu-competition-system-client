import * as ActionTypes from '../actionType';

export function updateCompetitionInfo(data) {
  return {
    type: ActionTypes.UPDATE_COMPETITION_INFO,
    data,
  };
}
