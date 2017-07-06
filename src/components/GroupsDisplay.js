import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';
const ButtonGroup = Button.Group;
import { createEmptyGroupObj } from '../api';

import GroupCard from './GroupCard';
import { filterGroups } from '../helpers';

class GroupsDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: '',
			searchBy: 'searchGroups',
			filterType: 'all'
		}
	}

	handleSearch = e => {
		e.preventDefault();
		let searchValue = e.target.value;
		this.setState({searchText: searchValue})
	}
	render() {
		let analytixFieldsSorted = _.sortBy(_.uniqBy(this.props.analytixFields, 'key'), 'key');
		//Sorts descending by createDate and modifyDate.  This means the most recent will always show up first.
		//Also, for system groups (those with the same createDate), the group most recently modified will show up first.
		let sortedGroups = _.reverse(_.sortBy(filterGroups(this.props.groups, this.props.groupFields, this.state.searchText, this.state.searchBy, this.state.filterType), ["createDate", "modifyDate"]));
		let { selectedApplication, user } = this.props;
		return (
			<div style={{width: "100%"}}>
				{/*----------------------
					//Group Header Div
					-------------------------*/}
				<div className="content-body-header-container">
					<h2>{selectedApplication + ' Groups'} </h2>
					<a
						onClick={() => this.props.onAddGroup(createEmptyGroupObj(selectedApplication, user))}
						className="button primary"
					>
						Add New Group
					</a>
				</div>
				{/*----------------------
					//Group Search Div
					-------------------------*/}
				<div className="content-body-search callout">
					<h5>Search Groups</h5>
					<input type="text"
						placeholder="Search"
						style={{width: "300px"}}
						value={this.state.searchText}
						onChange={e => this.setState({searchText: e.target.value})}
					/>
					<div className="content-body-radio">
						<div style={{display:"flex", alignItems: "center"}}>
							<input type="radio" name="searchtype" value="searchGroups" style={{margin: "0px"}}
								checked={'searchGroups' === this.state.searchBy}
								onChange={(e) => this.setState({searchBy: e.target.value})}
							/>
							<label>Search Groups</label>
						</div>
						<div style={{display:"flex", alignItems: "center"}}>
							<input type="radio" name="searchtype" value="searchFields" style={{margin: "0px"}}
								checked={'searchFields' === this.state.searchBy}
								onChange={(e) => this.setState({searchBy: e.target.value})}
							/>
							<label>Search Fields</label>
						</div>
					</div>
					<div style={{textAlign: "center", marginLeft: "25px"}}>

						<ButtonGroup size='large'>
							<Button
								onClick={() => this.setState({filterType: 'all'})}
								type={this.state.filterType === 'all' ? "primary" : null}
							>All</Button>
							<Button
								onClick={() => this.setState({filterType: 'cyclic'})}
								type={this.state.filterType === 'cyclic' ? "primary" : null}
							>Cyclic</Button>
							<Button
								onClick={() => this.setState({filterType: 'drill'})}
								type={this.state.filterType === 'drill' ? "primary" : null}
							>Drill</Button>
						</ButtonGroup>
					</div>
				</div>
				{/*----------------------
					//Group Cards Div
					-------------------------*/}
				<div className="group-cards-container">
					{
						sortedGroups.map(group => {
							//Get the fields for the group we are working on
							//The fields are in an object where the keys are the group ids
							let groupFields = this.props.groupFields[group.id] || [];
							return (
									<GroupCard key={group.id}
										user={this.props.user}
										group={group}
										fields={groupFields}
										analytixFields={analytixFieldsSorted}
										onUpdateGroupFields={this.props.onUpdateGroupFields}
										onUpdateGroup={this.props.onUpdateGroup}
										onDeleteGroup={this.props.onDeleteGroup}
									/>
							);
						})
					}
				</div>
			</div>
		);
	}
}

//#--PropTypes---###//
GroupsDisplay.propTypes = {
	user: PropTypes.string,
	groups: PropTypes.array,
	groupFields: PropTypes.object,
	selectedApplication: PropTypes.string,
	analytixFields: PropTypes.array,
	onUpdateGroupFields: PropTypes.func,
	onUpdateGroup: PropTypes.func,
	onAddGroup: PropTypes.func,
	onDeleteGroup: PropTypes.func
}

export default GroupsDisplay;



//-------------------------------

// class GroupsDisplay extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}
//
// 	render() {
// 		return (
// 			<div>
// 				{
// 					this.props.groups.map(group => {
// 						let fields = this.props.groupFields[group.id] || [];
// 						let fieldJSX = fields.map(field => {
// 							return (
// 									<li key={field.fieldName}>{field.fieldName}</li>
// 							);
// 						});
// 						return (
// 							<div key={group.id}>
// 								<h4>{group.groupName}</h4>
// 								<ul>{fieldJSX}</ul>
// 							</div>
// 						);
// 					})
// 				}
// 			</div>
// 		);
// 	}
// }
//
// //#--PropTypes---###//
// GroupsDisplay.propTypes = {
// 	groups: PropTypes.array,
// 	groupFields: PropTypes.object
// }
//
// export default GroupsDisplay;
