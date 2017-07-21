import React from 'react';
import { connect } from 'react-redux';

import { updateUser } from '../../actions';

class SetUser extends React.Component {
	render() {
		return (
			<div className="row">
				<div className="column small-3">
					<h5 className="text-center">Set the User Level</h5>
					<select
						name="user"
						onChange={(e) => this.props.dispatch(updateUser(e.target.value))}
						value={this.props.user}
					>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				<div className="column small-5 callout">
					<p>
						User level should always be set to "user" if you are editing or adding variables for your site.
						<br />
						The "admin" user level is for editing and adding variables for all sites.
						This is important because we use this setting to determine if we overwrite variables when upgrading.
						If you have edited a variable, we will not overwrite that update during an upgrade.
					</p>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.applications.user
	}
}
export default connect(mapStateToProps)(SetUser);
