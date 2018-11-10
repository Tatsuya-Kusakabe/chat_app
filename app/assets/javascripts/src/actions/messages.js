// actions/messages.js

import request       from 'superagent'
import Dispatcher    from '../dispatcher'
import {ActionTypes} from '../constants/app'
// import {ActionTypes, APIEndpoints, CSRFToken} from '../constants/app'

export default {
  // when clicked in a view file,
  // executing "updateOpenChatID" in "stores/messages.js"
  changeOpenChat(newUserID) {
    Dispatcher.handleViewAction({
      type: ActionTypes.UPDATE_OPEN_CHAT_ID,
      userID: newUserID,
    })
  },
  // when pressing Enter in "replyBox.js",
  // executing "sendMessage" in "stores/messages.js"
  sendMessage(userID, message) {
    Dispatcher.handleViewAction({
      type: ActionTypes.SEND_MESSAGE,
      userID: userID,
      message: message,
      timestamp: +new Date(),
    })
  },
  // get
  getMessages() {
    //
    // Creating a new 'Promise' instance
    //
    return new Promise((resolve, reject) => {
      //
      // Exerting 'messages#index', then proceeding next
      //
      request
      .get('/api/messages')
      .end((error, res) => {
        //
        // When successfully accessed (status code: 200)
        // Calling GET_MESSAGES from 'stores/messages'
        //
        if (!error && res.status === 200) {
          const json = JSON.parse(res.text)
          Dispatcher.handleServerAction({
            type: ActionTypes.GET_MESSAGES,
            json: json,
          })
          resolve(json)
        } else {
          reject(res)
        }
      })
    })
  },
}
