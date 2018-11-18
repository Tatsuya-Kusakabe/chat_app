// components/userList.js

import React from 'react'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
import _ from 'lodash'
import classNames from 'classnames'
import Utils from '../../utils'

class UserList extends React.Component {

  constructor(props) {
    //
    // Inheriting props  (modifiable   values) from 'React.component'
    // Inheriting states (unmodifiable values) as   'this.getStateFromStore()'
    //
    super(props)
    this.state = this.initialState
  }
  //
  // Equalizing 'this.initialState' and 'this.getStateFromStore()'
  // ** If you write "get hoge() {return fuga}", this.hoge does fuga
  //
  get initialState() {
    return this.getStateFromStore()
  }
  getStateFromStore() {
    //
    // Calling getMessages()       from 'stores/messages' and
    //         getOpenChatUserID() from 'stores/messages'
    //
    const allMessages = MessagesStore.getMessages()
    const openChatUserID = MessagesStore.getOpenChatUserID()
    //
    //
    // Getting as 'messageList' details on the last message for each account
    //
    const messageList = []
    _.each(allMessages, (message) => {
      const messagesLength = message.messages.length
      messageList.push({
        lastMessage: message.messages[messagesLength - 1],
        lastAccess: message.lastAccess,
        user: message.user,
      })
    })
    //
    // Returning 'currentUserID', 'openChatUserID' and 'messageList'
    //
    return {
      currentUserID: MessagesStore.getMessages(openChatUserID).currentUserID,
      openChatUserID: openChatUserID,
      messageList: messageList,
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
  changeOpenChat(id) {
    MessagesAction.changeOpenChat(id)
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
    this.state.messageList.sort((a, b) => {
      if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
        return -1
      }
      if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
        return 1
      }
      return 0
    })

    const messages = this.state.messageList.map((message, index) => {
      const date = Utils.getNiceDate(message.lastMessage.timestamp)

      var statusIcon
      //
      // If the last message was posted after the last access, showing a 'circle' icon
      //
      if (message.lastAccess.current_user < message.lastMessage.timestamp) {
        statusIcon = (<i className='fa fa-circle user-list__item__icon' />)
      }
      //
      // If the last message was posted from a current user, showing a 'reply' icon
      //
      if (message.lastMessage.sent_from === this.state.currentUserID) {
        statusIcon = (<i className='fa fa-reply user-list__item__icon' />)
      }

      var isNewMessage = false
      //
      // If the last message was posted after the last access, and
      // if the last message was posted from a partner,
      // 'isNewMessage' becomes 'true'
      //
      if (message.lastAccess.current_user < message.lastMessage.timestamp) {
        isNewMessage = (message.lastMessage.sent_from !== this.state.currentUserID)
      }

      const itemClasses = classNames({
        'user-list__item': true,
        'clear': true,
        'user-list__item--new': isNewMessage,
        'user-list__item--active': this.state.openChatUserID === message.user.id,
      })

      return (
        <li
          //
          // When an account is clicked, returning 'changeOpenChat(message.user.id)'
          //
          onClick={ this.changeOpenChat.bind(this, message.user.id) }
          className={ itemClasses }
          key={ message.user.id }
        >
          <div className='user-list__item__picture'>
            <img src={ message.user.profile_picture } />
          </div>
          <div className='user-list__item__details'>
            <h4 className='user-list__item__name'>
              { message.user.name }
              <abbr className='user-list__item__timestamp'>
                { date }
              </abbr>
            </h4>
            <span className='user-list__item__message'>
              { statusIcon } { message.lastMessage.contents }
            </span>
          </div>
        </li>
      )
    }, this)
    return (
      <div className='user-list'>
        <ul className='user-list__list'>
          { messages }
        </ul>
      </div>
    )
  }
}

export default UserList
