import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuid from 'uuid'
import { Select, Button } from 'antd';
const Option = Select.Option;

//Used for regular input and textarea input needs
const CustomInput = (props) => {
	//don't want to spread inputType to these components, getting rid of it.
	let newProps = _.omit(props, 'inputType');
	if (props.inputType === 'textarea') {
		return (
			<textarea autoFocus
				{...newProps}
				/>
		);
	} else {
		return (
			<input autoFocus
				{...newProps}
				onKeyPress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						this.handleSave();
					}
				}}
			/>
		);
	}
};

class FieldItem extends React.Component {
  state = {
    editing: false,
    fieldValue: this.props.fieldValue,
		availablepickListValues: this.props.inputType === 'select' ? this.props.pickListValues : []
  }

	cancelEditing = () => {
		this.setState({
			editing: false,
			fieldValue: '',
			availablepickListValues: this.props.inputType === 'select' ? this.props.pickListValues : []
		});
	}
	componentDidUpdate() {
		//if editing and the edit item is select AND values from list and (state and passed field value) are equal
		//Give the input element focus (i.e. click on it)
		if(this.state.editing && this.props.inputType === 'select' && this.state.fieldValue === this.props.fieldValue) {
			ReactDOM.findDOMNode(this.refs.select).click();
		}
	}

//calls the passed in onSave function with the state fieldValue as an argument
//then set editing state to false
	handleSave = () => {
		this.props.onSave(this.state.fieldValue);
		this.setState({ editing: false, availablepickListValues: this.props.inputType === 'select' ? this.props.pickListValues : [] });
	}

	handleFieldSearch = value => {
		//Take the value typed and search the "label" key in the pickListValues object prop
		const re = new RegExp(value, "gi")
		this.setState({
			availablepickListValues: this.props.pickListValues.filter(aField => aField.label.match(re))
		});
	}

  render() {

		let fieldClass = this.props.customClass;
		let selectMode = this.props.allowPickListSearch ? "combobox" : "";

		let fieldJSX =
				<div
          className={fieldClass}
					style={{cursor: "pointer"}}
          onClick={() => this.setState({ editing: true, fieldValue: this.props.fieldValue })}
        >
          <span className='field-item-js'>{this.props.fieldValue}</span>
        </div>;
    if (this.state.editing) {
			if (this.props.inputType === 'select') {
				if ( this.state.fieldValue.length > 50 ) {
					const itemId = uuid.v1();
					fieldJSX = <div className={fieldClass}>
						<CustomInput
							id={itemId}
							type="text"
							value={this.state.fieldValue}
							onFocus={() => document.getElementById(itemId).select()}
							onChange={(e) => this.setState({ fieldValue: e.target.value })}
							onBlur={this.cancelEditing}
							inputType="textarea"
						/>
						<a
							onMouseDown={() => {
									this.handleSave();
								}
							}
						>Save</a>
						<a onClick={this.cancelEditing}>
							Cancel
						</a>
					</div>
				} else {
					//--------------------------------------------
					//--Search pickListValues list
					const options = this.state.availablepickListValues.map(aField => <Option key={aField.key} value={aField.key} >{aField.label}</Option>);
		      fieldJSX =
						<div
							className={fieldClass}
							onKeyPress={e => {
								if (e.key === 'Enter') {
									e.preventDefault();
									this.handleSave();
								}
							}}>
						<Select
						  mode={selectMode}
							autoFocus
							ref="select"
						  labelInValue
						  value={{key: this.state.fieldValue}}
						  style= {{width: "100%"}}
						  notFoundContent=""
						  defaultActiveFirstOption={false}
						  showArrow={!this.props.allowPickListSearch}
						  filterOption={false}
						  onBlur={() => this.cancelEditing()}
						  dropdownMatchSelectWidth={false}
						  onSearch={this.handleFieldSearch}
						  onChange={value => this.setState({ fieldValue: value.key	})}
						>
			        {options}
			      </Select>
			      <Button
			        onMouseDown={() => {
									this.handleSave();
			          }
							}
			      >Save</Button>
					<Button onClick={this.cancelEditing}>
							Cancel
						</Button>
		      </div>
				}
	    } else {
				//--------------------------------------------
				//--Does not want to search pickListValues list
				//--create unique id using uuid
				const itemId = uuid.v1();
				fieldJSX = <div className={fieldClass}>
					<CustomInput
						id={itemId}
						type="text"
						value={this.state.fieldValue}
						onFocus={() => document.getElementById(itemId).select()}
						onChange={(e) => this.setState({ fieldValue: e.target.value })}
						onBlur={this.cancelEditing}
						inputType={this.props.inputType}
					/>
					<Button
						onMouseDown={() => {
								this.handleSave();
							}
						}
					>Save</Button>
				<Button onClick={this.cancelEditing}>
						Cancel
					</Button>
				</div>
			}
		}
    return (
      <div> {fieldJSX}</div>
    )
  }

}

FieldItem.Proptypes = {
  fieldValue: PropTypes.string,
	showPickList: PropTypes.bool,  //If true we will show the pickListValues as select options
	inputType: PropTypes.oneOf(['select', 'input', 'textarea']),
	pickListValues: PropTypes.array,
	allowPickListSearch: PropTypes.bool,
	customClass: PropTypes.string,
	onSave: PropTypes.func
};

export default FieldItem;
