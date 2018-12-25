
import React from 'react'
import PropTypes from 'prop-types'
import UserAction from '../../actions/index/users'
import _ from 'lodash'

class UserShortProf extends React.Component {

  // When a tab is clicked, changing a main content to display
  changeOpenContent(openContent) {
    UserAction.changeOpenContent(openContent)
  }

  render() {
    const { openUserTab, openUserID, openContent, friends, suggestions } = this.props

    // When 'openUserID' is null (namely having no friends), or
    // 'suggestions' tab is open, displaying nothing
    const skipRenderFirst = !openUserID || (openUserTab === 'Suggestions')

    // When 'openUserID' does not match 'friends' list
    // (during rerender), displaying nothing
    const skipRenderAfterUpdate = !(_.find(friends, { 'id': openUserID }))

    if (skipRenderFirst || skipRenderAfterUpdate) {
      return <div className='user-short-prof__list user-short-prof__list__empty'></div>;
    }

    // Defining 'userInfo' and 'contentName' to be displayed as an icon
    const contentName = (openContent === 'Profile') ? 'Messages' : 'Profile'
    const userInfo = (openUserTab === 'Friends')
      ? _.find(friends, { 'id': openUserID })
      : _.find(suggestions, { 'id': openUserID })
    console.log(friends)

    return (
        <div className='clear user-short-prof__item'>
          <div className='user-short-prof__item__picture'>
            <img src={ userInfo.profile_picture } />
          </div>
          <h4 className='user-short-prof__item__name'>
            { userInfo.name }
          </h4>
          <h6
          onClick={ () => this.changeOpenContent(contentName) }
            className='user-short-prof__item__content'
          >
            See { contentName }
          </h6>
        </div>
    )
  }

}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
UserShortProf.propTypes = {
  openUserID: PropTypes.number,
  openUserTab: PropTypes.string,
  openContent: PropTypes.string,
  friends: PropTypes.array,
  suggestions: PropTypes.array,
}

export default UserShortProf
