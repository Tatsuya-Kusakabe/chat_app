//
// stores/messages.js
//
// Importing components
//
import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import UsersStore from './users'
import {ActionTypes} from '../utils'
import _ from 'lodash'
//
// Designating temporary 'messages' and 'openUserTab'
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
const openUserTab = 'Friends'
//
// Creating a new class 'MessagesBaseStore'
//
class MessagesBaseStore extends BaseStore {
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
// Creating a new instance 'MessagesStore' from 'MessagesBaseStore'
//
const MessagesStore = new MessagesBaseStore()
//
MessagesStore.dispatchToken = Dispatcher.register(payload => {
  //
  const action = payload.action
  let tmpMsg, msg, opnUsrID, crtUsrID
  //
  switch (action.type) {
    //
    // When called from 'changeOpenUserTab(userTab)' in 'components/1_usersTab.js'
    //
    case ActionTypes.UPDATE_OPEN_USER_TAB:
      //
      // Calling setters
      //
      MessagesStore.setOpenUserTab(action.name)
      //
      // ** 'emitChange()' is skipped because this action is
      //    always followed by 'GET_FRIENDS' of 'GET_SUGGESTIONS'
      //
      break
    //
    // When called from 'handleKeyDown(e)'             in 'components/7_replyBox.js'
    //          or from 'changeFriendship(friendship)' in 'components/5_usersInfo.js'
    //
    case ActionTypes.SEND_MESSAGE:
      //
      // ** 'emitChange()' is skipped because this action is always followed by...
      //
      break
    //
    // When called from 'constructor(props)' in 'components/2_friendsList.js' or ...
    //
    case ActionTypes.GET_FRIENDS:
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
        msg = (action.type === ActionTypes.GET_FRIENDS)
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
        opnUsrID = 'none'
        //
      }
      //
      UsersStore.setCurrentUserID(crtUsrID)
      UsersStore.setOpenUserID(opnUsrID)
      //
      MessagesStore.setMessages(msg)
      //
      // ** 'emitChange()' is necessary for both 'MessagesStore' and 'UsersStore'
      //    to activate 'onStoreChange()' in 'components'
      //
      UsersStore.emitChange()
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
