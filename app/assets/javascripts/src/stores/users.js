//
// stores/messages.js
//
// Importing components
//
import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import MessagesStore from './messages'
import {ActionTypes} from '../utils'
import _ from 'lodash'
//
// Designating temporary 'currentUserID', 'openUserID' and 'friendship'
//
const currentUserID = 1
const openUserID = 2
const openContent = 'Messages'
// const friendship = { 2: 'Friends' }
//
// Creating a new class 'UsersBaseStore'
//
class UsersBaseStore extends BaseStore {
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
  getOpenContent() {
    return this.getProperties(openContent, 'open_content')
  }
  //
  setOpenContent(tmpOpnCnt) {
    this.setProperties(tmpOpnCnt, 'open_content')
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
// Creating a new instance 'UsersStore' from 'UsersBaseStore'
//
const UsersStore = new UsersBaseStore()
//
UsersStore.dispatchToken = Dispatcher.register(payload => {
  //
  const action = payload.action
  let tmpMsg, msg, opnUsrID, opnTabNm
  //
  switch (action.type) {
    //
    // When called from 'changeOpenContent(content)' in 'components/4_usersName.js'
    //
    case ActionTypes.UPDATE_OPEN_CONTENT:
      //
      console.log(action.name)
      UsersStore.setOpenContent(action.name)
      MessagesStore.emitChange()
      UsersStore.emitChange()
      break
    //
    // When called from 'changeFriendship(friendship)' in 'components/5_usersInfo.js'
    //
    case ActionTypes.UPDATE_FRIENDSHIP:
      //
      // ** 'emitChange()' is skipped because this action is
      //    always followed by 'GET_FRIENDS' of 'GET_SUGGESTIONS'
      //
      break
    //
    // When called from 'changeOpenUserID(id)' in 'components/2_friendsList.js' or ...
    //
    case ActionTypes.UPDATE_OPEN_USER_ID:
      //
      // Getting 'msg', 'opnUsrID', and 'opnTabNm'
      //
      msg = MessagesStore.getMessages()
      opnTabNm = MessagesStore.getOpenUserTab()
      opnUsrID = action.userID
      //
      // Extracting 'msg' associated with 'opnUsrID'
      //
      tmpMsg = _.filter(msg, { 'user': { 'id': opnUsrID } })[0]
      //
      // Updating the access log (if opening 'Friends' tab)
      //
      if (opnTabNm === 'Friends') tmpMsg['lastAccess']['current_user'] = action.timestamp
      //
      UsersStore.setOpenUserID(opnUsrID)
      MessagesStore.setMessages(msg)
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
export default UsersStore
