import * as api from '../api';

import { LOAD_ANALYTIX_FIELDS } from './actionTypes';

export const loadAnalytixFields = fieldsArray => {
	return {
		type: LOAD_ANALYTIX_FIELDS,
		fieldsArray
	};
};

export const startLoadAnalytixFields = appName => {
	return dispatch => {
		api.getAnalytixFields(appName)
			.then(data => {
				dispatch(loadAnalytixFields(data));
			});
	};
};
