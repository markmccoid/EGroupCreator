import React from 'react';
import PropTypes from 'prop-types';
import fileSaver from 'file-saver';
var alertify = require('alertifyjs');

import { getXMLApplicationVariables } from '../../api';

//-Component gets the list of variables in an XML format from the server
//-Then uses the file-saver module to save the file
const ExportXML = ({ appName }) => {
	const handleXMLDownload = () => {
		getXMLApplicationVariables(appName)
			.then(data => alertify.success(`successfully saved XML for ${appName}`));
	};
	return (
			<a className="button primary" onClick={handleXMLDownload}>Create XML for {appName}</a>
	)
};

ExportXML.propTypes = {
	appName: PropTypes.string
}
export default ExportXML;
