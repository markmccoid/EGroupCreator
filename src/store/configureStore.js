import { createStore, combineReducers, applyMiddleware, compose, reduxMiddleware } from 'redux';
import thunk from 'redux-thunk';

//Import reducers..
import { appStateReducer, groupsReducer, groupFieldsReducer } from '../reducers';

//--Take out in production -- Using for testing to make sure not mutating state in reducers
import freeze from 'redux-freeze';

//Setup the initil redux state
const INITIAL_STATE = {
			applications: {user: 'user'},
			groups: {
					groupsInfo: [],
					groupFields: {}
				}
		};
//--------------------------------------------
//-Create Store - This is called from app.js
//--------------------------------------------
export var configure = (initialState = INITIAL_STATE) => {
	//define which pieces of state are handled by which reducer
		var reducer = combineReducers({
				applications: appStateReducer,
				groups: combineReducers({
					groupsInfo: groupsReducer,
					groupFields: groupFieldsReducer
				})
		});
	//Create the store that will be returned.
		var store = createStore(reducer, initialState, compose(applyMiddleware(thunk, freeze),
				window.devToolsExtension ? window.devToolsExtension() : f => f));
		return store;
	}

//From Redux documentation -- Thinking I could use this to apply the Promise middleware.
// import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
// import thunk from 'redux-thunk'
// import DevTools from './containers/DevTools'
// import reducer from '../reducers/index'

// const store = createStore(
//   reducer,
//   compose(
//     applyMiddleware(thunk),
//     DevTools.instrument()
//   )
// )
