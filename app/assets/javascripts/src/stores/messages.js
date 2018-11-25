//
// stores/messages.js
//
// Importing components
//
import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import {ActionTypes} from '../utils'
import _ from 'lodash'
//
// Designating a temporary 'messages'
// ** At least one account has to have enough data (with ':messages' in an array)
//   to define 'this.initialState' in 'components'
//
const messages = {
  //
  2: {
    user: { id: 2, name: 'Alright? official account', profile_picture: '', status: 'online' },
    lastAccess: { partner: 1424469794050, current_user: 1424469794080 },
    messages: [{ id: 1, sent_from: 2, sent_to: 1, contents: 'Hey!', timestamp: 1424469793023 }],
  },
  //
  1: { id_current: true }
  //
}
//
// Designating a temporary 'openChatUserID' to '2'
//
const openChatUserID = 2
//
// Creating a new class 'AppStore'
//
class AppStore extends BaseStore {
  //
  getMessages(initial) {
    //
    // If the key 'messages_init' is not associated yet,
    // associating the key 'messages_init' and 'messages'
    // ** 'If' condition avoids calling 'this.setMessages(messages)' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    //
    if (!this.get('messages_init')) this.setMessages(messages)
    //
    // If calling 'getStateFromStore(initial)', returning 'tmpMsgDgt' from 'messages'
    //
    if (!!initial) return this.get('messages_init')
    //
    // Else, returning 'tmpMsgDgt' from a JSON string
    //
    return this.get('messages')
    //
  }
  //
  setMessages(tmpMsg) {
    //
    // From 'tmpMsg', 'x: {id_current: true}' is removed
    // ** https://stackoverflow.com/questions/40065836/lodash-reject-get-return-object
    //
    let tmpMsgDgt = ( _.pickBy(tmpMsg, (o) => !o.id_current) )
    //
    // If the key 'messages_init' is not associated yet,
    // associating the key 'messages_init' with 'tmpMsgDgt'
    // Else, associating the key 'messages' with 'tmpMsgDgt'
    //
    !this.get('messages_init')
      ? this.set('messages_init', tmpMsgDgt)
      : this.set('messages', tmpMsgDgt)
    //
  }
  //
  getCurrentUserID(initial) {
    //
    if (!this.get('id_current_init')) this.setCurrentUserID(messages)
    //
    // If calling 'getStateFromStore(initial)', returning 'crtUsrID' from 'messages'
    //
    if (!!initial) return this.get('id_current_init')
    //
    // Else, returning 'crtUsrID' from a JSON string
    //
    return this.get('id_current')
    //
  }
  //
  setCurrentUserID(tmpMsg) {
    //
    // From 'tmpMsg', which contains 'x: {id_current: true}', 'x' is assigned to 'crtUsrID'
    // ** https://stackoverflow.com/questions/40065836/lodash-reject-get-return-object
    //
    let crtUsrID
    crtUsrID = Object.keys( _.pickBy(tmpMsg, (o) => !!o.id_current) )[0]
    crtUsrID = parseInt(crtUsrID, 10)
    //
    // If the key 'id_current_init' is not associated yet,
    // associating the key 'id_current_init' with 'crtUsrID'
    // Else, associating the key 'id_current' with 'crtUsrID'
    //
    !this.get('id_current_init')
      ? this.set('id_current_init', crtUsrID)
      : this.set('id_current', crtUsrID)
    //
  }
  //
  getOpenChatUserID(initial) {
    //
    if (!this.get('id_open_init')) this.setOpenChatUserID(openChatUserID)
    //
    // If calling 'getStateFromStore(initial)', returning 'tmpOpnUsrID' from 'openChatUserID'
    //
    if (!!initial) return this.get('id_open_init')
    //
    // Else, returning 'tmpOpnUsrID' from a JSON string
    //
    return this.get('id_open')
    //
  }
  //
  setOpenChatUserID(tmpOpnUsrID) {
    //
    // If the key 'id_open_init' is not associated yet,
    // associating the key 'id_open_init' with 'tmpOpnUsrID'
    // Else, associating the key 'id_open' with 'tmpOpnUsrID'
    //
    !this.get('id_open_init')
      ? this.set('id_open_init', tmpOpnUsrID)
      : this.set('id_open', tmpOpnUsrID)
    //
  }
  //
  // ??
  //
  addChangeListener(callback) {
    this.on('change', callback)
  }
  removeChangeListener(callback) {
    this.off('change', callback)
  }
  //
}
//
// Creating a new instance 'MessagesStore' from 'AppStore'
//
const MessagesStore = new AppStore()
//
MessagesStore.dispatchToken = Dispatcher.register(payload => {
  //
  const action = payload.action
  let tmpMsg
  let tmpUsrID
  //
  switch (action.type) {
    //
    // When called from 'constructor(props)' in 'components/messageBox.js'
    //
    case ActionTypes.GET_MESSAGES:
      //
      // Getting a JSON string from "GET '/api/messages'"
      //
      tmpMsg = action.json
      //
      // Getting a first user from 'tmpMsg' which removed 'x: {id_current: true}'
      //
      tmpUsrID = Object.keys( _.pickBy(tmpMsg, (o) => !o.id_current) )[0]
      tmpUsrID = parseInt(tmpUsrID, 10)
      //
      // Calling setters
      //
      MessagesStore.setOpenChatUserID(tmpUsrID)
      MessagesStore.setCurrentUserID(tmpMsg)
      MessagesStore.setMessages(tmpMsg)
      //
      // ** 'emitChange()' is necessary to activate 'onStoreChange()' in 'components'
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'handleKeyDown(e)' in 'components/replyBox.js'
    //
    case ActionTypes.SEND_MESSAGE:
      //
      // let tmpMsg
      // let tmpUsrID
      //
      // Getting messages and a recipient
      //
      tmpMsg = MessagesStore.getMessages()
      tmpUsrID = action.userID
      //
      // Updating messages and the access log
      //
      tmpMsg[tmpUsrID].messages.push(action.json)
      tmpMsg[tmpUsrID].lastAccess.current_user = +new Date().getTime()
      //
      // Calling setters
      //
      MessagesStore.setMessages(tmpMsg)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'changeOpenChat(id)' in 'components/userList.js'
    //
    case ActionTypes.UPDATE_OPEN_CHAT_ID:
      //
      // let tmpMsg
      // let tmpUsrID
      //
      // Getting messages and a user clicked
      //
      tmpMsg = MessagesStore.getMessages()
      tmpUsrID = action.userID
      //
      // Updating the access log
      //
      tmpMsg[tmpUsrID].lastAccess.current_user = +new Date().getTime()
      //
      // Calling setters
      //
      MessagesStore.setOpenChatUserID(tmpUsrID)
      MessagesStore.setMessages(tmpMsg)
      //
      MessagesStore.emitChange()
      break
    //
  }
  //
  return true
  //
})
//
export default MessagesStore
