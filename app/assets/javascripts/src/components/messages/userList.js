// components/userList.js

import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
import UserStore from '../../stores/user'
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
    // Calling getMessages() from 'stores/messages'
    //
    const allMessages = MessagesStore.getMessages()
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
    // Returning 'openChatID' and 'messageList'
    //
    return {
      openChatID: MessagesStore.getOpenChatUserID(),
      messageList: messageList,
    }
  }
  //
  // Updating states as 'this.getStateFromStore()'
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
      if (message.lastMessage.from !== message.user.id) {
        statusIcon = (
          <i className='fa fa-reply user-list__item__icon' />
        )
      }
      if (message.lastAccess.currentUser < message.lastMessage.timestamp) {
        statusIcon = (
          <i className='fa fa-circle user-list__item__icon' />
        )
      }

      var isNewMessage = false
      if (message.lastAccess.currentUser < message.lastMessage.timestamp) {
        isNewMessage = message.lastMessage.from !== UserStore.user.id
      }

      const itemClasses = classNames({
        'user-list__item': true,
        'clear': true,
        'user-list__item--new': isNewMessage,
        'user-list__item--active': this.state.openChatID === message.user.id,
      })

      return (
        <li
          //
          // When an account is clicked, returning 'changeOpenChat(message.user.id)'
          //
          onClick={ this.changeOpenChat.bind(this, message.user.id) }//ß={true}
          className={ itemClasses }
          key={ message.user.id }
        >
          <div className='user-list__item__picture'>
            <img src={ message.user.profilePicture } />
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
