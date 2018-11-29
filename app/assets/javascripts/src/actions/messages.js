//
// actions/messages.js
//
// Importing components
//
import request from 'superagent'
import Dispatcher from '../dispatcher'
import {ActionTypes, APIEndpoints, CSRFToken} from '../utils'
//
let path, action, openUserTab
//
export default {
  //
  // Connecting from 'changeOpenTabName(name)' in 'components/usersTab.js'
  //              to 'UPDATE_OPEN_TAB_NAME'    in 'stores/messages.js'
  //
  changeOpenTabName(newTabName) {
    //
    Dispatcher.handleViewAction({
      type: ActionTypes.UPDATE_OPEN_TAB_NAME,
      name: newTabName,
    })
    //
  },
  //
  // Connecting from 'constructor(props)' in 'components/messagesBox.js'
  //              to 'GET_MESSAGES'       in 'stores/messages.js'
  //
  getMessages() {
    this.getDataFromStore(path = 'api/friends', action = ActionTypes.GET_MESSAGES)
  },
  //
  // Connecting from 'constructor(props)' in 'components/_suggestionsList.js'
  //              to 'GET_SUGGESTIONS'    in 'stores/messages.js'
  //
  getSuggestions() {
    this.getDataFromStore(path = 'api/suggestions', action = ActionTypes.GET_SUGGESTIONS)
  },
  //
  // Defining 'getDataFromStore'
  //
  getDataFromStore(path, action) {
    //
    return new Promise((resolve, reject) => {
      //
      // Designating a path, then proceeding next
      // ** Getting data on a server
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
          // ** Changing data on 'stores/messages' (locally)
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
      })
    })
  },
  //
  // Connecting from 'handleKeyDown(e)' in 'components/replyBox.js'
  //              to 'SEND_MESSAGE'     in 'stores/messages.js'
  //
  sendMessage(userID, message) {
    //
    return new Promise((resolve, reject) => {
      //
      // Defining a timestamp
      //
      const timestamp = new Date().getTime()
      //
      // Exerting 'api/messages#create' securely
      // by posting information in '.send({})',
      // then proceeding next
      // ** Posting data on a server
      //
      request
      .post(`${APIEndpoints.CREATE}`)
      .set('X-CSRF-Token', CSRFToken())
      .send({sent_to: userID, timestamp: timestamp, contents: message})
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
          // Calling SEND_MESSAGE in 'stores/messages.js'
          // ** Changing data on 'stores/messages' (locally)
          //
          Dispatcher.handleViewAction({
            type: ActionTypes.SEND_MESSAGE,
            userID: userID,
            message: message,
            timestamp: timestamp,
            json: json,
          })
        //
        } else {
          reject(res)
        }
      })
    })
  },
  //
  // Connecting from 'changeOpenUserID(id)'  in 'components/friendsList.js'
  //              to 'UPDATE_OPEN_USER_ID'   in 'stores/messages.js'
  //
  changeOpenUserID(newUserID) {
    //
    return new Promise((resolve, reject) => {
      //
      // Defining a timestamp
      //
      const timestamp = new Date().getTime()
      //
      // Exerting 'api/messages#create' securely
      // by posting information in '.send({})',
      // then proceeding next
      // ** Posting data on a server
      //
      request
      .post(`${APIEndpoints.CREATE}`)
      .set('X-CSRF-Token', CSRFToken())
      .send({clicked_on: newUserID, timestamp: timestamp})
      .end((error, res) => {
        //
        // When successfully accessed (status code: 200)
        //
        if (!error && res.status === 200) {
          //
          // Calling UPDATE_OPEN_USER_ID in 'stores/messages.js'
          // ** Changing data on 'stores/messages' (locally)
          //
          Dispatcher.handleViewAction({
            type: ActionTypes.UPDATE_OPEN_USER_ID,
            userID: newUserID,
          })
        //
        } else {
          reject(res)
        }
      })
    })
  },
  //
}
