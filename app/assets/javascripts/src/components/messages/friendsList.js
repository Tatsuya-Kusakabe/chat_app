//
// components/friendsList.js
//
// Importing components
//
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Utils from '../../utils'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
//
// Creating a new class 'FriendsList'
//
class FriendsList extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props  (modifiable   values) from 'React.component'
    // Inheriting states (unmodifiable values) as   'this.getStateFromStore()'
    //
    super(props)
    this.state = this.initialState
    //
  }
  //
  // Equalizing 'this.initialState' and 'this.getStateFromStore(init)'
  // ** If you write "get hoge() {return fuga}", this.hoge does fuga
  //
  get initialState() {
    const initial = true
    return this.getStateFromStore(initial)
  }
  //
  getStateFromStore(initial) {
    //
    // Defining 'currentUserID', 'openUserID' and 'messages'
    // ** If calling 'this.getStateFromStore(initial)', defining 'get...(initial)'
    // ** If calling 'this.getStateFromStore()',        defining 'get...()'
    //
    let currentUserID = MessagesStore.getCurrentUserID(initial)
    let openUserID = MessagesStore.getOpenUserID(initial)
    let messages = MessagesStore.getMessages(initial)
    //
    // If 'messages' has information only about 'x: {current_user: true}',
    // returning 'currentUserID' only
    //
    if (!Object.keys(messages).length) {
      //
      return { currentUserID: currentUserID, openUserID: null, messageList: null }
    //
    // If not
    //
    } else {
      //
      // Getting details on the last message for each account as 'messageList'
      //
      const messageList = []
      _.each(messages, (message) => {
        messageList.push({
          lastMessage: message.messages[message.messages.length - 1],
          lastAccess: message.lastAccess,
          user: message.user,
        })
      })
      //
      // Returning 'currentUserID', 'openUserID' and 'messageList'
      //
      return { currentUserID: currentUserID, openUserID: openUserID, messageList: messageList }
    //
    }
  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  //
  onStoreChange() {
    this.setState(this.getStateFromStore())
  }
  //
  // When an account is clicked, changing chats displayed
  //
  changeOpenUserID(id) {
    MessagesAction.changeOpenUserID(id)
  }
  //
  // ??
  //
  componentWillMount() {
    MessagesStore.onChange(this.onStoreChange.bind(this))
  }
  componentWillUnmount() {
    MessagesStore.offChange(this.onStoreChange.bind(this))
  }
  //
  // Rendering results
  //
  render() {
    //
    switch (true) {
      //
      // When 'current_user' has no friends, displaying 'No messages'
      // ** 'return' ends 'switch (true)', so 'break' is not necessary
      //
      case (!this.state.openUserID):
        //
        return (
            <div className='friends-list'>
              <div className='friends-list__list friends-list__list__empty'>
                No messages
              </div>
            </div>
        )
      //
      // When 'current_user' has any messages
      //
      default:
        //
        // ??
        //
        this.state.messageList.sort((a, b) => {
          if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
            return -1
          }
          if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
            return 1
          }
          return 0
        })
        //
        // Creating each 'friends-list' item from 'this.state.messageList'
        //
        const messages = this.state.messageList.map((message, index) => {
          //
          // Calculating when 'last_message' was post
          //
          const date = Utils.getNiceDate(message.lastMessage.timestamp)
          //
          var statusIcon
          //
          // If the last message was posted after the last access, showing a 'circle' icon
          //
          if (message.lastAccess.current_user < message.lastMessage.timestamp) {
            statusIcon = (<i className='fa fa-circle friends-list__item__icon' />)
          }
          //
          // If the last message was posted from a current user, showing a 'reply' icon
          //
          if (message.lastMessage.sent_from === this.state.currentUserID) {
            statusIcon = (<i className='fa fa-reply friends-list__item__icon' />)
          }
          //
          var isNewMessage = false
          //
          // If the last message was posted after the last access, and
          // if the last message was posted from a partner,
          // 'isNewMessage' becomes 'true'
          //
          if (message.lastAccess.current_user < message.lastMessage.timestamp) {
            isNewMessage = (message.lastMessage.sent_from !== this.state.currentUserID)
          }
          //
          // Defining 'item_classes' for each message icon
          //
          const itemClasses = classNames({
            'clear': true,
            'friends-list__item': true,
            'friends-list__item--new': isNewMessage,
            'friends-list__item--active': this.state.openUserID === message.user.id,
          })
          //
          // Returning each 'friends-list' item
          //
          return (
            //
            // When an account is clicked, returning 'changeOpenUserID(message.user.id)'
            //
            <li
              onClick={ this.changeOpenUserID.bind(this, message.user.id) }
              className={ itemClasses }
              key={ message.user.id }
            >
              <div className='friends-list__item__picture'>
                <img src={ message.user.profile_picture } />
              </div>
              <div className='friends-list__item__details'>
                <h4 className='friends-list__item__name'>
                  { message.user.name }
                  <abbr className='friends-list__item__timestamp'>
                    { date }
                  </abbr>
                </h4>
                <span className='friends-list__item__message'>
                  { statusIcon } { message.lastMessage.contents }
                </span>
              </div>
            </li>
          )
        }, this)
        //
        // Returning 'messages'
        //
        return (
          <ul className='friends-list__list'>
            { messages }
          </ul>
        )
      //
    }
  }
}

export default FriendsList
