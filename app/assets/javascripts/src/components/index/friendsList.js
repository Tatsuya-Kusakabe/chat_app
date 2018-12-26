
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import UserAction from '../../actions/index/users'
import MessageAction from '../../actions/index/messages'
import RelationshipAction from '../../actions/index/relationships'
import Utils from '../../utils'

class FriendsList extends React.Component {

  // When an account is clicked, changing chats displayed and updating 'timestamp'
  async changeOpenUserID(tmpOpenUserID) {
    await UserAction.changeOpenUserID(tmpOpenUserID)

    const { openUserID } = this.props
    MessageAction.fetchOpenMessages(openUserID)
    RelationshipAction.updateTimestamp(openUserID)
  }

  // When 'this.props' is imperfect (during initial render), or
  // when 'current_user' has no friends (or last_messages or relationships),
  // returning true (meaning 'it should not be rendered')
  skipRender() {
    const { currentUserID, friends, lastMessages, relationships } = this.props
    const skipRender = !(
      currentUserID && friends && lastMessages && relationships &&
      (friends.length > 0) && (lastMessages.length > 0) &&
      (relationships.length > 0)
    )
    return skipRender
  }

  // When it's OK to be rendered but 'openUserID' is not defined,
  // initializing 'openUserID'
  // ** Using 'setTimeout' because dispatch from 'app.js' not completed yet
  // ** ('dispatch' mechanism) https://github.com/rafrex/flux-async-dispatcher
  componentDidUpdate() {
    const { openUserID } = this.props
    const shouldInitialize = !(this.skipRender()) && !openUserID

    if (shouldInitialize) {
      const initOpenUserID = this.friendsInfoSorted()[0].user.id
      setTimeout(() => this.changeOpenUserID(initOpenUserID), 1)
    }
  }

  // Incorpolating 'user' info with last 'message' and 'timestamp'
  friendsInfo() {
    const { currentUserID, friends, lastMessages, relationships } = this.props

    const friendsInfo = friends.map((friend, index) => {
      let friendInfo = []
      const friendID = String(friend.id)
      const relationship = _.find(relationships, friendID)[friendID]
      friendInfo.user = friend
      friendInfo.message = _.find(lastMessages, friendID)[friendID][0]
      friendInfo.timestamp = (relationship.applicantId === currentUserID)
        ? { currentUser: relationship.timestampApplicant,
            friend: relationship.timestampRecipient }
        : { currentUser: relationship.timestampRecipient,
            friend: relationship.timestampApplicant }
      return friendInfo
    })

    return friendsInfo
  }

  // Sorting 'friendsInfo' according to 'timestamp'
  friendsInfoSorted() {
    const friendsInfo = this.friendsInfo()

    const friendsInfoSorted = friendsInfo.sort((a, b) => {
      // ** Just after applying friendship, 'timestamp.friend' is null
      const timestamp_a = (a.timestamp.friend !== null)
        ? a.timestamp.friend : a.timestamp.currentUser
      const timestamp_b = (b.timestamp.friend !== null)
        ? b.timestamp.friend : b.timestamp.currentUser

      if (timestamp_a > timestamp_b) return -1
      if (timestamp_a < timestamp_b) return 1
      return 0
    })

    return friendsInfoSorted
  }

  // If the last message was posted after the last access, and
  //    the last message was posted from a partner,
  // setting 'isNewMessage' to true
  isNewMessage(friend) {
    const { openUserID } = this.props
    const isNewMessage =
      ((friend.message.timestamp > friend.timestamp.currentUser) &&
       (friend.message.sentFrom === openUserID))
    return isNewMessage
  }

  statusIcon(friend) {
    let statusIcon
    const { currentUserID } = this.props

    // If the last message was posted after the last access,
    // showing a 'circle' icon and,
    if (friend.message.timestamp > friend.timestamp.currentUser) {
      statusIcon = (<i className='fa fa-circle friends-list__item__icon'/>)
    }

    // If the last message was posted from a current user,
    // showing a 'reply' icon
    if (friend.message.sentFrom === currentUserID) {
      statusIcon = (<i className='fa fa-reply friends-list__item__icon'/>)
    }

    return statusIcon
  }

  render() {
    const { currentUserID, openUserID } = this.props

    if (this.skipRender()) {
      return (
          <div className='friends-list__list friends-list__list__empty'>
            No friends
          </div>
      )
    }

    // Rendering 'friendsInfoSorted'
    const friendsList = this.friendsInfoSorted().map((friend, index) => {
      // Calculating when 'last_message' was post
      const date = Utils.getNiceDate(friend.message.timestamp)

      // Defining 'item_classes' for each tab
      const itemClasses = classNames({
        'clear': true,
        'friends-list__item': true,
        'friends-list__item--new': this.isNewMessage(friend),
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
              <img src={ friend.user.profilePicture } />
            </div>
            <div className='friends-list__item__details'>
              <h4 className='friends-list__item__name'>
                { friend.user.name }
              </h4>
              <h6 className='friends-list__item__timestamp'>
                { date }
              </h6>
              <span className='friends-list__item__message'>
                { this.statusIcon(friend) } { friend.message.contents }
              </span>
            </div>
          </li>
      )
    }, this)

    // Returning 'friendsList'
    return <ul className='friends-list__list'>{ friendsList }</ul>
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
FriendsList.propTypes = {
  currentUserID: PropTypes.number,
  openUserID: PropTypes.number,
  friends: PropTypes.array,
  lastMessages: PropTypes.array,
  relationships: PropTypes.array,
}

export default FriendsList
