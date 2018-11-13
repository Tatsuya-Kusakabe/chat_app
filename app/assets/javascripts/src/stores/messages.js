// stores/messages.js

import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
// import UserStore from '../stores/user'
import {ActionTypes} from '../constants/app'

//
// Designating a temporary 'messages'
// ** At least one account has to have enough data (with ':messages' in an array)
//   to define 'this.initialState' in 'components/userList.js'
//
const messages = {
  2: {
    user: { id: '2', name: 'Ryan Clark', profilePicture: '', status: 'online' },
    lastAccess: { recipient: 1424469794050, currentUser: 1424469794080 },
    messages: [{ from: '2', contents: 'Hey!', timestamp: 1424469793023 }],
  },
}

//
// Designating a temporary 'openChatID' to '2'
// ** Object.keys(messages), which is [2, 3, 4], is an array of keys in 'messages'
//
var openChatID = parseInt(Object.keys(messages)[0], 10)

class ChatStore extends BaseStore {
  addChangeListener(callback) {
    this.on('change', callback)
  }
  removeChangeListener(callback) {
    this.off('change', callback)
  }
  //
  // 1. Associating the key "messages" with '[]'
  // 2. Associating the key "messages" with 'messages'
  // 3. Returning 'messages' or 'messages[openChatID]'
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
    this.set('messages', tmpMsg)
  }
  //
  // 1. Associating the key "user_id" with '[]'
  // 2. Associating the key "user_id" with 'openChatID'
  // 3. Returning 'openChatID'
  // ** If defined as 'setOpenChatUserID(openChatID)',
  //    'openChatID' is overwritten, which should be avoided
  //
  getOpenChatUserID() {
    if (!this.get('user_id')) this.setOpenChatUserID([])
    return this.get('user_id')
  }
  setOpenChatUserID(tmpUsrID) {
    //
    // Unfortunately, 'var tmpMsg' violates "no-redeclare"
    //
    if (!this.get('user_id')) tmpUsrID = openChatID
    this.set('user_id', tmpUsrID)
  }
}

//
// Creating a new instance from ChatStore
//
const MessagesStore = new ChatStore()

MessagesStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action

  switch (action.type) {
    //
    // When called from 'changeOpenChat(id)' in 'components/userList.js',
    // updating 'openChatID' and the access log
    // ** 'emitChange()' is necessary to activate 'onStoreChange()'
    // **  in 'components/userList.js' and 'components/messageBox.js'
    //
    case ActionTypes.UPDATE_OPEN_CHAT_ID:
      const tmpUsrID_u = action.userID
      const tmpMsg_u = MessagesStore.getMessages()
      tmpMsg_u[tmpUsrID_u].lastAccess.currentUser = +new Date().getTime()
      MessagesStore.setOpenChatUserID(tmpUsrID_u)
      MessagesStore.setMessages(tmpMsg_u)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'constructor(props)' in 'components/messageBox.js',
    // updating 'messages' to a JSON string from "GET '/api/messages'"
    //
    case ActionTypes.GET_MESSAGES:
      MessagesStore.setMessages(action.json)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'handleKeyDown(e)' in 'components/replyBox.js',
    // getting a JSON string from "POST '/api/messages'",
    // and updating 'messages' and the access log
    //
    case ActionTypes.SEND_MESSAGE:
      const tmpUsrID_s = action.userID
      const tmpMsg_s = MessagesStore.getMessages()
      tmpMsg_s[tmpUsrID_s].messages.push(action.json)
      tmpMsg_s[tmpUsrID_s].lastAccess.currentUser = +new Date().getTime()
      MessagesStore.setMessages(tmpMsg_s)
      //
      MessagesStore.emitChange()
      break
  }

  return true
})

export default MessagesStore
