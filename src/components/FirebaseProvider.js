import {Component} from 'react';
import PropTypes from 'prop-types';

class FirebaseProvider extends Component {

  static propTypes = {
    children: PropTypes.element,
  };

  static childContextTypes = {
    firebaseApp: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      firebaseApp: this.props.firebaseApp,
    };
  }



  render() {
    return this.props.children;
  }
}

export default FirebaseProvider;
