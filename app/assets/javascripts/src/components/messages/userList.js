// components/userList.js

import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Utils from '../../utils'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'

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
  // Equalizing 'this.initialState' and 'this.getStateFromStore(init)'
  // ** If you write "get hoge() {return fuga}", this.hoge does fuga
  //
  get initialState() {
    const initial = true
    return this.getStateFromStore(initial)
  }
  //
  getStateFromStore(_init) {
    //
    // If 'this.getStateFromStore()' contains an argument 'initial = true',
    // setting an argument 'initial = true' to getters
    //
    let initial = (!!_init) ? true : false
    //
    // Defining 'openChatUserID', 'currentUserID' and 'messages'
    //
    let openChatUserID = MessagesStore.getOpenChatUserID(initial)
    let currentUserID = MessagesStore.getCurrentUserID(initial)
    let messages = MessagesStore.getMessages(initial)
    //
    // If 'messages' has information only about 'x: {current_user: true}',
    // returning 'currentUserID' only
    //
    if (!Object.keys(messages).length) {
      //
      return { currentUserID: currentUserID, openChatUserID: null, messageList: null }
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
      // Returning 'currentUserID', 'openChatUserID' and 'messageList'
      //
      return { currentUserID: currentUserID, openChatUserID: openChatUserID, messageList: messageList }
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
    //
    switch (true) {
      //
      // When 'current_user' has no friends, displaying 'No messages'
      // ** 'return' ends 'switch (true)', so 'break' is not necessary
      //
      case (!this.state.openChatUserID):
        //
        return (
            <div className='user-list'>
              <div className='user-list__list user-list__list__empty'>
                No messages
              </div>
            </div>
        )
      //
      // When 'current_user' has any messages
      //
      default:
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
      //
    }
  }
}

export default UserList
