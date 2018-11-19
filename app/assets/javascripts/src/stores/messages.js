// stores/messages.js

import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import {ActionTypes} from '../utils'

//
// Designating a temporary 'messages'
// ** At least one account has to have enough data (with ':messages' in an array)
//   to define 'this.initialState' in 'components/userList.js'
//
const messages = {
  1: {
    user: { id: 1, name: 'Alright? official account', profile_picture: '', status: 'online' },
    lastAccess: { partner: 1424469794050, current_user: 1424469794080 },
    messages: [{ id: 1, sent_from: 1, sent_to: 2, contents: 'Hey!', timestamp: 1424469793023 }],
  },
}
//
// Designating a temporary 'currentUserID' to '1'
//
// const currentUserID = 1
// {
//   user: { id: 1, name: 'John Doek', profile_picture: '',  status: 'online' },
// }
//
// Designating a temporary 'openChatUserID' to '2'
// ** Object.keys(messages), which is [2], is an array of keys in 'messages'
//
var openChatUserID = parseInt(Object.keys(messages)[0], 10)

class AppStore extends BaseStore {
  //
  // 1. Associating the key "messages" with '[]'
  // 2. Associating the key "messages" with 'messages'
  // 3. Returning 'messages' or 'messages[openChatUserID]'
  // ** If defined as 'setMessages(messages)', 'messages' is overwritten, which should be avoided
  //
  getMessages(tmpMsgID) {
    if (!this.get('messages')) this.setMessages([])
    //
    // If called as 'getMessages()',       returning 'messages'
    // If called as 'getMessages(tmpID)',  returning 'messages[tmpID]'
    //
    if (!tmpMsgID) return this.get('messages')
    return this.get('messages')[tmpMsgID]
  }
  setMessages(tmpMsg) {
    //
    // Unfortunately, 'var tmpMsg' violates "no-redeclare"
    //
    if (!this.get('messages')) tmpMsg = messages
    //
    // Updating 'openChatUserID'
    //
    var tmpUsrID = this.getOpenChatUserID()
    //
    // Extracting a 'messages' hash to facilitate defining 'currentUserID'
    //
    const tmpMsgDgt = tmpMsg[tmpUsrID]['messages'][0]
    //
    // If 'sent_from_id' is equal to 'tmpUsrID'
    // ** Using '===' to ensure that they are also equal in terms of object types
    //
    if (tmpMsgDgt['sent_from'] === tmpUsrID) {
      //
      // 'sent_to_id' is equal to 'currentUserID'
      // ** Adding 'currentUserID' only at 'messages[openChatUsertID]'
      //
      tmpMsg[tmpUsrID].currentUserID = tmpMsgDgt['sent_to']
    //
    // Else, 'sent_from_id' is equal to 'currentUserID'
    //
    } else {
      tmpMsg[tmpUsrID].currentUserID = tmpMsgDgt['sent_from']
    }
    //
    // Associating the key "messages" with 'messages'
    //
    this.set('messages', tmpMsg)
  }
  //
  // 1. Associating the key "open_user_id" with '[]'
  // 2. Associating the key "open_user_id" with 'openChatUserID'
  // 3. Returning 'openChatUserID'
  // ** If defined as 'setOpenChatUserID(openChatUserID)',
  //    'openChatUserID' is overwritten, which should be avoided
  //
  getOpenChatUserID() {
    if (!this.get('open_user_id')) this.setOpenChatUserID([])
    return this.get('open_user_id')
  }
  setOpenChatUserID(tmpOpnUsrID) {
    //
    // Unfortunately, 'var tmpMsg' violates "no-redeclare"
    //
    if (!this.get('open_user_id')) tmpOpnUsrID = openChatUserID
    this.set('open_user_id', tmpOpnUsrID)
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
}

//
// Creating a new instance 'MessagesStore' from 'AppStore'
//
const MessagesStore = new AppStore()

MessagesStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action

  switch (action.type) {
    //
    // When called from 'constructor(props)' in 'components/messageBox.js',
    // getting a JSON string from "GET '/api/messages'", and
    // updating 'openChatUserID' and 'messages' with it
    // ** 'emitChange()' is necessary to activate 'onStoreChange()'
    // **  in 'components/userList.js' and 'components/messageBox.js'
    //
    case ActionTypes.GET_MESSAGES:
      const tmpMsg_g = action.json
      const tmpUsrID_g = parseInt(Object.keys(tmpMsg_g)[0], 10)
      MessagesStore.setOpenChatUserID(tmpUsrID_g)
      MessagesStore.setMessages(tmpMsg_g)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'handleKeyDown(e)' in 'components/replyBox.js',
    // getting a JSON string from "POST '/api/messages'", and
    // and updating 'messages' and the access log with it
    //
    case ActionTypes.SEND_MESSAGE:
      const tmpMsg_s = MessagesStore.getMessages()
      const tmpUsrID_s = action.userID
      tmpMsg_s[tmpUsrID_s].messages.push(action.json)
      tmpMsg_s[tmpUsrID_s].lastAccess.current_user = +new Date().getTime()
      MessagesStore.setMessages(tmpMsg_s)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'changeOpenChat(id)' in 'components/userList.js',
    // updating 'openChatUserID' and the access log
    //
    case ActionTypes.UPDATE_OPEN_CHAT_ID:
      const tmpMsg_u = MessagesStore.getMessages()
      const tmpUsrID_u = action.userID
      tmpMsg_u[tmpUsrID_u].lastAccess.current_user = +new Date().getTime()
      MessagesStore.setOpenChatUserID(tmpUsrID_u)
      MessagesStore.setMessages(tmpMsg_u)
      //
      MessagesStore.emitChange()
      break
  }

  return true
})

export default MessagesStore
