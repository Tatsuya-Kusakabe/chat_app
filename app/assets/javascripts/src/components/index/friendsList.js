
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import UserAction from '../../actions/index/users'
import MessageAction from '../../actions/index/messages'
import RelationshipAction from '../../actions/index/relationships'
import UserStore from '../../stores/index/users'
import Utils from '../../utils'

class FriendsList extends React.Component {

  // When an account is clicked, changing chats displayed　and updating 'timestamp'
  async changeOpenUserID(openUserID) {
    await UserAction.changeOpenUserID(openUserID)
    const tmpCurrentUserID = this.props.currentUserID
    const tmpOpenUserID = UserStore.getOpenUserID()
    MessageAction.getOpenMessages(tmpCurrentUserID, tmpOpenUserID)
    RelationshipAction.updateTimestamp(tmpCurrentUserID, tmpOpenUserID)
  }

  render() {
    const { currentUserID, openUserID, friends, lastMessages, relationships } = this.props

    // When 'this.props' is imperfect (during initial render), or
    // when 'current_user' has no friends, displaying 'No friends'
    const skipRenderFirst
      = !currentUserID || !friends.length
      || !lastMessages.length || !relationships.length

    // When 'openUserID' does exist but does not match 'friends' list
    // (during rerender), displaying 'No friends'
    // ** When 'openUserID' is null, should not skip Rendering
    // ** Initialization of 'openUserID' needed afterwards
    const skipRenderAfterUpdate
      = openUserID && !(_.find(friends, { 'id': openUserID }))

    if (skipRenderFirst || skipRenderAfterUpdate) {
      return (
          <div className='friends-list__list friends-list__list__empty'>
            No friends
          </div>
      )
    }

    // Putting 'user', 'message', 'timestamp' info into 'friendsRaw'
    const friendsRaw = friends.map((friend, index) => {
      let friendRaw = []
      const friendID = String(friend.id)
      const relationship = _.find(relationships, friendID)[friendID]
      friendRaw.user = friend
      friendRaw.message = _.find(lastMessages, friendID)[friendID][0]
      friendRaw.timestamp = (relationship.applicant_id === currentUserID)
        ? { current_user: relationship.timestamp_applicant,
            friend: relationship.timestamp_recipient }
        : { current_user: relationship.timestamp_recipient,
            friend: relationship.timestamp_applicant }
      return friendRaw
    })

    // Sorting 'friendsRaw' according to 'timestamp'
    const friendsSorted = friendsRaw.sort((a, b) => {
      // ** Just after applying friendship, 'timestamp.friend' is null
      const timestamp_a = (a.timestamp.friend !== null)
        ? a.timestamp.friend : a.timestamp.current_user
      const timestamp_b = (b.timestamp.friend !== null)
        ? b.timestamp.friend : b.timestamp.current_user

      if (timestamp_a > timestamp_b) return -1;
      if (timestamp_a < timestamp_b) return 1;
      return 0;
    })

    // Initializing 'openUserID'
    // Delayed intentionally because dispatch from 'app.js' not completed yet
    // ** ('dispatch' mechanism) https://github.com/rafrex/flux-async-dispatcher
    if (!openUserID) {
      const initOpenUserID = friendsSorted[0].user.id
      setTimeout(() => this.changeOpenUserID(initOpenUserID), 1)
    }

    // Rendering 'friendsSorted'
    const friendsList = friendsSorted.map((friend, index) => {

      // Calculating when 'last_message' was post
      const date = Utils.getNiceDate(friend.message.timestamp)

      // Defining 'statusIcon (replied, unread)', and 'isNew (new message or not)'
      let statusIcon, isNew = false

      // If the last message was posted after the last access,
      // showing a 'circle' icon and change 'isNew' to true (if sent from a friend)
      if (friend.message.timestamp > friend.timestamp.current_user) {
        statusIcon = (<i className='fa fa-circle friends-list__item__icon'/>)
        isNew = (friend.message.sent_from !== currentUserID)
      }

      // If the last message was posted from a current user, showing a 'reply' icon
      if (friend.message.sent_from === currentUserID) {
        statusIcon = (<i className='fa fa-reply friends-list__item__icon'/>)
      }

      // Defining 'item_classes' for each tab
      const itemClasses = classNames({
        'clear': true,
        'friends-list__item': true,
        'friends-list__item--new': isNew,
        'friends-list__item--active': openUserID === friend.user.id,
      })

      // When an account is clicked, calling 'changeOpenUserID(id)'
      return (
          <li
            onClick={ () => this.changeOpenUserID(friend.user.id) }
            className={ itemClasses }
            key={ friend.user.id }
          >
            <div className='friends-list__item__picture'>
              <img src={ friend.user.profile_picture } />
            </div>
            <div className='friends-list__item__details'>
              <h4 className='friends-list__item__name'>
                { friend.user.name }
              </h4>
              <h6 className='friends-list__item__timestamp'>
                { date }
              </h6>
              <span className='friends-list__item__message'>
                { statusIcon } { friend.message.contents }
              </span>
            </div>
          </li>
      )
    }, this)

    // Returning 'friendsList'
    return <ul className='friends-list__list'>{ friendsList }</ul>;
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
FriendsList.propTypes = {
  currentUserID: PropTypes.number,
  openUserID: PropTypes.number,
  friends: PropTypes.array,
  openMessages: PropTypes.array,
  lastMessages: PropTypes.array,
  relationships: PropTypes.array,
}

export default FriendsList
