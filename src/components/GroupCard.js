import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { arrayMove } from 'react-sortable-hoc';

import { confirmDialog } from '../helpers';
import FieldItem from './FieldItem';
import AddNewField from './AddNewField';
import GroupCardFields from './GroupCardFields';

//GROUPCARD Component
class GroupCard extends React.Component {
	constructor(props) {
		super(props);
	}

	handleGroupFieldUpdate = (changedIdx, newLabel, newName, deleteFlag=false) => {
		 //Since we are going to change the label based on the index that was used when
		 //the FieldItem was created, we need to make sure the array we are modifying
		 //looks the same
		 let newFields = _.sortBy([...this.props.fields], 'fieldOrder');
		 let newArrayOfFields = [];

		 if (deleteFlag) {
			 //delete the field whose changedIdx equal the arrays object index.
			 //Remember fields are just an array of objects, no ids.  we are using the array index to find what to delete.
			 newArrayOfFields = newFields.filter((obj, objIndex) => changedIdx !== objIndex);
		 } else {
			 //Updating a field
			 newArrayOfFields = newFields.map((obj, ObjIndex) => {
				 let newObj = {...obj};
				 if (ObjIndex === changedIdx) {
					 newObj.fieldLabel = newLabel;
					 newObj.fieldName = newName;
				 }
				 return newObj;
			 });
	 	}
		 //dispatch action to update fields for group in redux store and on server.
		 this.props.onUpdateGroupFields(this.props.group.id, newArrayOfFields, this.props.user);
	}
	handleNewGroupField = (newLabel, newName) => {
		let newFields = _.sortBy([...this.props.fields], 'fieldOrder');
		let newField = {
			fieldLabel: newLabel,
			fieldName: newName,
			fieldOrder: this.props.fields.length + 1
		};

		newFields.push(newField);
		//dispatch action to update fields for group in redux store and on server.
		this.props.onUpdateGroupFields(this.props.group.id, newFields, this.props.user);
	}
	handleDeleteGroup = () => {
		confirmDialog('Delete Group?','Ok to Delete group.',
				() => this.props.onDeleteGroup(this.props.group.id),
				null,
				'Group Deleted');
	}
	groupValueUpdateFactory = groupKey => newGroupValue => {
		//We can either create a new server REST Put call to change a single group title OR
		//Send over the whole group and send a put to /api/groups
		//Chose to send whole group object
		//groupKey passed in first function will be the value of the groupKey:
		// either -- groupName, groupType, groupNotes
		let newGroup = {...this.props.group};
		newGroup[groupKey] = newGroupValue;
		newGroup.modifyDate = moment().unix();
		newGroup.modifyUser = this.props.user;
		newGroup.fields = this.props.fields;
		//Call redux action to update the group on the server and redux store
		this.props.onUpdateGroup(newGroup);
	}
	//create update functions for different group fields using the factory function.
	handleGroupNameUpdate = this.groupValueUpdateFactory('groupName');
	handleGroupTypeUpdate = this.groupValueUpdateFactory('groupType');
	handleGroupNotesUpdate = this.groupValueUpdateFactory('groupNotes');

	render() {
		let { groupName, groupType, groupNotes } = this.props.group;
	  //create a copy of the fields being passed and sort by their fieldOrder property
		let newFields = _.sortBy([...this.props.fields], 'fieldOrder');

		//function called when a drap-drop sort operation has completed
		const onSortEnd = ({oldIndex, newIndex}) => {
			//Exit out if nothing has been changed.
			if (oldIndex === newIndex) {
				return;
			}
			//When user changes order of fields:
			//Create new array of field objects using arrayMove function from react-sortable-hoc
			let newArrayOfFields = arrayMove(newFields, oldIndex, newIndex)
				//loop through this new sorted array and update the fieldOrder field
				//the arrayMove sorts the array, but we also need to update the fieldOrder field
				//in the group object
				.map((obj, idx) => {
					return {
						...obj,
						fieldOrder: idx + 1
					}
				});
			//dispatch action to update fields for group in redux store and on server.
			this.props.onUpdateGroupFields(this.props.group.id, newArrayOfFields, this.props.user);
		}

		return (
			<div className="gc-container" key={this.props.group.id}>
				<div className="gc-title">

					<FieldItem
						fieldValue={groupName}
						customClass="gc-title"
						inputType='input'
						onSave={(newGroupName) => this.handleGroupNameUpdate(newGroupName)}
					/>
				</div>

				<div className="gc-detail-container">
					<div className="gc-detail-type gc-detail-child" style={{display: "flex"}}>
						<div className="gc-detail-label">Type: </div>
						<div className="gc-detail-value">
							<FieldItem
								fieldValue={groupType}
								customClass="gc-detail-value"
								inputType='select'
								pickListValues={[{key: 'Cyclic', label: 'Cyclic'}, {key: 'Drill', label: 'Drill'}]}
								onSave={(newGroupType) => this.handleGroupTypeUpdate(newGroupType)}
							/>
						</div>
					</div>

					<GroupCardFields
						items={newFields}
						analytixFields={this.props.analytixFields}
						onSortEnd={onSortEnd}
						onGroupFieldUpdate={this.handleGroupFieldUpdate}
						onNewGroupField={this.handleNewGroupField}
						useDragHandle
					/>

				<div className="gc-detail-notes gc-detail-child" style={{display: "flex"}}>
						<div className="gc-detail-label">Desc: </div>
						<div className="gc-detail-value">
							<FieldItem
								fieldValue={groupNotes}
								customClass="gc-detail-value"
								inputType='textarea'
								onSave={(newGroupNotes) => this.handleGroupNotesUpdate(newGroupNotes)}
							/></div>
					</div>
				</div>

				<div
					className="hover-buttons close"
					onClick={this.handleDeleteGroup}
				>
					<img src="/images/close-x.png" width="16" height="16" />
				</div>
			</div>
		);
	}
}
//#--PropTypes---###//
GroupCard.propTypes = {
	user: PropTypes.string,
	group: PropTypes.object,
	fields: PropTypes.array,
	analytixFields: PropTypes.array,
	onUpdateGroupFields: PropTypes.func,
	onUpdateGroup: PropTypes.func,
	onDeleteGroup: PropTypes.func
};

export default GroupCard;
