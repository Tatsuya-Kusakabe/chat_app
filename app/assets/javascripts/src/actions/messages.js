// actions/messages.js

import request from 'superagent'
import UserStore from '../stores/user'
import Dispatcher from '../dispatcher'
import {ActionTypes, APIEndpoints, CSRFToken} from '../constants/app'

export default {
  //
  // Connecting from 'constructor(props)' in 'components/messageBox.js'
  //              to 'GET_MESSAGES'       in 'stores/messages.js'
  //
  getMessages() {
    return new Promise((resolve, reject) => {
      //
      // Exerting 'api/messages#index', then proceeding next
      // ** Getting data on a server
      //
      request
      .get('/api/messages')
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
          // Calling GET_MESSAGES from 'stores/messages'
          // ** Changing data on 'stores/messages' (locally)
          //
          Dispatcher.handleServerAction({
            type: ActionTypes.GET_MESSAGES,
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
      .send({user_id: userID, timestamp: timestamp})
      .send({from: UserStore.user.id, contents: message})
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
          // Calling SEND_MESSAGE from 'stores/messages'
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
  // Connecting from 'changeOpenChat(id)'  in 'components/userList.js'
  //              to 'UPDATE_OPEN_CHAT_ID' in 'stores/messages.js'
  //
  changeOpenChat(newUserID) {
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
      .send({user_id: newUserID, timestamp: timestamp})
      .end((error, res) => {
        //
        // When successfully accessed (status code: 200)
        //
        if (!error && res.status === 200) {
          //
          // Calling UPDATE_OPEN_CHAT_ID from 'stores/messages'
          // ** Changing data on 'stores/messages' (locally)
          //
          Dispatcher.handleViewAction({
            type: ActionTypes.UPDATE_OPEN_CHAT_ID,
            userID: newUserID,
          })
        //
        } else {
          reject(res)
        }
      })
    })
  },
}
