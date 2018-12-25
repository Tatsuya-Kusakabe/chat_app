
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import UserAction from '../../actions/index/users'
import UserStore from '../../stores/index/users'

class UsersTab extends React.Component {

  // When a tab (friends or suggestions) is clicked
  changeOpenUserTab(openUserTab) {
    // Updating 'openUserTab'
    UserAction.changeOpenUserTab(openUserTab)

    // Initializing 'userSearchText' (because a set of users changes)
    UserAction.updateSearchText(null)

    // Initializing 'openUserID' (because a set of users changes)
    UserAction.changeOpenUserID(null)

    // Initializing 'friends' or 'suggestions' list
    // (Because these list might be changed after search)
    const currentUserID = UserStore.getCurrentUserID()
    openUserTab === 'Friends'
      ? UserAction.getFriends(currentUserID)
      : UserAction.getSuggestions(currentUserID)
  }

  render() {
    const { openUserTab } = this.props
    const tabs = ['Friends', 'Suggestions']

    // Rendering 'tabs'
    const tabsList = tabs.map((tab, index) => {

      // Defining 'item_classes' for each message icon
      const itemClasses = classNames({
        'clear': true,
        'users-tab__item': true,
        'users-tab__item--active': tab === openUserTab,
        'friends': tab === 'Friends',
        'suggestions': tab === 'Suggestions',
      })

      // When a tab is clicked, returning 'changeOpenUserTab(tab)'
      return (
          <li
            onClick={ () => this.changeOpenUserTab(tab) }
            className={ itemClasses }
            key={ tab }
          >
            { tab }
          </li>
      )
    })

    return <ul className='users-tab__list'>{ tabsList }</ul>;
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
UsersTab.propTypes = {
  openUserTab: PropTypes.string,
}

export default UsersTab
