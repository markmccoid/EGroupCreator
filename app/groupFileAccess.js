//functions to access data from main electron thread
//to be used with ipc communication
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// make promise version of fs.readFile()
const readFileAsync = (filename) => {
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

//-------------------------------
const readAppNamesAsync = () => {
	//Thie will return a promise that we can use in a thunk in redux
	return readFileAsync(GROUPS_FILE)
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
const readGroupsForApp = (appName) => {
	return readFileAsync(GROUPS_FILE)
		.then(data => {
			let qvGroups = JSON.parse(data); //convert json to js object
      let appName = appName.toLowerCase();
			let appNameSansSpaces = appName.replace(/\s+/g, '');
      let applicationGroups = qvGroups.filter(qvGroup => qvGroup.application.toLowerCase() === appName);
			return applicationGroups;
		}, (err) => {
			console.log('Error readGroupsForApp Async', err);
		});

}


module.exports = {
	readAppNamesAsync: readAppNamesAsync,
	readGroupsForApp: readGroupsForApp
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
