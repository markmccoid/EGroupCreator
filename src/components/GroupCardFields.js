import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { SortableContainer,
				 SortableElement,
				 SortableHandle
			 } from 'react-sortable-hoc';

import FieldItem from './FieldItem';
import AddNewField from './AddNewField';

//Create the reac-sortable-hoc Components
const DragHandle = SortableHandle((props) => {
	return (
		<div className="sortable-handle">
			<div>Label</div>
			<div>Field</div>
			<div className="sort-delete"
				onMouseDown={props.onDeleteField}>
				<img src="/images/close-x.png" width="10" height="10" />
			</div>
		</div>
	);
});

const SortableItem = SortableElement((props) => {
	//calls passed onSaveLabel function passing in
	//required field index so we update the right label
		const handleSaveFields = (newLabel = props.value.fieldLabel, newName = props.value.fieldName) => {
			props.onGroupFieldUpdate(props.fieldIndex, newLabel, newName);
		}
		const handleDeleteField = () => {
			//when called this will update the field associated with this index.
			props.onGroupFieldUpdate(props.fieldIndex, '', '', true);
		}
		return (
			<div className="sortable-field-container">
				<DragHandle onDeleteField={handleDeleteField}/>
				<div className="sortable-field-values-container">

					<FieldItem
						fieldValue={props.value.fieldLabel}
						customClass="sortable-item"
						inputType='input'
						onSave={newFieldLabel => handleSaveFields(newFieldLabel, props.value.fieldName)}
					/>
					<FieldItem
						fieldValue={props.value.fieldName}
						customClass="sortable-item"
						inputType='select'
						allowPickListSearch
						pickListValues={props.analytixFields}
						onSave={newFieldName => handleSaveFields(props.value.fieldLabel, newFieldName)}
					/>

				</div>
			</div>
		)
	}
);

const GroupCardFields = SortableContainer(({ items, onGroupFieldUpdate, onNewGroupField, analytixFields }) => {

	return (
		<div className="sortable-list">
			{items.map((value, idx) => {
					return (
						<SortableItem key={`item-${idx}`}
							index={idx}
							value={value}
							fieldIndex={idx}
							onGroupFieldUpdate={onGroupFieldUpdate}
							analytixFields={analytixFields}
						/>
					);
				})
			}
			<AddNewField
				onNewGroupField={onNewGroupField}
				analytixFields={analytixFields}
			/>
		</div>
	);
});

export default GroupCardFields;
