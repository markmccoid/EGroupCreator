import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
const groupFileAccess = window.require('../app/groupFileAccess');


export const createEmptyGroupObj = (appName, user) => {
	return {
    application: appName,
  	groupName: "_c_NEWGROUP",
    groupType: "Cyclic",
    groupNotes: "",
		fields: [],
    createDate: moment().unix(),
		createUser: user
	};
};

//call the read app name function on the main electron process
export const getApplicationNames = () => {
	return groupFileAccess.readAppNamesAsync();
};

//Get qvGroups.json information from server
const getGroups = appName => {
	return groupFileAccess.readGroupsForApp(appName)
		.then(data => data);
};

//Get the group data from qvGroups.json, but do not return the field information
//for the apps groups.
export const getGroupData = appName => {
	return getGroups(appName)
		.then(groupData => {
			//take group data and extract just the group information that we want
			return groupData.map(group => {
				return {
					id: group.id,
					application: group.application,
					groupName: group.groupName,
					groupType: group.groupType,
					groupNotes: group.groupNotes,
					createUser: group.createUser,
					createDate: group.createDate,
					modifyUser: group.modifyUser,
					modifyDate: group.modifyDate
				}
			});
		});
};

//Get the field information for all the groups for the passed appName.
//We are transforming the group field data from an array of fields with group ids,
//to an object with the group ids as object keys
/*
***data before******************:
	[{
		id: 11-11--111,
		fields: [{...}],
		...
	},
	{
		id: 22-22--222,
		fields: [{...}],
		....
	}
	]
	***data after******************:
	{
		11-11--111: [
			{fieldinfo...}
		],
		22-22--222: [
			{fieldinfo...}
		]
	}
*/
export const getGroupFieldData = appName => {
	return getGroups(appName)
		.then(groupData => {
			return _.transform(groupData, (result, value, key) => {
				value.fields.forEach(field => {
					(result[value.id] || (result[value.id] = [])).push(field);
				});
			}, {});
		});
}

//--Update the fields of the groupId passed
export const updateGroupFieldData = (groupId, fieldsArray, modifyUser) => {
	return groupFileAccess.updateGroupFieldData(groupId, fieldsArray, modifyUser)
		.then(response => {
			console.log(response);
			return response; //expect 200 for success
		});
};

//--Update the group based on groupObj.id
export const updateGroup = groupObj => {
	return groupFileAccess.updateGroup(groupObj)
		.then(response => {
			console.log(response);
			return response;
		});
};
//returns an object containing the fields for the passed appName
export const getAnalytixFields = appName => {
	return groupFileAccess.readAnalytixFields(appName)
		.then(analytixFields => analytixFields);
};

//--Add a new group to the qvGroups.json file
export const addGroup = groupObj => {
	return axios.post(`/api/groups/`, groupObj)
		.then(response => {
			console.log(response);
			return response.data;
		})
}

//--Delete group from the qvGroups.json file based on the group id passed
export const deleteGroup = groupId => {
	return axios.delete(`/api/groups/${groupId}`)
		.then(response => {
			console.log(response);
			return response.data;
		})
}

//Returns XML for the Groups of the passed appName (application)
export const getXMLApplicationVariables = appName => {
		console.log(`/api/groups/app/${appName}?format=xml`);
		return axios.get(`/api/groups/app/${appName}?format=xml`)
			.then(response => response.data);
};
