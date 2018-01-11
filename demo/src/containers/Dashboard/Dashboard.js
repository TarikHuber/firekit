import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Activity } from '../../containers/Activity'
import withFirebase from '../../../firekit-provider/withFirebase'

class Dashboard extends Component {
  componentDidMount () {
    const { watchList } = this.props

    watchList('companies')
    watchList('companies')
  }

  render () {
    const { intl } = this.props
    return (
      <Activity
        title={intl.formatMessage({ id: 'dashboard' })}>

        <div style={{ backgroundColor: 'white', marginTop: -20 }} />

      </Activity>
    )
  }
}

Dashboard.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(withFirebase(Dashboard))
