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
const messages = [
  //
  {
    user: { id: 2, name: 'Alright? official account', profile_picture: '', status: 'online' },
    lastAccess: { partner: 1424469794050, current_user: 1424469794080 },
    messages: [{ id: 1, sent_from: 2, sent_to: 1, contents: 'Hey!', timestamp: 1424469793023 }],
  },
  //
]
//
// Designating temporary 'currentUserID', 'openUserID' and 'openUserTab'
//
const currentUserID = 1
const openUserID = 2
const openUserTab = 'Friends'
//
// Creating a new class 'AppStore'
//
class AppStore extends BaseStore {
  //
  // Defining a conprehensive 'getter'
  //
  getProperties(initial_obj, key) {
    //
    // If 'key' is not associated yet, associating 'key' with 'initial_obj'
    // ** Without 'If', calling 'this.setProperties()' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    //
    if (!this.get(`${key}`)) this.setProperties(initial_obj, key)
    //
    // Returning an object associated with 'key'
    //
    return this.get(`${key}`)
    //
  }
  //
  // Defining a conprehensive 'setter' (Associating 'key' with 'obj')
  //
  setProperties(obj, key) {
    this.set(`${key}`, obj)
  }
  //
  // Getting an object associated with 'messages'
  //
  getMessages() {
    return this.getProperties(messages, 'messages')
  }
  //
  // Setting an object associated with 'messages'
  //
  setMessages(msg) {
    this.setProperties(msg, 'messages')
  }
  //
  // Getting an object associated with 'suggestions'
  //
  getSuggestions() {
    return this.getProperties(messages, 'suggestions')
  }
  //
  // Setting an object associated with 'suggestions'
  //
  setSuggestions(sgt) {
    this.setProperties(sgt, 'suggestions')
  }
  //
  // Getting an object associated with 'current_user_id'
  //
  getCurrentUserID() {
    return this.getProperties(currentUserID, 'current_user_id')
  }
  //
  // Setting an object associated with 'current_user_id'
  //
  setCurrentUserID(crtUsrID) {
    this.setProperties(crtUsrID, 'current_user_id')
  }
  //
  // Getting an object associated with 'open_user_id'
  //
  getOpenUserID() {
    return this.getProperties(openUserID, 'open_user_id')
  }
  //
  // Setting an object associated with 'open_user_id'
  //
  setOpenUserID(tmpOpnUsrID) {
    this.setProperties(tmpOpnUsrID, 'open_user_id')
  }
  //
  // Getting an object associated with 'open_user_tab'
  //
  getOpenUserTab() {
    return this.getProperties(openUserTab, 'open_user_tab')
  }
  //
  // Setting an object associated with 'open_user_tab'
  //
  setOpenUserTab(tmpOpnTab) {
    this.setProperties(tmpOpnTab, 'open_user_tab')
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
  let tmpMsg, msg, crtUsrID, opnUsrID, opnTabNm
  //
  switch (action.type) {
    //
    // When called from 'changeOpenUserTab(name)' in 'components/messagesBox.js'
    //
    case ActionTypes.UPDATE_OPEN_TAB_NAME:
      //
      // Calling setters
      //
      MessagesStore.setOpenUserTab(action.name)
      //
      // ** 'emitChange()' is skipped because 'UPDATE_OPEN_TAB_NAME' is
      //    always followed by 'GET_MESSAGES' of 'GET_SUGGESTIONS'
      //
      break
    //
    // When called from 'constructor(props)' in 'components/_friendsList.js'
    //                                       or 'components/_suggestionsList.js'
    //
    case ActionTypes.GET_MESSAGES:
    case ActionTypes.GET_SUGGESTIONS:
      //
      // Getting a JSON string from "GET '/api/messages'"
      //
      tmpMsg = action.json
      //
      // Defining 'msg', by removing 'current_user' from 'tmpMsg'
      //
      // ** https://stackoverflow.com/questions/42774551/
      // ** (old version) https://stackoverflow.com/questions/40065836/
      //
      msg = _.reject(tmpMsg, { 'user': { 'current_user': true } })
      //
      // Defining 'crtUsrID', by extracting 'current_user' from 'tmpMsg'
      //
      crtUsrID = _.filter(tmpMsg, { 'user': { 'current_user': true } })[0]['user']['id']
      crtUsrID = parseInt(crtUsrID, 10)
      //
      // If 'msg' does exist
      //
      if (msg.length !== 0) {
        //
        // Sorting by the last message's timestamp or user's name
        // ** https://stackoverflow.com/questions/43371092/
        //
        msg = (action.type === ActionTypes.GET_MESSAGES)
          ? _.sortBy(msg, obj => obj.lastAccess.post).reverse()
          : _.sortBy(msg, obj => obj.user.name)
        //
        // Setting a first user as 'opnUsrID' from 'msg'
        //
        opnUsrID = msg[0]['user']['id']
        opnUsrID = parseInt(opnUsrID, 10)
        //
      } else {
        //
        // Defining 'msg' and 'opnUsrID' as empty arrays
        // ** 'null' or 'undefined' does not trigger 'setState'
        //
        msg = []
        opnUsrID = "none"
        //
      }
      //
      MessagesStore.setCurrentUserID(crtUsrID)
      MessagesStore.setOpenUserID(opnUsrID)
      //
      console.log(action.type)
      action.type === ActionTypes.GET_MESSAGES
        ? MessagesStore.setMessages(msg)
        : MessagesStore.setSuggestions(msg)
      //
      // ** 'emitChange()' is necessary to activate 'onStoreChange()' in 'components'
      //
      MessagesStore.emitChange()
      break
    //
    // When called from 'handleKeyDown(e)'     in 'components/replyBox.js',
    //               or 'changeOpenUserID(id)' in 'components/_friendsList.js'
    //
    case ActionTypes.SEND_MESSAGE:
    case ActionTypes.UPDATE_OPEN_USER_ID:
      //
      // Getting 'msg', 'opnUsrID', 'opnTabNm'
      //
      msg = MessagesStore.getMessages()
      opnUsrID = action.userID
      opnTabNm = MessagesStore.getOpenUserTab()
      //
      // Defining 'msg' with 'opnUsrID'
      //
      tmpMsg = _.filter(msg, { 'user': { 'id': opnUsrID } })[0]
      //
      // Updating messages (if sending messages) and the access log (if opening 'Friends' tab)
      //
      if (action.type === ActionTypes.SEND_MESSAGE) tmpMsg['messages'].push(action.json)
      if (opnTabNm === 'Friends') tmpMsg['lastAccess']['current_user'] = +new Date().getTime()
      //
      MessagesStore.setOpenUserID(opnUsrID)
      MessagesStore.setMessages(msg)
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
