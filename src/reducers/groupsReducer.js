import _ from 'lodash';

import { LOAD_APPLICATION_GROUPS,
			 	 UPDATE_GROUP,
			   ADD_GROUP,
			   DELETE_GROUP,
			 	 CLEAR_APPLICATION_STATE } from '../actions';

export const groupsReducer = (state = [], action) => {
	switch (action.type) {
		case LOAD_APPLICATION_GROUPS:
			return (action.groupsArray);
		case UPDATE_GROUP:
			let objIndex = _.findIndex(state, {'id': action.groupObj.id});
			//slice in the updated group
			return [..._.slice(state, 0, objIndex),
							action.groupObj,
							..._.slice(state, objIndex+1)];
		case ADD_GROUP:
			return [...state, action.groupObj];
		case DELETE_GROUP:
			//Remove the group that was deleted
			return state.filter(group => group.id !== action.groupId);
		case CLEAR_APPLICATION_STATE:
			//clear the group info...note, same thing will happened to group fields
			return [];
		default:
			return state;
	}
};
