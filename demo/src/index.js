import React, {Component} from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux';
import { FirebaseProvider } from '../../src';
import configureStore from './store';
import { Root } from './containers/Root';
import { addLocalizationData } from './locales';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { firebaseApp } from './firebase';

const store = configureStore();

injectTapEventPlugin(); //Impementation without ignore of ghost clicks
//injectTapEventPlugin({ignoreMouseThreshold: 1200}); //Ignores ghost clicks on mobile devices

addLocalizationData();

class Demo extends Component {
  render() {
    return <div>
      <Provider store={store}>
        <FirebaseProvider firebaseApp={firebaseApp}>
          <Root />
        </FirebaseProvider>
      </Provider>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
