import { LOAD_APPLICATION_LIST,
 				 SET_SELECTED_APPLICATION,
				 LOAD_ANALYTIX_FIELDS,
				 CLEAR_APPLICATION_STATE,
				 SET_USER
			 } from '../actions';

export const appStateReducer = (state = {}, action) => {
	switch (action.type) {
		case LOAD_APPLICATION_LIST:
			return { ...state,
				applicationList: action.appList
			};
		case SET_SELECTED_APPLICATION:
			return {
				...state,
				selectedApplication: action.appName
			};
		case LOAD_ANALYTIX_FIELDS:
			return {
				...state,
				selectedApplicationFields: action.fieldsArray
			};
		case CLEAR_APPLICATION_STATE:
			return {
				...state,
				selectedApplication: '',
				selectedApplicationFields: []
			};
		case SET_USER:
			return {
				...state,
				user: action.user
			};
		default:
			return state;
	}
};
