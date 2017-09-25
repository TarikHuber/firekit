import React, { Component }  from 'react';
import {injectIntl, intlShape} from 'react-intl';
import { Activity } from '../../containers/Activity';
import { withFirebase } from '../../../../src';

class About extends Component {

  componentWillMount(){
    const { watchPath, destroyPath, watchList }= this.props;

    //watchPath('users_count');
    //watchList('users', 'test');
    //watchList('users', 'test');
    //watchList('companies', 'test');
    //watchList('public_tasks', 'pt');
    //watchList('companies', 'pt', true);
    watchList('public_tasks', 'u2');
  }

  componentWillUnmount(){
    const { destroyPath, unwatchList, destroyList }= this.props;

    //destroyPath('/users_count');
    //unwatchList('public_tasks');
    //unwatchList('companies');
    destroyList('public_tasks');
  }

  render() {
    const { intl }= this.props;

    return (
      <Activity
        title={intl.formatMessage({id: 'about'})}>
      </Activity>
    );
  }

}

About.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(withFirebase(About));
