import React, {Component} from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux';
import { FirebaseProvider } from '../../src';
import configureStore from './store';
import { Root } from './containers/Root';
import { addLocalizationData } from './locales';
import { firebaseApp } from './firebase';

const store = configureStore();

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
