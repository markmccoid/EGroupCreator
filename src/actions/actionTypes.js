//-----App State Action Types -----------------------------------------//
export const LOAD_APPLICATION_LIST = 'LOAD_APPLICATION_LIST';
export const SET_SELECTED_APPLICATION = 'SET_SELECTED_APPLICATION';
//intended to clear out all redux store applying to a loaded application.
//used when moving to different routes and want to make sure no residual store info
//for the application or groups nodes is left.
export const CLEAR_APPLICATION_STATE = 'CLEAR_APPLICATION_STATE';
export const SET_USER = 'SET_USER';

//-----Group Action Types -----------------------------------------//
//-Loads the analytix fields for the selected application
export const LOAD_ANALYTIX_FIELDS = 'LOAD_ANALYTIX_FIELDS';
//-Loads the groups in the qvGroups files for the selected application
export const LOAD_APPLICATION_GROUPS = 'LOAD_APPLICATION_GROUPS';
//-load the fields for each group in the qvGroups file.  The fields are in an array
//-on each group. This load will extract the fields into an object with keys = groupID and then and array of the fields.
export const LOAD_APPLICATION_GROUP_FIELDS = 'LOAD_APPLICATION_GROUP_FIELDS';
//whenever a change in the fields of a group happens all fields are updated.
export const UPDATE_GROUP_FIELDS = 'UPDATE_GROUP_FIELDS';
//whenever a change in the a group happens update the whole group in redux store.
export const UPDATE_GROUP = 'UPDATE_GROUP';
//Adds a new group
export const ADD_GROUP = 'ADD_GROUP';
//Delete a group based on the id passed
export const DELETE_GROUP = 'DELETE_GROUP';
