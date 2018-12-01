//
// actions/messages.js
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
          // Calling GET_MESSAGES in 'stores/messages.js'
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
  // Connecting from 'changeOpenUserTab(userTab)' in 'components/1_usersTab.js'
  //              to 'UPDATE_OPEN_TAB_NAME'          in 'stores/messages.js'
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
  // Connecting from 'handleKeyDown(e)' in 'components/7_replyBox.js'
  //              to 'SEND_MESSAGE'     in 'stores/messages.js'
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
  // Connecting from 'constructor(props)' in 'components/1_usersTab.js'
  //              to 'GET_FRIENDS'        in 'stores/messages.js'
  //              or 'GET_SUGGESTIONS'    in 'stores/messages.js'
  //
  getMessages(openUserTab) {
    //
    path = (openUserTab === 'Friends') ? 'api/friends' : 'api/suggestions'
    action = (openUserTab === 'Friends') ? ActionTypes.GET_FRIENDS : ActionTypes.GET_SUGGESTIONS
    //
    this.getDataFromStore(path, action)
    //
  },
  //
}
