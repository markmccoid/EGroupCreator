import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { startLoadGroups,
				 startLoadGroupFields,
				 startLoadAnalytixFields,
				 startUpdateGroupFields,
				 startUpdateGroup,
				 setSelectedApplication,
				 startAddGroup,
				 startDeleteGroup
			 } from '../actions';

import GroupsDisplay from './GroupsDisplay';

class GroupCreator extends React.Component {
	constructor(props) {
		super(props);

	}
	 componentDidMount() {
		//Load the Groups, GroupFields and Analytix fields for the application selected.
		this.props.startLoadGroups(this.props.selectedApplication);
		this.props.startLoadGroupFields(this.props.selectedApplication);
		this.props.startLoadAnalytixFields(this.props.selectedApplication);
	}

	componentWillReceiveProps(nextProps) {
		//This will run when application is changed.
		//Need to run because the initial componentDidMount only runs when mounting
		if (this.props.selectedApplication !== nextProps.selectedApplication) {
			this.props.startLoadGroups(nextProps.selectedApplication);
			this.props.startLoadGroupFields(nextProps.selectedApplication);
			this.props.startLoadAnalytixFields(nextProps.selectedApplication);
		}
	}
	render() {
		let currentApplication = this.props.selectedApplication;
		//Prep analytix fields for use in the FieldItem component
		let analytixFieldsFormatted =  this.props.analytixFields ?
			this.props.analytixFields.map(field => {
				return {
					key: field.field,
					label: field.field
				};
			})
			: [];

		if (this.props.groups.length === 0) {
			return null;
		}
		return (
			<GroupsDisplay
				groups={this.props.groups}
				groupFields={this.props.groupFields}
				analytixFields={analytixFieldsFormatted}
				onUpdateGroupFields={this.props.startUpdateGroupFields}
				onUpdateGroup={this.props.startUpdateGroup}
				onAddGroup={this.props.startAddGroup}
				onDeleteGroup={this.props.deleteGroup}
				user={this.props.user}
				selectedApplication={currentApplication}
			/>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.applications.user,
		groups: state.groups.groupsInfo,
		groupFields: state.groups.groupFields,
		analytixFields: state.applications.selectedApplicationFields
	}
}

//#--PropTypes---###//
GroupCreator.propTypes = {
	selectedApplication: PropTypes.string
};

export default connect(mapStateToProps, {
	startLoadGroups: startLoadGroups,
	startLoadGroupFields: startLoadGroupFields,
	startLoadAnalytixFields: startLoadAnalytixFields,
	startUpdateGroupFields: startUpdateGroupFields,
	startUpdateGroup: startUpdateGroup,
	setSelectedApplication: setSelectedApplication,
	startAddGroup: startAddGroup,
	deleteGroup: startDeleteGroup
})(GroupCreator);


//<GroupsDisplay
//	groups={this.props.groups}
//	groupFields={this.props.groupFields}
//	analytixFields={analytixFieldsFormatted}
//	onUpdateGroupFields={this.props.startUpdateGroupFields}
//	onUpdateGroup={this.props.startUpdateGroup}
//	onAddGroup={this.props.startAddGroup}
//	onDeleteGroup={this.props.deleteGroup}
//	user={this.props.user}
//	selectedApplication={currentApplication}
///>
