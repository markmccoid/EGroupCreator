import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
const { ipcRenderer }  = window.require('electron');

import { createEmptyGroupObj } from '../api';
import AppSidebar from './AppSidebar';
//import GroupCreator from './GroupCreator';

import { startLoadApplicationList,
 				 setSelectedApplication,
				 startAddGroup
			 } from '../actions';
import GroupCreator from './GroupCreator';

class MainDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		//dispatch action to get the unique application names stored in qvGroups.json
		this.props.getApplicationNames();
  //   ipcRenderer.send('request:AppNames');
  //   ipcRenderer.on('response:AppNames', (event, data) => {
  //     this.props.loadApplicationList(data);
	//  });
 }
  // componentWillReceiveProps(nextProps) {
	// 	//When component reloads, check location pathname and if we are back to the root
	// 	//clear the application name as we should be back to no application selected.
  //     if (nextProps.location.pathname === '/') {
  //       this.props.setSelectedApplication('');
  //     }
  //}

	handleLoadApplication = appName => {
		//call action to update redux store with clicked on application
		this.props.setSelectedApplication(appName);
	}

	render() {
		let selectedApplication = this.props.selectedApplication || '';
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
    				{this.props.currentPage === 'main' ?
              <GroupCreator
      					selectedApplication={selectedApplication}
      				/>
              : this.props.currentPage === 'settings' ?
                <div> SETTINGS </div>
                :
                <div> EXPORT </div>
            }
						{/*<Route path="/app/:appName" component={GroupCreator} />*/}
				</main>
			</div>
		);
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
