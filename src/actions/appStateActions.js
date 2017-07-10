import * as api from '../api';

import { LOAD_APPLICATION_LIST,
				 SET_SELECTED_APPLICATION,
			   CLEAR_APPLICATION_STATE,
			   SET_USER,
			   SET_CURRENT_PAGE } from './actionTypes';

//-----------------------------------------------
export const loadApplicationList = (appList) => {
	return {
		type: LOAD_APPLICATION_LIST,
		appList
	}
};

export const startLoadApplicationList = () => {
	return dispatch => {
		//Get list of Applications in the QVVariables.json file on server
		const request = api.getApplicationNames();
			request.then(data => {
				dispatch(loadApplicationList(data));
			});
	};
};

export const setSelectedApplication = (appName = '') => {
	return {
		type: SET_SELECTED_APPLICATION,
		appName
	};
};

export const clearApplicationState = () => {
	return {
		type: CLEAR_APPLICATION_STATE
	};
};

//sets the current page of application - main, settings, export
export const setCurrentPage = (currPage = 'main') => {
	return {
		type: SET_CURRENT_PAGE,
		currPage
	}
}
export const updateUser = (user) => {
	return {
		type: SET_USER,
		user
	}
}
