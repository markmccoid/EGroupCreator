import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import Main from './components/Main';



//--This creates the store that will be passed to the Provider component
//let store = require('./store/configureStore').configure();

//Load initial state which is the application list
//Not using here anymore, doing it on componentWillMount in MainDisplay
//store.dispatch(startLoadApplicationList());
//-------------------------------------------------------

//app scss - webpack will create a sass-styles.css file in pubic directory
require('./styles/app.scss');

//--This creates the store that will be passed to the Provider component
var store = require('./store/configureStore').configure();

//--Ant Design css load
// require('/antd/dist/antd.min.css');

//path="/" designates the root of the application
ReactDOM.render(
	<Provider store={store}>
			<Main/>
	</Provider>,
  document.getElementById('app')
);
//Old ReactDom render method without routing

// ReactDOM.render(
//   <h1>Boilerplate app!  </h1>,
//   document.getElementById('app')
// );
