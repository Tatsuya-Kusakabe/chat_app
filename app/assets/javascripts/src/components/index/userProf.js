
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import UserAction from '../../actions/index/users'
import MessageAction from '../../actions/index/messages'
import RelationshipAction from '../../actions/index/relationships'
import _ from 'lodash'

class UserProf extends React.Component {

  async changeFriendship(friendship) {
    const tmpCurrentUserID = this.props.currentUserID
    const tmpOpenUserID = this.props.openUserID

    // Changing 'openUserTab'
    const newFriendship = (friendship === 'Suggestions') ? 'Friends' : 'Suggestions'
    UserAction.changeOpenUserTab(newFriendship)

    // Changing 'relationship' and sending a welcome message
    if (newFriendship === 'Friends') {
      await RelationshipAction.createFriendship(tmpCurrentUserID, tmpOpenUserID)
      MessageAction.sendMessage(tmpCurrentUserID, tmpOpenUserID, 'You made friends!')
    } else {
      await RelationshipAction.destroyFriendship(tmpCurrentUserID, tmpOpenUserID)
    }

    // Getting information as in 'componentDidMount()'
    UserAction.getFriends(tmpCurrentUserID)
    UserAction.getSuggestions(tmpCurrentUserID)
    MessageAction.getLastMessages(tmpCurrentUserID)
    RelationshipAction.getRelationships(tmpCurrentUserID)

    // Changing 'openUserID' and 'openMessages'
    UserAction.changeOpenUserID(tmpOpenUserID)
    MessageAction.getOpenMessages(tmpCurrentUserID, tmpOpenUserID)
  }

  render() {
    const { openUserTab, openUserID, friends, suggestions } = this.props

    // When 'openUserID' is null, displaying nothing
    const skipRenderFirst = !openUserID

    // When 'openUserID' does not match 'friends' or 'suggestions' list
    // (during rerender), displaying nothing
    const skipRenderAfterUpdate = (openUserTab === 'Friends')
      ? !(_.find(friends, { 'id': openUserID }))
      : !(_.find(suggestions, { 'id': openUserID }))

    // When 'openUserID' is null (namely having no friends), displaying 'No...'
    if (skipRenderFirst || skipRenderAfterUpdate) {
      return (
          <div className='user-prof__list user-prof__list__empty'>
            No { this.props.openUserTab }
          </div>
      )
    }

    // Defining 'userInfo' and 'linkText' which triggers a friendship change
    const linkText = (openUserTab === 'Friends') ? 'Unfriend?' : 'Be friends!'
    const userInfo = (openUserTab === 'Friends')
      ? _.find(friends, { 'id': openUserID })
      : _.find(suggestions, { 'id': openUserID })

    // Defining 'item_classes' to distinguish 'openUserTab'
    // ** https://www.npmjs.com/package/classnames
    const baseClasses = [{
      'friends': openUserTab === 'Friends',
      'suggestions': openUserTab === 'Suggestions',
    }]

    const itemClasses = classNames('clear user-prof__item', baseClasses)
    const pictureClasses = classNames('user-prof__item__picture', baseClasses)
    const friendshipClasses = classNames('user-prof__item__friendship', baseClasses)

    return (
        <div className={ itemClasses }>
          <div className={ pictureClasses }>
            <img src={ userInfo.profile_picture } />
          </div>
          <h4 className='user-prof__item__name'>
            { userInfo.name }
          </h4>
          <h6 className='user-prof__item__message'>
            { userInfo.profile_comment }
          </h6>
          {/*
          // When a message clicked, returning 'changeFriendship(openUserTab)'
          // ** Confirmation messages displayed according to 'window.confirm'
          // ** https://gist.github.com/primaryobjects/aacf6fa49823afb2f6ff065790a5b402
          */}
          <h4
            className={ friendshipClasses }
            onClick={ () => {
              if (window.confirm('Are you sure?')) { this.changeFriendship(openUserTab) }
            } }
          >
            { linkText }
          </h4>
        </div>
    )
  }

}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
UserProf.propTypes = {
  openUserID: PropTypes.number,
  openUserTab: PropTypes.string,
  friends: PropTypes.array,
  suggestions: PropTypes.array,
}

export default UserProf
