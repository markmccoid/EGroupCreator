//functions to access data from main electron thread
//to be used with ipc communication
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid');

// make promise version of fs.readFile()
const readFilePromise = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

const GROUPS_FILE = path.join(__dirname, '../', 'qvgroups.json');
const FIELDS_FILE = path.join(__dirname, '../', 'analytixfields.json');

//------------------------------
//--Return sorted distinct list
//--of applications in qvGroups.json
const readAppNamesAsync = () => {
	//Thie will return a promise that we can use in a thunk in redux
	return readFilePromise(GROUPS_FILE)
		.then((data) => {
			let qvGroups = JSON.parse(data);
			let applicationList = _.uniq(qvGroups.map(groupObj => groupObj.application));
			applicationList = _.sortBy(applicationList);
			return applicationList;
		}, (err) => {
			console.log('Error reading AppNames Async', err);
		});
};

//------------------------------
//--For passed appName, return the groups from
//--qvgroups.json - [{},{},...]
const readGroupsForApp = (appName) => {
	return readFilePromise(GROUPS_FILE)
		.then(data => {
			let qvGroups = JSON.parse(data); //convert json to js object
      appName = appName.toLowerCase();
			let appNameSansSpaces = appName.replace(/\s+/g, '');
      let applicationGroups = qvGroups.filter(qvGroup => qvGroup.application.toLowerCase() === appName);
			console.log('groupFileAccess.js', applicationGroups);
			return applicationGroups;
		}, (err) => {
			console.log('Error readGroupsForApp Async', err);
		});
};

//-------------------------------
//--For passed appName, return the Analytix fields
//--from the analytixfields.json - [{},{},...]
const readAnalytixFields = appName => {
	return readFilePromise(FIELDS_FILE)
		.then(data => {
			const reqAppName = appName.toLowerCase();
			const fields = JSON.parse(data);
			const appFields = fields.filter(field => field.application.toLowerCase() === reqAppName);
			return appFields;
		}, (err) => {
			console.log('Error readAnalytixFields Async', err);
		});
}

const updateGroup = groupObj => {
	return readFilePromise(GROUPS_FILE)
		.then(data => {
			let groups = JSON.parse(data);
			//Find the variable to be updated
			groups.forEach(qvGroup => {
				if (qvGroup.id === groupObj.id) {
					qvGroup.application = groupObj.application;
					qvGroup.groupName = groupObj.groupName;
					qvGroup.groupType = groupObj.groupType;
					qvGroup.fields = groupObj.fields;
					qvGroup.groupNotes = groupObj.groupNotes;
					qvGroup.modifyDate = groupObj.modifyDate,
					qvGroup.modifyUser = groupObj.modifyUser;
				}
			});
			//write the variables array back to disk
			fs.writeFile(GROUPS_FILE, JSON.stringify(groups), (err) => {
				if (err) {
					console.log(`Error writing ${GROUPS_FILE} in updateGroup` , err);
				}
				console.log(`updateGroup - ${GROUPS_FILE} written successfully`);
			});
			return 'updateGroup Completed';
		}, (err) => {
			console.log('Error readAnalytixFields Async', err);
		});
};

const updateGroupFieldData = (groupId, fieldsArray, modifyUser) => {
	return readFilePromise(GROUPS_FILE)
		.then(data => {
			let groups = JSON.parse(data);
			groups.forEach(group => {
				if (group.id === groupId) {
					group.fields = fieldsArray;
					group.modifyUser = modifyUser;
				}
			});
			console.log('updateGroupFieldData');
			fs.writeFile(GROUPS_FILE, JSON.stringify(groups), (err) => {
				if (err) {
					console.log(`Error writing ${GROUPS_FILE} in updateGroupFieldData` , err);
				}
				console.log(`updateGroupFieldData - ${GROUPS_FILE}-${groupId} written successfully`);
			});
			return 'success';
		}, (err) => {
			console.log('Error updateGroupFieldData Async', err);
		});
};

const addGroup = groupObj => {
  return readFilePromise(GROUPS_FILE)
    .then(data => {
      let groups = JSON.parse(data);

      let newGroup = {
        id: uuid.v4(),
        application: groupObj.application,
        groupName: groupObj.groupName,
        groupType: groupObj.groupType,
        groupNotes: groupObj.groupNotes || '',
        fields: groupObj.fields,
        createDate: groupObj.createDate,
        modifyDate: '',
        createUser: groupObj.createUser,
        modifyUser: ''
      };
      //--add this new variable object too the variables array
      groups.push(newGroup);
      //write the variables array back to disk
      fs.writeFile(GROUPS_FILE, JSON.stringify(groups), err => {
        if (err) {
          console.log(`Error in addGroup writing ${GROUPS_FILE}`);
        }
        return 'success';
      });
      return newGroup;
    }, (err) => {
			console.log('Error addGroup Async', err);
		});
};

//---------------------------------------------------
//--Delete the matching group from the qvgroups.json file
//---------------------------------------------------
const deleteGroup = groupId => {
    return readFilePromise(GROUPS_FILE)
      .then(data => {
        let groups = JSON.parse(data);
        let filteredGroups = groups.filter(group => group.id !== groupId)
        //write the variables array back to disk
        fs.writeFile(GROUPS_FILE, JSON.stringify(filteredGroups), err => {
          if (err) {
            console.log(`Error in deleteGroup writing ${GROUPS_FILE}`);
          }
          return 'success';
        });
      })
};

module.exports = {
	readAppNamesAsync: readAppNamesAsync,
	readGroupsForApp: readGroupsForApp,
	readAnalytixFields: readAnalytixFields,
	updateGroup: updateGroup,
	updateGroupFieldData: updateGroupFieldData,
  addGroup: addGroup,
  deleteGroup: deleteGroup
}




// const readAppNames = () => {
// 	let qvGroups = fs.readFileSync(GROUPS_FILE);
// 	qvGroups = JSON.parse(qvGroups);
// 	//pull out the application into an array, then use lodash to grab uniques and sort it.
// 	//the _(value) usage of lodash is a feature allowing us to wrap the value and enable implicitmethod chain sequences.
// 	//let applicationList = _(qvGroups.map(groupObj => groupObj.application)).uniq().sortBy();
// 	let applicationList = _.uniq(qvGroups.map(groupObj => groupObj.application));
// 	applicationList = _.sortBy(applicationList);
// 	//console.log(applicationList)
// 	return applicationList;
// };
// 	// fs.readFile(GROUPS_FILE, (err, data) => {
// 	// 	let qvGroups = JSON.parse(data);
// 	// 	//pull out the application into an array, then use lodash to grab uniques and sort it.
// 	// 	//the _(value) usage of lodash is a feature allowing us to wrap the value and enable implicitmethod chain sequences.
// 	// 	//let applicationList = _(qvGroups.map(groupObj => groupObj.application)).uniq().sortBy();
// 	// 	let applicationList = _.uniq(qvGroups.map(groupObj => groupObj.application));
// 	// 	console.log(applicationList)
// 	// 	return applicationList;
// 	// });
