var alertify = require('alertifyjs');
import _ from 'lodash';

//confirmDialog
//@@Params
//  -- title - title shown in dialog header
//  -- msg - message shown in dialog
//  -- okfn - Callback when OK is pressed
//  -- cancelfn - Callback when Cancel is pressed
//---------------------------------------------
//--Example call:
// confirmDialog('Cancel Editing?','Ok to cancel adding of new field.',
//								this.cancelEditing, null);
//---------------------------------------------
export const confirmDialog = (title='', msg='', okfn, cancelfn = undefined, successMsg = undefined) => {
	alertify.confirm(title,  msg,
					() => {
						//Run the ok callback function
							okfn();
							successMsg && alertify.success(successMsg);
					},
					() => {
						//Run the cancel callback function only if it is defined
						if(cancelfn) {
							cancelfn();
						}
					}).set('labels', {ok: alertify.defaults.glossary.ok, cancel: alertify.defaults.glossary.cancel});
};

//-------------------------------------------------
//filterGroups
//@@Params
//  -- groupData - in redux group.groupInfo array of objects
//	-- groupFields - an object containing the fields of each group { groupId: [array of fields] }
//  -- searchText - text to search
//	-- searchBy - either 'searchGroups' or 'searchFields'
//  -- fitlerByType - if populated search by passed typed. 'cyclic', 'drill', 'all'
//---------------------------------------------
//---------------------------------------------
export const filterGroups = (groupData, groupFields, searchText, searchBy, filterByType = 'all') => {

	//----------------------
	//--Function to search by Field Names
	//----------------------
	const searchFields = (filteredGroupData, reSearchString) => {

		let groupFieldsArray = Object.keys(groupFields).map(groupId => {
				return groupFields[groupId].map(field => {
					return { id: groupId, fieldName: field.fieldName };
				});
			//return {id: groupId, fieldName: groupFields[groupId].fieldName};
		});
		//the above gives us [[obj, obj], [obj,obj, obj],...]  Need to flatten it to a single array of objects
		groupFieldsArray = _.flatMap(groupFieldsArray, (n) => [...n]);
		let filteredFields = _.filter(groupFieldsArray, obj => {
			return obj.fieldName.toLowerCase().match(reSearchString);
		});
		//Need to extract groupIds from array of objects
		let filteredGroupIds = filteredFields.map(field => field.id);
		//Now loop through the groupData and only return groups with an id that matches one in the filteredGroupIds array
		return filteredGroupData.filter(group => {
			//if the filter returns an array that is not zero length then return true to include that group in results.
			return filteredGroupIds.filter(groupid => groupid === group.id).length > 0
		});
	};

	const searchGroups = (filteredGroupData, reSearchString) => {
		console.log(filteredGroupData);
		return filteredGroupData.filter(group => {
			if (group.groupName) {
				return group.groupName.toLowerCase().match(reSearchString);
			}
		});
	};

	//Make a copy of data to work on
	let filteredGroupData = [...groupData];

	//first deal with filterByType
	if (filterByType !== 'all') {
		//return filteredGroupData filtered by groupType
		//Will need to change how the switch statement below works
		//It is return based on group data.  Need to be based on filtered if filtered.
		filteredGroupData = filteredGroupData.filter(group => {
			return group.groupType.toLowerCase() === filterByType;
		});
		console.log('filter', filteredGroupData)
	}
	//Deal with searchText if passed
	if (searchText.length > 0) {
		//convert input string to a regular expression object to pass to match function
		let reSearchString = new RegExp(_.escapeRegExp(searchText.toLowerCase()), "g");
		switch (searchBy) {
			case 'searchFields':
				return searchFields(filteredGroupData, reSearchString);
				break;
			case 'searchGroups':
				return searchGroups(filteredGroupData, reSearchString);
				break;
			default:
				console.log('Search/filter group Error');
		}
	} else {
		return filteredGroupData;
	}


	// //If fieldSearch
	// if (searchBy === 'searchFields' && searchText.length > 0) {
	// 	let groupFieldsArray = Object.keys(groupFields).map(groupId => {
	// 			return groupFields[groupId].map(field => {
	// 				return { id: groupId, fieldName: field.fieldName };
	// 			});
	// 		//return {id: groupId, fieldName: groupFields[groupId].fieldName};
	// 	});
	// 	//the above gives us [[obj, obj], [obj,obj, obj],...]  Need to flatten it to a single array of objects
	// 	groupFieldsArray = _.flatMap(groupFieldsArray, (n) => [...n]);
	// 	let filteredFields = _.filter(groupFieldsArray, obj => {
	// 		return obj.fieldName.toLowerCase().match(reSearchString);
	// 	});
	// 	//Need to extract groupIds from array of objects
	// 	let filteredGroupIds = filteredFields.map(field => field.id);
	// 	//Now loop through the groupData and only return groups with an id that matches one in the filteredGroupIds array
	// 	filteredGroupData = filteredGroupData.filter(group => {
	// 		//if the filter returns an array that is not zero length then return true to include that group in results.
	// 		return filteredGroupIds.filter(groupid => groupid === group.id).length > 0
	// 	});
	//
	// }
	//filter by searchText
	// if (searchBy === 'searchGroups' && searchText.length > 0) {
	//
	// 	filteredGroupData = filteredGroupData.filter(group => {
	// 		if (group.groupName) {
	// 			return group.groupName.toLowerCase().match(reSearchString);
	// 		}
	// 	});
	// }
	//filter by type
	//return filteredGroupData;
};
