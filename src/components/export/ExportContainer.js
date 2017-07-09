import React from 'react';
import { getApplicationNames } from '../../api';
import ExportXML from './ExportXML';

class ExportContainer extends React.Component {
	state = {
		applicationNames: []
	}
	componentDidMount() {
		getApplicationNames()
			.then((data) => {
				this.setState({applicationNames: data});
			});
	}
	render() {

			return (
			<div className="content-container">
				<div className="content-body" style={{flexDirection: "column"}}>
					<h3>Export XML</h3>
					<ul className="export-container">
					{this.state.applicationNames.map((appName) => {
						return <li><ExportXML key={appName} appName={appName} /></li>
						})
					}
					</ul>
				</div>
			</div>
		);
	}
}

export default ExportContainer;

//
// return (
// <div className="row">
// 	<div className="columns callout secondary" style={{margin:"0 15px"}}>
// 		<h3>Export XML</h3>
// 		{this.state.applicationNames.map((appName) => {
// 			return <ExportXML key={appName} appName={appName} />
// 			})
// 		}
//
// 	</div>
// </div>
// );
