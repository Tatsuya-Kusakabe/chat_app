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
  1: { current_user_id: true },
  //
}
//
// Designating a temporary 'openUserID' and 'openTabName'
//
const openUserID = 2
const openTabName = 'Friends'
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
    if (initial) return this.get('messages_init')
    //
    // Else, returning 'tmpMsgDgt' from a JSON string
    //
    return this.get('messages')
    //
  }
  //
  setMessages(tmpMsg) {
    //
    // From 'tmpMsg', 'x: {current_user_id: true}' is removed
    // ** https://stackoverflow.com/questions/40065836/lodash-reject-get-return-object
    //
    let tmpMsgDgt = (_.pickBy(tmpMsg, (o) => !o.current_user_id))
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
    if (!this.get('current_user_id_init')) this.setCurrentUserID(messages)
    //
    // If calling 'getStateFromStore(initial)', returning 'crtUsrID' from 'messages'
    //
    if (initial) return this.get('current_user_id_init')
    //
    // Else, returning 'crtUsrID' from a JSON string
    //
    return this.get('current_user_id')
    //
  }
  //
  setCurrentUserID(tmpMsg) {
    //
    // From 'tmpMsg', which contains 'x: {current_user_id: true}', 'x' is assigned to 'crtUsrID'
    // ** https://stackoverflow.com/questions/40065836/lodash-reject-get-return-object
    //
    let crtUsrID
    crtUsrID = Object.keys(_.pickBy(tmpMsg, (o) => !!o.current_user_id))[0]
    crtUsrID = parseInt(crtUsrID, 10)
    //
    // If the key 'current_user_id_init' is not associated yet,
    // associating the key 'current_user_id_init' with 'crtUsrID'
    // Else, associating the key 'current_user_id' with 'crtUsrID'
    //
    !this.get('current_user_id_init')
      ? this.set('current_user_id_init', crtUsrID)
      : this.set('current_user_id', crtUsrID)
    //
  }
  //
  getOpenUserID(initial) {
    //
    if (!this.get('open_user_id_init')) this.setOpenUserID(openUserID)
    //
    // If calling 'getStateFromStore(initial)', returning 'tmpOpnUsrID' from 'openUserID'
    //
    if (initial) return this.get('open_user_id_init')
    //
    // Else, returning 'tmpOpnUsrID' from a JSON string
    //
    return this.get('open_user_id')
    //
  }
  //
  setOpenUserID(tmpOpnUsrID) {
    //
    // If the key 'open_user_id_init' is not associated yet,
    // associating the key 'open_user_id_init' with 'tmpOpnUsrID'
    // Else, associating the key 'open_user_id' with 'tmpOpnUsrID'
    //
    !this.get('open_user_id_init')
      ? this.set('open_user_id_init', tmpOpnUsrID)
      : this.set('open_user_id', tmpOpnUsrID)
    //
  }
  //
  getOpenTabName(initial) {
    //
    if (!this.get('open_tab_name_init')) this.setOpenTabName(openTabName)
    //
    // If calling 'getStateFromStore(initial)', returning 'tmpOpnTab' from 'openUserID'
    //
    if (initial) return this.get('open_tab_name_init')
    //
    // Else, returning 'tmpOpnTab' from a dispatcher
    //
    return this.get('open_tab_name')
    //
  }
  //
  setOpenTabName(tmpOpnTab) {
    //
    // If the key 'open_tab_name_init' is not associated yet,
    // associating the key 'open_tab_name_init' with 'tmpOpnTab'
    // Else, associating the key 'open_tab_name' with 'tmpOpnTab'
    //
    !this.get('open_tab_name_init')
      ? this.set('open_tab_name_init', tmpOpnTab)
      : this.set('open_tab_name', tmpOpnTab)
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
    // When called from 'constructor(props)' in 'components/messagesBox.js'
    //
    case ActionTypes.GET_MESSAGES:
      //
      // Getting a JSON string from "GET '/api/messages'"
      //
      tmpMsg = action.json
      //
      // Getting a first user from 'tmpMsg' which removed 'x: {current_user_id: true}'
      //
      tmpUsrID = Object.keys(_.pickBy(tmpMsg, (o) => !o.current_user_id))[0]
      tmpUsrID = parseInt(tmpUsrID, 10)
      //
      // Calling setters
      // ** 'setCurrentUserID(tmpMsg)' is called only once here
      //
      MessagesStore.setCurrentUserID(tmpMsg)
      //
      MessagesStore.setOpenTabName("Friends")
      MessagesStore.setOpenUserID(tmpUsrID)
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
      MessagesStore.setMessages(tmpMsg)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'changeOpenUserID(id)' in 'components/userList.js'
    //
    case ActionTypes.UPDATE_OPEN_USER_ID:
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
      MessagesStore.setOpenUserID(tmpUsrID)
      MessagesStore.setMessages(tmpMsg)
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'changeOpenTabName(name)' in 'components/messagesBox.js'
    //
    case ActionTypes.UPDATE_OPEN_TAB_NAME:
      //
      MessagesStore.setOpenTabName(action.name)
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
