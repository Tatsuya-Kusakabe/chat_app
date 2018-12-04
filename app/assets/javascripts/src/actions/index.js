//
// actions/index.js
//
// Importing components
//
import request from 'superagent'
import Dispatcher from '../dispatcher'
import {ActionTypes, APIRoot, CSRFToken} from '../utils'
//
let verb, path, action, dbInfo, storeInfo, timestamp
//
export default {
  //
  // Defining 'getDataFromStore'
  //
  getDataFromStore(path, action) {
    //
    return new Promise((resolve, reject) => {
      //
      // Designating a path, then proceeding next (** Getting data on a server)
      //
      request
      .get(path)
      .end((error, res) => {
        //
        // When successfully accessed (status code: 200)
        //
        if (!error && res.status === 200) {
          //
          // Converting a JavaScript Object Notation (JSON) string into an object
          // ** Writing "console.log(json)" and "console.log(res.text)" visualizes difference
          //
          const json = JSON.parse(res.text)
          //
          // Calling GET_MESSAGES in 'stores/index.js'
          // ** Changing data on 'stores' (locally)
          //
          Dispatcher.handleServerAction({
            type: action,
            json: json,
          })
          //
          resolve(json)
        } else {
          reject(res)
        }
        //
      })
      //
    })
    //
  },
  //
  // Defining 'setDataToStore'
  //
  setDataToStore(path, action, dbInfo, storeInfo) {
    //
    return new Promise((resolve, reject) => {
      //
      // Calling 'path' securely while sending 'dbInfo', then proceeding next
      // (** Sending data on a server)
      //
      // ** 'post' or 'put' available if defined as '[verb]'
      //    https://kuroeveryday.blogspot.com/2016/10/variable-as-function-name.html
      //
      request[verb](path).set('X-CSRF-Token', CSRFToken()).send(dbInfo)
      .end((error, res) => {
        //
        // When successfully accessed (status code: 200)
        //
        if (!error && res.status === 200) {
          //
          // Converting a JavaScript Object Notation (JSON) string into an object
          // ** Writing "console.log(json)" and "console.log(res.text)" visualizes difference
          //
          const json = (res.text) ? JSON.parse(res.text) : ''
          //
          // Calling 'action' in 'stores' (** Changing data on 'stores' locally)
          //
          Dispatcher.handleViewAction(Object.assign({ type: action, json: json }, storeInfo))
        //
        } else {
          reject(res)
        }
        //
      })
      //
    })
    //
  },
  //
  // Connecting from 'changeOpenUserTab(userTab)' in 'components/1_usersTab.js'
  //              to 'UPDATE_OPEN_USER_TAB'       in 'stores/index.js'
  //
  // ** Nothing to 'get' from, or 'post' to the database
  //
  changeOpenUserTab(userTab) {
    //
    Dispatcher.handleViewAction({
      type: ActionTypes.UPDATE_OPEN_USER_TAB,
      name: userTab,
    })
    //
  },
  //
  // Connecting from 'changeOpenContent(cntState)' in 'components/5_userShortProf.js'
  //              to 'UPDATE_OPEN_CONTENT'         in 'stores/users.js'
  //
  // ** Nothing to 'get' from, or 'post' to the database
  //
  changeOpenContent(content) {
    //
    Dispatcher.handleViewAction({
      type: ActionTypes.UPDATE_OPEN_CONTENT,
      name: content,
    })
    //
  },
  //
  // Connecting from 'constructor(props)' in 'components/1_usersTab.js'
  //              to 'GET_FRIENDS'        in 'stores/index.js'
  //              or 'GET_SUGGESTIONS'    in 'stores/index.js'
  //
  getMessages(userTab) {
    //
    path = (userTab === 'Friends') ? 'api/friends' : 'api/suggestions'
    action = (userTab === 'Friends') ? ActionTypes.GET_FRIENDS : ActionTypes.GET_SUGGESTIONS
    //
    this.getDataFromStore(path, action)
    //
  },
  //
  // Connecting from 'updateValue(e)'     in 'components/4_searchBox.js'
  //              to 'SEARCH_FRIENDS'     in 'stores/index.js'
  //              or 'SEARCH_SUGGESTIONS' in 'stores/index.js'
  //
  searchUsers(userTab, name) {
    //
    console.log('actions called!')
    path = (userTab === 'Friends') ? `api/friends/${name}` : `api/suggestions/${name}`
    action = (userTab === 'Friends') ? ActionTypes.SEARCH_FRIENDS : ActionTypes.SEARCH_SUGGESTIONS
    //
    this.getDataFromStore(path, action)
    //
  },
  //
  // Connecting from 'handleKeyDown(e)' in 'components/8_replyBox.js'
  //              to 'SEND_MESSAGE'     in 'stores/index.js'
  //
  sendMessage(userID, message) {
    //
    timestamp = new Date().getTime()
    //
    verb = 'post'
    path = `${APIRoot}/messages`
    action = ActionTypes.SEND_MESSAGE
    dbInfo = { sent_to: userID, contents: message, timestamp: timestamp }
    storeInfo = {}
    //
    this.setDataToStore(path, action, dbInfo, storeInfo)
    //
  },
  //
  // Connecting from 'changeOpenUserID(userID)' in 'components/2_friendsList.js' or ...
  //              to 'UPDATE_OPEN_USER_ID'      in 'stores/users.js'
  //
  changeOpenUserID(userID) {
    //
    timestamp = new Date().getTime()
    //
    // Except 'contents', 'changeOpenUserID' and 'sendMessage' is almost the same
    //
    verb = 'post'
    path = `${APIRoot}/messages`
    action = ActionTypes.UPDATE_OPEN_USER_ID
    dbInfo = { clicked_on: userID, timestamp: timestamp }
    storeInfo = { userID: userID, timestamp: timestamp }
    //
    this.setDataToStore(path, action, dbInfo, storeInfo)
    //
  },
  //
  // Connecting from 'changeFriendship(friendship)' in 'components/6_userProf.js'
  //              to 'UPDATE_FRIENDSHIP'            in 'stores/users.js'
  //
  changeFriendship(friendship, userID) {
    //
    timestamp = new Date().getTime()
    //
    verb = 'put'
    path = `${APIRoot}/users/${userID}`
    action = ActionTypes.UPDATE_FRIENDSHIP
    dbInfo = { frs_state: friendship, id: userID, timestamp: timestamp }
    storeInfo = {}
    //
    this.setDataToStore(path, action, dbInfo, storeInfo)
    //
  },
  //
}
