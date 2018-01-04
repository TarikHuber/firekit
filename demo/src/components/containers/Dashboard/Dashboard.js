import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import { injectIntl, intlShape } from 'react-intl'
import { GitHubIcon } from '../../components/Icons'
import { Activity } from '../../containers/Activity'


const Dashboard = ({ intl }) => {
  return (
    <Activity
      iconElementRight={
        <FlatButton
          style={{ marginTop: 4 }}
          href='https://github.com/TarikHuber/react-most-wanted'
          target='_blank'
          rel='noopener'
          secondary
          icon={<GitHubIcon />}
        />
      }
      title={intl.formatMessage({ id: 'dashboard' })}>

      <div style={{ backgroundColor: 'white', marginTop: -20 }} />

    </Activity>
  )

}

Dashboard.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(Dashboard)
