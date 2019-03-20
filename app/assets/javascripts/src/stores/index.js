//
// stores/index.js
//
// Importing components
//
import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import {ActionTypes} from '../utils'
import _ from 'lodash'
//
// Designating temporary 'openUserTab' and 'openContent'
//
const openUserTab = 'Friends'
const openContent = 'Messages'
//
// Designating temporary 'messages'
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
// Designating temporary 'currentUserID' and 'openUserID'
//
const currentUserID = 1
const openUserID = 2
//
// Creating a new class 'IndexBaseStore'
//
class IndexBaseStore extends BaseStore {
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
  // Getting an object associated with each 'key'
  //
  getOpenUserTab() {
    return this.getProperties(openUserTab, 'open_user_tab')
  }
  //
  getOpenContent() {
    return this.getProperties(openContent, 'open_content')
  }
  //
  getMessages() {
    return this.getProperties(messages, 'messages')
  }
  //
  getCurrentUserID() {
    return this.getProperties(currentUserID, 'current_user_id')
  }
  //
  getOpenUserID() {
    return this.getProperties(openUserID, 'open_user_id')
  }
  //
  // Setting an object associated with each 'key'
  //
  setOpenUserTab(tmpOpnTab) {
    this.setProperties(tmpOpnTab, 'open_user_tab')
  }
  //
  setOpenContent(tmpOpnCnt) {
    this.setProperties(tmpOpnCnt, 'open_content')
  }
  //
  setMessages(msg) {
    this.setProperties(msg, 'messages')
  }
  //
  setCurrentUserID(crtUsrID) {
    this.setProperties(crtUsrID, 'current_user_id')
  }
  //
  setOpenUserID(tmpOpnUsrID) {
    this.setProperties(tmpOpnUsrID, 'open_user_id')
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
// Creating a new instance 'IndexStore' from 'IndexBaseStore'
//
const IndexStore = new IndexBaseStore()
//
IndexStore.dispatchToken = Dispatcher.register(payload => {
  //
  const action = payload.action
  let opnUsrTab, tmpMsg, msg, opnUsrID, crtUsrID
  //
  switch (action.type) {
    //
    // When called from 'changeOpenUserTab(userTab)' in 'components/1_usersTab.js'
    //
    case ActionTypes.UPDATE_OPEN_USER_TAB:
      //
      // Calling setters
      //
      IndexStore.setOpenUserTab(action.name)
      //
      // ** 'emitChange()' is skipped because this action is
      //    always followed by 'GET_FRIENDS' or 'GET_SUGGESTIONS'
      //
      break
    //
    // When called from 'changeOpenContent(content)' in 'components/5_userShortProf.js'
    //
    case ActionTypes.UPDATE_OPEN_CONTENT:
      //
      // Calling setters
      //
      IndexStore.setOpenContent(action.name)
      //
      // ** 'emitChange()' is necessary to activate 'onStoreChange()' in 'components'
      //
      IndexStore.emitChange()
      break
    //
    // When called from 'constructor(props)' in 'components/1_usersTab.js'
    //               or 'updateValue(e)'     in 'components/44_searchBox.js'
    //
    case ActionTypes.GET_FRIENDS:
    case ActionTypes.GET_SUGGESTIONS:
    //
    case ActionTypes.SEARCH_FRIENDS:
    case ActionTypes.SEARCH_SUGGESTIONS:
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
      IndexStore.setCurrentUserID(crtUsrID)
      IndexStore.setOpenUserID(opnUsrID)
      IndexStore.setMessages(msg)
      //
      IndexStore.emitChange()
      break
    //
    // When called from 'sendMessage(e)'               in 'components/8_replyBox.js'
    //          or from 'sendPicture(e)'               in 'components/8_replyBox.js'
    //          or from 'changeFriendship(friendship)' in 'components/6_userProf.js'
    //
    case ActionTypes.SEND_MESSAGE:
    case ActionTypes.SEND_PICTURE:
      //
      // ** 'emitChange()' is skipped because these actions are
      //    always followed by 'GET_FRIENDS' or 'GET_SUGGESTIONS'
      //
      break
    //
    // When called from 'changeOpenUserID(id)' in 'components/2_friendsList.js' or ...
    //
    case ActionTypes.UPDATE_OPEN_USER_ID:
      //
      // Getting 'msg', 'opnUsrID', and 'opnUsrTab'
      //
      msg = IndexStore.getMessages()
      opnUsrID = action.userID
      opnUsrTab = IndexStore.getOpenUserTab()
      //
      // Extracting 'msg' associated with 'opnUsrID'
      //
      tmpMsg = _.filter(msg, { 'user': { 'id': opnUsrID } })[0]
      //
      // Updating the access log (if opening 'Friends' tab)
      //
      if (opnUsrTab === 'Friends') tmpMsg['lastAccess']['current_user'] = action.timestamp
      //
      IndexStore.setOpenUserID(opnUsrID)
      IndexStore.setMessages(msg)
      //
      IndexStore.emitChange()
      break
    //
    // When called from 'changeFriendship(friendship)' in 'components/6_userProf.js'
    //
    case ActionTypes.UPDATE_FRIENDSHIP:
      //
      // ** 'emitChange()' is skipped because this action is
      //    always followed by 'GET_FRIENDS' of 'GET_SUGGESTIONS'
      //
      break
    //
  }
  //
  return true
  //
})
//
export default IndexStore
