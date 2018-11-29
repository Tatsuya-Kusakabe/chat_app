//
// components/messagesBox.js
//
// Importing components
//
import React from 'react'
import classNames from 'classNames'
import _ from 'lodash'
import Utils from '../../utils'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
import ReplyBox from '../../components/messages/_replyBox'
//
let initial_bln
//
// Creating a new class 'MessagesBox'
//
class MessagesBox extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    this.state = this.initialState
    //
  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  //
  onStoreChange() {
    console.log("set state messages box")
    this.setState(this.getStateFromStore())
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
    console.log("render messages box")
    //
    switch (true) {
      //
      // When 'current_user' has no friends, displaying 'No messages' without 'reply_box'
      // ** 'return' ends 'switch (true)', so 'break' is not necessary
      //
      case (!this.state.user):
        //
        return (
            <div className='message-box'>
              <div className='message-box__list message-box__list__empty'>
                No messages
              </div>
            </div>
        )
      //
      // When 'current_user' has no messages with a friend chosen,
      // displaying 'No messages' with 'reply_box'
      //
      case (!this.state.messages):
        //
        return (
            <div className='message-box'>
              <div className='message-box__list message-box__list__empty'>
                No messages
              </div>
              <ReplyBox />
            </div>
        )
      //
      // When 'current_user' has any messages
      //
      default:
        //
        // Defining 'current_user_ID', 'message_length' and 'last_message'
        //
        const currentUserID = this.state.currentUserID
        const messagesLength = this.state.messages.length
        const lastMessage = this.state.messages[messagesLength - 1]
        //
        // Creating each 'message-box' item from 'this.state.messages'
        //
        const messages = this.state.messages.map((message, index) => {
          //
          // Defining 'item_classes' for each message icon
          //
          const itemClasses = classNames({
            'message-box__item': true,
            'clear': true,
          })
          //
          // Defining 'content_classes' for each message string
          //
          const contentClasses = classNames({
            'message-box__content': true,
            'message-box__content__from-current': message.sent_from === currentUserID,
            'message-box__content__from-partner': message.sent_from !== currentUserID,
          })
          //
          // Returing each 'message.contents'
          //
          return (
              <li key={ message.timestamp + '-' + message.sent_from } className={ itemClasses }>
                <div className={ contentClasses }>
                  { message.contents }
                </div>
              </li>
          )
          //
        })
        //
        // If 'last_message' was sent from 'current_user' and already accessed by 'partner'
        //
        if ((lastMessage.sent_from === currentUserID) &&
         (lastMessage.timestamp <= this.state.lastAccess.partner)) {
          //
          // Displaying 'date' when 'last_message' was read
          //
          const date = Utils.getNiceDate(this.state.lastAccess.partner)
          //
          messages.push(
              <li key='read' className='message-box__item'>
                <div className='message-box__read'>
                  Read { date }
                </div>
              </li>
          )
          //
        }
        //
        // Returning 'messages'
        //
        return (
              <ul className='message-box__list'>
                { messages }
              </ul>
        )
      //
    }
  }
}

export default MessagesBox
