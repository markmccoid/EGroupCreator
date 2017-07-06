//functions to access data from main electron thread
//to be used with ipc communication
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const GROUPS_FILE = path.join(__dirname, '../', 'qvgroups.json');

const readAppNames = () => {
	console.log(GROUPS_FILE);
	let qvGroups = fs.readFileSync(GROUPS_FILE);
	console.log('after groupload');
	qvGroups = JSON.parse(qvGroups);
	//pull out the application into an array, then use lodash to grab uniques and sort it.
	//the _(value) usage of lodash is a feature allowing us to wrap the value and enable implicitmethod chain sequences.
	//let applicationList = _(qvGroups.map(groupObj => groupObj.application)).uniq().sortBy();
	let applicationList = _.uniq(qvGroups.map(groupObj => groupObj.application));
	applicationList = _.sortBy(applicationList);
	//console.log(applicationList)
	return applicationList;
};
	// fs.readFile(GROUPS_FILE, (err, data) => {
	// 	let qvGroups = JSON.parse(data);
	// 	//pull out the application into an array, then use lodash to grab uniques and sort it.
	// 	//the _(value) usage of lodash is a feature allowing us to wrap the value and enable implicitmethod chain sequences.
	// 	//let applicationList = _(qvGroups.map(groupObj => groupObj.application)).uniq().sortBy();
	// 	let applicationList = _.uniq(qvGroups.map(groupObj => groupObj.application));
	// 	console.log(applicationList)
	// 	return applicationList;
	// });



module.exports = {
	readAppNames: readAppNames
}
