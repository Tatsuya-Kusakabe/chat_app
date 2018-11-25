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
import ReplyBox from '../../components/messages/replyBox'
//
// Creating a new class 'MessagesBox'
//
class MessagesBox extends React.Component {
  //
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
  // Equalizing 'this.initialState' and 'this.getStateFromStore(initial)'
  // ** If you write "get hoge() {return fuga}", 'this.hoge' does 'fuga'
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
    // clearing values of 'this.initialState' and returning it
    //
    if (!Object.keys(messages).length) {
      //
      // ** How to use 'reduce' is described below
      //    https://stackoverflow.com/questions/26264956/
      //    convert-object-array-to-hash-map-indexed-by-an-attribute-value-of-the-object
      //
      // ** 'keys' ... ["currentUserID", "openChatUserID", "messageList"]
      // ** 'cum_obj' accumulates a process done after '=>'
      // ** 'elm' is each element of 'keys'
      // ** 'cum_obj' adds the key 'elm' with the value 'null'
      // ** 'cum_obj' is finally assigned to 'emp_obj'
      // ** 'cum_obj' starts with '{}', which is an empty object
      //
      return Object.keys(this.initialState).reduce( (cum_obj, elm) => (cum_obj[elm] = null, cum_obj), {} )
    //
    // If not, returning 'messages[openChatUserID]' with 'currentUserID' added
    //
    } else {
      //
      const tmpMsg = messages[openChatUserID]
      tmpMsg.currentUserID = currentUserID
      return tmpMsg
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
            <ReplyBox />,
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
        // Dismantling 'this.state.messages' into 'messages'
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
          // Returing 'messages' including each 'message.contents'
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
            <div className='message-box'>
              <ul className='message-box__list'>
                { messages }
              </ul>
              <ReplyBox />,
            </div>
        )
      //
    }
  }
}

export default MessagesBox
