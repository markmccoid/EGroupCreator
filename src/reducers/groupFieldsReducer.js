import { LOAD_APPLICATION_GROUPS,
			 	 LOAD_APPLICATION_GROUP_FIELDS,
			 	 UPDATE_GROUP_FIELDS,
			 	 CLEAR_APPLICATION_STATE } from '../actions';

export const groupFieldsReducer = (state = {}, action) => {
	switch (action.type) {
		case LOAD_APPLICATION_GROUP_FIELDS:
			return (action.groupFieldsObject);
		case UPDATE_GROUP_FIELDS:
			let { groupId, groupFieldObject } = action;
			return {
				...state,
				[groupId]: groupFieldObject
			}
		case CLEAR_APPLICATION_STATE:
			return {};
		default:
			return state;
	}
};
