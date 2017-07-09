import React from 'react';
import { connect } from 'react-redux';

import { clearApplicationState } from '../../actions';
// import ManageApplicationsContainer from './ManageApplicationsContainer';
 import SetUser from './SetUser';

class SettingsContainer extends React.Component {
	state = {
		editState: ''
	};

	componentDidMount () {
		//When component mounts, clear out the Application Variable state
		//This will clear out the qvVariables, applications and appState redux store nodes
		//this.props.dispatch(clearApplicationState());
	}
	render () {
		//function to check the editState (component state) to
		//determine which component to show.
		const renderEditScreen = () => {
			const { editState } = this.state;
				switch (editState) {
					case 'app':
						return <ManageApplicationsContainer />
					case 'user':
						return <SetUser />
					default:
						return <div></div>
				}
		};

		return (
		<div className="content-container">
			<div className="content-nav">
				<h4 className="text-center">Settings</h4>
				<ul className="menu vertical">
					<li>
						<a onClick={() => this.setState({editState: 'user'})}>Set User </a>
					</li>
				</ul>
			</div>
			<div className="content-body">
					{renderEditScreen()}
			</div>
		</div>
		);
	}
}


export default connect()(SettingsContainer);
