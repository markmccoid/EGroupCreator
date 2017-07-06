import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FieldItem from './FieldItem';
import { confirmDialog } from '../helpers';

class AddNewField extends React.Component {
	state = {
		isAdding: false,
		fieldLabel: 'Field Label',
		fieldName: 'Field Name'
	}
	handleSave= () => {
		this.props.onNewGroupField(this.state.fieldLabel, this.state.fieldName);
		this.setState(
			{ isAdding: false,
				fieldLabel: 'Field Label',
				fieldName: 'Field Name'
			});
	}
	cancelEditing = () => {
		//Canceling editing, but not clearing label and name.
		//May want to clear label and name.
		this.setState({ isAdding: false });
	}
	componentWillUnmount() {
		console.log('FieldItem Unmount', this.state.fieldLabel);
	}
	render() {
		let stateJSX = <div className="gc-adding-field init">
											<a
												onClick={() => this.setState({ isAdding: true })}
												className="button primary medium"
											>Add Field</a>
									 </div>;
		if (this.state.isAdding) {
			stateJSX = <div className="gc-adding-field">
								<FieldItem
									fieldValue={this.state.fieldLabel}
									customClass="sortable-item"
									onSave={newFieldLabel => this.setState({ fieldLabel: newFieldLabel })}
								/>
								<FieldItem
									fieldValue={this.state.fieldName}
									customClass="sortable-item"
									inputType='select'
									allowPickListSearch
									pickListValues={this.props.analytixFields}
									onSave={newFieldName => this.setState({ fieldName: newFieldName })}
								/>

							<a onMouseDown={(e) => {
									//Only save if left mouse button pressed.
											if (e.nativeEvent.which === 1){
												this.handleSave();
											}
										}
									}
								>Save</a>

							<a onClick={() => {
										confirmDialog('Cancel Editing?','Ok to cancel adding of new field.', this.cancelEditing, null);
									}
								}>
									Cancel
								</a>
							</div>
			}
		return (
			<div>{ stateJSX }</div>
			);
	}
}

AddNewField.propTypes = {
	onNewGroupField: PropTypes.func,
	analytixFields: PropTypes.array
}
export default AddNewField;
