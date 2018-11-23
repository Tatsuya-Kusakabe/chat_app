// components/messagesBox.js

import React from 'react'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
import ReplyBox from '../../components/messages/replyBox'
import classNames from 'classNames'
import Utils from '../../utils'

class MessagesBox extends React.Component {

  constructor(props) {
    //
    // Inheriting props  (modifiable   values) from 'React.component'
    // Inheriting states (unmodifiable values) as   'this.getStateFromStore()'
    //
    super(props)
    this.state = this.initialState
    //
    // Calling getMessages() from 'actions/messages'
    // While calling, proceeding next
    // ** Do not prepend "return" to objects (in this case, promise objects).
    // ** If so, the constructor will return promise objects, not 'this'...
    //
    MessagesAction.getMessages()
  }
  //
  // Equalizing 'this.initialState' and 'this.getStateFromStore()'
  // ** If you write "get hoge() {return fuga}", 'this.hoge' does 'fuga'
  //
  get initialState() {
    return this.getStateFromStore()
  }
  getStateFromStore() {
    //
    // Calling getMessages() from 'stores/messages', returning 'messages[openChatID]'
    // ** If you remove "return", 'messages[openChatID]' can't be referred in 'get initialState()'
    //
    return MessagesStore.getMessages(MessagesStore.getOpenChatUserID())
  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  //
  onStoreChange() {
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
    const messagesLength = this.state.messages.length
    const currentUserID = this.state.currentUserID

    const messages = this.state.messages.map((message, index) => {
      const itemClasses = classNames({
        'message-box__item': true,
        'clear': true,
      })

      const contentClasses = classNames({
        'message-box__content': true,
        'message-box__content__from-current': message.sent_from === currentUserID,
        'message-box__content__from-partner': message.sent_from !== currentUserID,
      })

      return (
          <li key={ message.timestamp + '-' + message.sent_from } className={ itemClasses }>
            <div className={ contentClasses }>
              { message.contents }
            </div>
          </li>
        )
    })

    const lastMessage = this.state.messages[messagesLength - 1]

    if (lastMessage.sent_from === currentUserID) {
      if (this.state.lastAccess.partner >= lastMessage.timestamp) {
        const date = Utils.getNiceDate(this.state.lastAccess.partner)
        messages.push(
            <li key='read' className='message-box__item'>
              <div className='message-box__read'>
                Read { date }
              </div>
            </li>
          )
      }
    }
    return (
        <div className='message-box'>
          <ul className='message-box__list'>
            { messages }
          </ul>
          <ReplyBox />,
        </div>
      )
  }
}

export default MessagesBox
