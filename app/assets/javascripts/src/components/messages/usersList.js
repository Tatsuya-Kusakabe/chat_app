//
// components/friendsList.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MessagesAction from '../../actions/messages'
import Utils from '../../utils'
import _ from 'lodash'
//
// Creating a new class 'UsersList'
//
class UsersList extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    //
  }
  //
  // When an account is clicked, changing chats displayed
  //
  changeOpenUserID(id) {
    MessagesAction.changeOpenUserID(id)
  }
  //
  // Rendering results
  //
  render() {
    //
    console.log(this.props)
    let users
    //
    // When 'current_user' has no numerical 'openUserID' (namely having no friends)
    // ** 'return' ends 'switch (true)', so 'break' is not necessary
    //
    if (!(_.isNumber(this.props.openUserID))) {
      //
      return (
          <div className='users-list__list users-list__list__empty'>
            No {this.props.openUserTab}
          </div>
      )
    //
    // When 'Suggestions' tab is open
    //
    } else if (this.props.openUserTab === 'Suggestions') {
      //
      // Getting details on the users as 'suggestionsList'
      //
      const suggestionsRaw = this.props.suggestions
      const suggestionsList = []
      //
      _.each(suggestionsRaw, (suggestion) => {
        suggestionsList.push({ user: suggestion.user })
      })
      //
      // Creating each 'users-list' item from 'suggestionsList'
      //
      users = suggestionsList.map((suggestion, index) => {
        //
        // Defining 'item_classes' for each message icon
        //
        const itemClasses = classNames({
          'clear': true,
          'users-list__item': true,
          'users-list__item--active': this.props.openUserID === suggestion.user.id,
        })
        //
        // Returning each 'users-list' item
        //
        return (
          //
          // When an account is clicked, returning 'changeOpenUserID(friend.user.id)'
          //
          <li
            onClick={ this.changeOpenUserID.bind(this, suggestion.user.id) }
            className={ itemClasses }
            key={ suggestion.user.id }
          >
            <div className='users-list__item__picture'>
              <img src={ suggestion.user.profile_picture } />
            </div>
            <div className='users-list__item__details'>
              <h4 className='users-list__item__name'>
                { suggestion.user.name }
              </h4>
              {/*
              <span className='users-list__item__message'>
                { statusIcon } { friend.lastMessage.contents }
              </span>
              */}
            </div>
          </li>
        )
      }, this)
    //
    // When 'Friends' tab is open
    //
    } else {
      //
      // Getting details on the users as 'friendsList'
      //
      const friendsRaw = this.props.messages
      const friendsList = []
      //
      _.each(friendsRaw, (friend) => {
        friendsList.push({
          lastMessage: friend.messages[friend.messages.length - 1],
          lastAccess: friend.lastAccess,
          user: friend.user,
        })
      })
      //
      // Creating each 'users-list' item from 'friendsList'
      //
      users = friendsList.map((friend, index) => {
        //
        // Calculating when 'last_message' was post
        //
        const date = Utils.getNiceDate(friend.lastMessage.timestamp)
        //
        var statusIcon
        //
        // If the last message was posted after the last access, showing a 'circle' icon
        //
        if (friend.lastAccess.current_user < friend.lastMessage.timestamp) {
          statusIcon = (<i className='fa fa-circle users-list__item__icon' />)
        }
        //
        // If the last message was posted from a current user, showing a 'reply' icon
        //
        if (friend.lastMessage.sent_from === this.props.currentUserID) {
          statusIcon = (<i className='fa fa-reply users-list__item__icon' />)
        }
        //
        var isNewMessage = false
        //
        // If the last message was posted after the last access, and
        // if the last message was posted from a partner,
        // 'isNewMessage' becomes 'true'
        //
        if (friend.lastAccess.current_user < friend.lastMessage.timestamp) {
          isNewMessage = (friend.lastMessage.sent_from !== this.props.currentUserID)
        }
        //
        // Defining 'item_classes' for each message icon
        //
        const itemClasses = classNames({
          'clear': true,
          'users-list__item': true,
          'users-list__item--new': isNewMessage,
          'users-list__item--active': this.props.openUserID === friend.user.id,
        })
        //
        // Returning each 'users-list' item
        //
        return (
          //
          // When an account is clicked, returning 'changeOpenUserID(friend.user.id)'
          //
          <li
            onClick={ this.changeOpenUserID.bind(this, friend.user.id) }
            className={ itemClasses }
            key={ friend.user.id }
          >
            <div className='users-list__item__picture'>
              <img src={ friend.user.profile_picture } />
            </div>
            <div className='users-list__item__details'>
              <h4 className='users-list__item__name'>
                { friend.user.name }
              </h4>
              <h6 className='users-list__item__timestamp'>
                { date }
              </h6>
              <span className='users-list__item__message'>
                { statusIcon } { friend.lastMessage.contents }
              </span>
            </div>
          </li>
        )
      }, this)
    //
    }
    //
    // Returning 'users'
    //
    return (
      <ul className='users-list__list'>
        { users }
      </ul>
    )
    //
  }
  //
}
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
UsersList.propTypes = {
  messages: PropTypes.array,
  suggestions: PropTypes.array,
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  openUserTab: PropTypes.string,
}
//
export default UsersList
