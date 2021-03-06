import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
const { ipcRenderer }  = window.require('electron');

import { createEmptyGroupObj } from '../api';
import AppSidebar from './AppSidebar';
import GroupCreator from './GroupCreator';
import SettingsContainer from './settings/SettingsContainer';
import ExportContainer from './export/ExportContainer';

import { startLoadApplicationList,
 				 setSelectedApplication,
				 startAddGroup
			 } from '../actions';


class MainDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//dispatch action to get the unique application names stored in qvGroups.json
		this.props.getApplicationNames();
 }

	handleLoadApplication = appName => {
		//call action to update redux store with clicked on application
		this.props.setSelectedApplication(appName);
	}

	render() {
		let selectedApplication = this.props.selectedApplication || '';
    if (this.props.currentPage === 'main') {
      return (
  			<div className="content-container">
  				<nav className="content-nav">
  					<h5 style={{textAlign: "center"}}>Applications</h5>
  					<AppSidebar
  						applicationList={this.props.applicationList}
  						onLoadApplication={this.handleLoadApplication}
  						selectedApplication={selectedApplication}
  					/>
  				</nav>
  				<main className="content-body">
  						{selectedApplication ? null : <h2>Select an Application</h2>  }
                <GroupCreator
        					selectedApplication={selectedApplication}
        				/>
  						{/*<Route path="/app/:appName" component={GroupCreator} />*/}
  				</main>
  			</div>
  		);
    } else if (this.props.currentPage === 'settings') {
      return <SettingsContainer />;
    } else {   //must be export
      return <ExportContainer />;
    }

}
};

const mapStateToProps = (state) => {
	return {
		user: state.applications.user,
  	currentPage: state.applications.currentPage,
		applicationList: state.applications.applicationList || [],
		selectedApplication: state.applications.selectedApplication || ''
	}
}

// const mapDispatchToProps = dispatch => {
// 	return {
// 		onSaveItem(uid, itemObj) {
// 			dispatch(startSaveItem(uid, itemObj));
// 		}
// 	};
// };

export default connect(mapStateToProps, {
	getApplicationNames: startLoadApplicationList,
	setSelectedApplication: setSelectedApplication,
	addGroup: startAddGroup
})(MainDisplay);


// <GroupCreator
// 	selectedApplication={this.props.selectedApplication}
// />
