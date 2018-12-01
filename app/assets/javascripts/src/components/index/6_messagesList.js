//
// components/6_messagesList.js
//
// Importing components
//
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classNames'
import Utils from '../../utils'
import _ from 'lodash'
//
// Creating a new class 'MessagesList'
//
class MessagesList extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    //
  }
  //
  // Rendering results
  //
  render() {
    //
    // When 'current_user' has no friends, displaying 'No messages' without 'reply_box'
    // ** 'return' ends 'switch (true)', so 'break' is not necessary
    //
    if (!(_.isNumber(this.props.openUserID))) {
      //
      return (
          <div className='message-box'>
            <div className='message-box__list message-box__list__empty'>
              No messages
            </div>
          </div>
      )
      //
    }
    //
    // Extracting messages with 'openUserID'
    //
    const opnUsrRaw = _.filter(this.props.messages, { 'user': { 'id': this.props.openUserID } })[0]
    const opnUsrMsg = opnUsrRaw['messages']
    //
    // When 'current_user' has no messages with 'openUserID',
    // displaying 'No messages' with 'reply_box'
    //
    if (!opnUsrMsg.length) {
      //
      return (
          <div className='message-box'>
            <div className='message-box__list message-box__list__empty'>
              No messages
            </div>
          </div>
      )
    //
    // When 'current_user' has any messages with 'openUserID'
    //
    } else {
      //
      // Defining 'message_length' and 'last_message'
      //
      const lastMessage = opnUsrMsg[opnUsrMsg.length - 1]
      //
      // Creating each 'message-box' item from 'this.props.messages'
      //
      const messages = opnUsrMsg.map((message, index) => {
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
          'message-box__content__from-current': message.sent_from === this.props.currentUserID,
          'message-box__content__from-partner': message.sent_from !== this.props.currentUserID,
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
      if ((lastMessage.sent_from === this.props.currentUserID) &&
       (lastMessage.timestamp <= opnUsrRaw.lastAccess.partner)) {
        //
        // Displaying 'date' when 'last_message' was read
        //
        const date = Utils.getNiceDate(opnUsrRaw.lastAccess.partner)
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
//
// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
//
MessagesList.propTypes = {
  messages: PropTypes.array,
  currentUserID: PropTypes.number,
  openUserID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
//
export default MessagesList
