import * as api from '../api';

import { LOAD_APPLICATION_GROUPS,
 				 LOAD_APPLICATION_GROUP_FIELDS,
			 	 UPDATE_GROUP_FIELDS,
			 	 UPDATE_GROUP,
			   ADD_GROUP,
			   DELETE_GROUP } from './actionTypes';

//-----------------------------------------------
//-LOAD OF GROUPS For an Application
export const loadGroups = groupsArray => {
	return {
		type: LOAD_APPLICATION_GROUPS,
		groupsArray
	};
};

export const startLoadGroups = appName => {
	return dispatch => {
		api.getGroupData(appName)
			.then(data => dispatch(loadGroups(data))
			);
	};
};

//-----------------------------------------------
//-LOAD OF GROUP FIELDS For an Application
export const loadGroupFields = groupFieldsObject => {
	return {
		type: LOAD_APPLICATION_GROUP_FIELDS,
		groupFieldsObject
	};
};

export const startLoadGroupFields = appName => {
	return dispatch => {
		api.getGroupFieldData(appName)
			.then(data => dispatch(loadGroupFields(data))
			);
	};
};

//-----------------------------------------------
//-UPDATE A GROUP for the passed GroupObj -- based on the id in the groupObj.
export const updateGroup = (groupObj) => {
	return {
		type: UPDATE_GROUP,
		groupObj
	};
};

export const startUpdateGroup = (groupObj) => {
	return dispatch => {
		api.updateGroup(groupObj)
			.then(response => {
				dispatch(updateGroup(groupObj));
			});
	};
};

//-----------------------------------------------
//-UPDATE GROUP FIELDS For a single Group
export const updateGroupFields = (groupId, groupFieldObject) => {

	return {
		type: UPDATE_GROUP_FIELDS,
		groupId,
		groupFieldObject
	};
};

export const startUpdateGroupFields = (groupId, groupFieldArray, modifyUser) => {
	return dispatch => {
		api.updateGroupFieldData(groupId, groupFieldArray, modifyUser)
			.then(response => {
				dispatch(updateGroupFields(groupId, groupFieldArray));
			});
	};
};

//-----------------------------------------------
//-ADD GROUP record based on passed group Obj
export const addGroup = groupObj => {
	return {
		type: ADD_GROUP,
		groupObj
	};
};

export const startAddGroup = groupObj => {
	return dispatch => {
		api.addGroup(groupObj)
			.then(data => {
				dispatch(addGroup(data));  //Post to server will return a new group object with the uuid added.
			});
	};
};

//-----------------------------------------------
//-DELETE GROUP based on Group id passed
export const deleteGroup = groupId => {
	return {
		type: DELETE_GROUP,
		groupId
	};
};

export const startDeleteGroup = groupId => {
	return dispatch => {
		api.deleteGroup(groupId)
			.then(response => {
				dispatch(deleteGroup(groupId));
			});
	};
};
