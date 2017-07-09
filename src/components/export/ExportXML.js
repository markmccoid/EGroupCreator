import React from 'react';
import PropTypes from 'prop-types';
import fileSaver from 'file-saver';
var alertify = require('alertifyjs');

import { getXMLApplicationVariables } from '../../api';

//-Component gets the list of variables in an XML format from the server
//-Then uses the file-saver module to save the file
const ExportXML = ({ appName }) => {
	const handleXMLDownload = () => {
		alertify.confirm('XML Download', `Save To Server Or Download XML File`,
							() => {
									//this function call the server which WILL write the XML file to the include directory.
									//then it will download a local copy for the user
									getXMLApplicationVariables(appName)
										.then(data => alertify.notify('Saved to Server', 'success'));
							},
							() => {
								//this function call the server which WILL write the XML file to the include directory.
								//then it will download a local copy for the user
								getXMLApplicationVariables(appName)
									.then((data) => {
										var blob = new Blob([data], {type: "text/plain;charset=utf-8"})
										fileSaver.saveAs(blob, `${appName}Groups.xml`);
										alertify.notify('Saved to Server and Downloaded', 'success');
									});
							}).set('labels', {ok:' Save To Server ', cancel:' Local Download '});
	};
	return (
			<a className="button primary" onClick={handleXMLDownload}>Create XML for {appName}</a>
	)
};

ExportXML.propTypes = {
	appName: PropTypes.string
}
export default ExportXML;
