import { responsiveStateReducer } from 'redux-responsive';
import { combineReducers } from 'redux';
import { responsiveDrawer } from 'material-ui-responsive-drawer';
import { reducer as formReducer } from 'redux-form'
import dialogs from './dialogs/reducer';
import locale from './locale/reducer';
import theme from './theme/reducer';
import firekitReducers from '../../../src';

const reducers = combineReducers({
  browser: responsiveStateReducer,
  form: formReducer,
  responsiveDrawer,
  dialogs,
  locale,
  theme,
  ...firekitReducers,
})

export default reducers;
