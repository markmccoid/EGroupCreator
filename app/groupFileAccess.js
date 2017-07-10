//functions to access data from main electron thread
//to be used with ipc communication
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid');
const X2JS = require('x2js'); //npm module to convert js object to XML
const { remote } = require('electron');

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

//Can't access the remote.app. feature except from within a function.  Probably after app has loaded.
//passed either GROUPS_FILE or FIELDS_FILE, will return the path, relative to where the GroupCreate.EXE
//is located.
const getLocalFile = (dataFile) => {
	if (process.env.NODE_ENV === 'development') {
		return path.join(remote.app.getAppPath(), '/data', dataFile);
	}
	return path.join(path.dirname(remote.app.getPath('exe')), '/data', dataFile);
};
const GROUPS_FILE = 'qvgroups.json';
const FIELDS_FILE = 'analytixfields.json';

//------------------------------
//--Return sorted distinct list
//--of applications in qvGroups.json
const readAppNamesAsync = () => {
	// console.log('HOME Path', remote.app.getPath('home'));
	// console.log('APPDATA Path', remote.app.getPath('appData'));
	//console.log('EXE Path', remote.app.getPath('exe'));
	// console.log('getAppPath', remote.app.getAppPath())
	//console.log('GROUPFILE LOCATION', getLocalFile(GROUPS_FILE));

	//Thie will return a promise that we can use in a thunk in redux
	return readFilePromise(getLocalFile(GROUPS_FILE))
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
	return readFilePromise(getLocalFile(GROUPS_FILE))
		.then(data => {
			let qvGroups = JSON.parse(data); //convert json to js object
      appName = appName.toLowerCase();
			let appNameSansSpaces = appName.replace(/\s+/g, '');
      let applicationGroups = qvGroups.filter(qvGroup => qvGroup.application.toLowerCase() === appName);
			return applicationGroups;
		}, (err) => {
			console.log('Error readGroupsForApp Async', err);
		});
};

//-------------------------------
//--For passed appName, return the Analytix fields
//--from the analytixfields.json - [{},{},...]
const readAnalytixFields = appName => {
	return readFilePromise(getLocalFile(FIELDS_FILE))
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
	return readFilePromise(getLocalFile(GROUPS_FILE))
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
			fs.writeFile(getLocalFile(GROUPS_FILE), JSON.stringify(groups), (err) => {
				if (err) {
					console.log(`Error writing ${getLocalFile(GROUPS_FILE)} in updateGroup` , err);
				}
				//console.log(`updateGroup - ${getLocalFile(GROUPS_FILE)} written successfully`);
			});
			return 'updateGroup Completed';
		}, (err) => {
			console.log('Error readAnalytixFields Async', err);
		});
};

const updateGroupFieldData = (groupId, fieldsArray, modifyUser) => {
	return readFilePromise(getLocalFile(GROUPS_FILE))
		.then(data => {
			let groups = JSON.parse(data);
			groups.forEach(group => {
				if (group.id === groupId) {
					group.fields = fieldsArray;
					group.modifyUser = modifyUser;
				}
			});
			fs.writeFile(getLocalFile(GROUPS_FILE), JSON.stringify(groups), (err) => {
				if (err) {
					console.log(`Error writing ${getLocalFile(GROUPS_FILE)} in updateGroupFieldData` , err);
				}
//				console.log(`updateGroupFieldData - ${getLocalFile(GROUPS_FILE)}-${groupId} written successfully`);
			});
			return 'success';
		}, (err) => {
			console.log('Error updateGroupFieldData Async', err);
		});
};

const addGroup = groupObj => {
  return readFilePromise(getLocalFile(GROUPS_FILE))
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
      fs.writeFile(getLocalFile(GROUPS_FILE), JSON.stringify(groups), err => {
        if (err) {
          console.log(`Error in addGroup writing ${getLocalFile(GROUPS_FILE)}`);
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
    return readFilePromise(getLocalFile(GROUPS_FILE))
      .then(data => {
        let groups = JSON.parse(data);
        let filteredGroups = groups.filter(group => group.id !== groupId)
        //write the variables array back to disk
        fs.writeFile(getLocalFile(GROUPS_FILE), JSON.stringify(filteredGroups), err => {
          if (err) {
            console.log(`Error in deleteGroup writing ${getLocalFile(GROUPS_FILE)}`);
          }
          return 'success';
        });
      })
};

//Takes the appName and writes out an XML file of the groups data to the Spreadsheets directory
//returns the applicationGroups data
const getXMLData = appName => {
	return readGroupsForApp(appName)
		.then(applicationGroups => {
			let appNameSansSpaces = appName.replace(/\s+/g, '');
			const x2js = new X2JS();
			let xmlString = x2js.js2xml({group: applicationGroups});
			//Enclose xml created with the appName, otherwise Qlik won't recognize properly
			applicationGroups = `<${appNameSansSpaces}>${xmlString}</${appNameSansSpaces}>`;
			//write the groups array back to the server disk navigating to the include directory
			let xmlFilePathName = process.env.NODE_ENV === 'development' ?
							 path.join(remote.app.getAppPath(), '../Spreadsheets/', `${appName}Groups.xml`)
							 :
							 path.join(path.dirname(remote.app.getPath('exe')), '../Spreadsheets/', `${appName}Groups.xml`);
			fs.writeFile(xmlFilePathName, applicationGroups, (err) => {
				if (err) console.log(`Error Writing: ${appName}Groups.xml`, err)
				console.log(`file written: ${appName}Groups.xml`);
			});
			return applicationGroups;
		});
}
module.exports = {
	readAppNamesAsync: readAppNamesAsync,
	readGroupsForApp: readGroupsForApp,
	readAnalytixFields: readAnalytixFields,
	updateGroup: updateGroup,
	updateGroupFieldData: updateGroupFieldData,
  addGroup: addGroup,
  deleteGroup: deleteGroup,
	getXMLData: getXMLData
}
