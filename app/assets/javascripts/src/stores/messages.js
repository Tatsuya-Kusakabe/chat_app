// stores/messages.js

import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import UserStore from '../stores/user'
import {ActionTypes} from '../constants/app'

const messages = {
  2: {
    user: {
      profilePicture: 'https://avatars0.githubusercontent.com/u/7922109?v=3&s=460',
      id: 2,
      name: 'Ryan Clark',
      status: 'online',
    },
    lastAccess: {
      recipient: 1424469794050,
      currentUser: 1424469794080,
    },
    messages: [
      {
        contents: 'Hey!',
        from: 2,
        timestamp: 1424469793023,
      },
      {
        contents: 'Hey, what\'s up?',
        from: 1,
        timestamp: 1424469794000,
      },
    ],
  },
  3: {
    user: {
      read: true,
      profilePicture: 'https://avatars3.githubusercontent.com/u/2955483?v=3&s=460',
      name: 'Jilles Soeters',
      id: 3,
      status: 'online',
    },
    lastAccess: {
      recipient: 1424352522000,
      currentUser: 1424352522080,
    },
    messages: [
      {
        contents: 'Want a game of ping pong?',
        from: 3,
        timestamp: 1424352522000,
      },
    ],
  },
  4: {
    user: {
      name: 'Todd Motto',
      id: 4,
      profilePicture: 'https://avatars1.githubusercontent.com/u/1655968?v=3&s=460',
      status: 'online',
    },
    lastAccess: {
      recipient: 1424423579000,
      currentUser: 1424423574000,
    },
    messages: [
      {
        contents: 'Please follow me on twitter I\'ll pay you',
        timestamp: 1424423579000,
        from: 4,
      },
    ],
  },
}

//
// Designating a temporary openChatID   to '2'
// ** Object.keys(messages), which is [2, 3, 4], is an array of keys in 'messages'
//
var openChatID = parseInt(Object.keys(messages)[0], 10)

class ChatStore extends BaseStore {
  addChangeListener(callback) {
    this.on('change', callback)
  }
  removeChangeListener(callback) {
    this.off('change', callback)
  }
  getOpenChatUserID() {
    return openChatID
  }
  //
  // 1. Associating the key "messages" with a blank
  // 2. Associating the key "messages" with 'messages'
  // 3. Returning 'messages' or 'messages[openChatID]'
  // ** If defined as 'setMessages(messages)', 'messages' is overwritten, which should be avoided
  //
  getMessages(tmpID) {
    //
    // If 'setMessages()' not defined yet, associating the key "messages" with a blank
    // If called as 'getMessages()',       returning 'messages'
    // If called as 'getMessages(tmpID)',  returning 'messages[tmpID]'
    //
    if (!this.get("messages")) this.setMessages([])
    if (tmpID == null) return this.get("messages")
    return this.get("messages")[tmpID]
  }
  setMessages(tmpMsg) {
    var tmpMsg = messages
    this.set("messages", tmpMsg)
  }
}

//
// Creating a new instance from ChatStore
//
const MessagesStore = new ChatStore()

MessagesStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action

  switch (action.type) {
    case ActionTypes.UPDATE_OPEN_CHAT_ID:
      //
      // When an account is clicked, updating openChatID,
      // redefining messages to display, calling setMessages(),
      // and updating 'last access' status
      //
      openChatID   = payload.action.userID
      const tmpMsg = messages[openChatID]
      MessagesStore.setMessages(tmpMsg)
      tmpMsg.lastAccess.currentUser = +new Date()
      //
      MessagesStore.emitChange()
      break

    case ActionTypes.SEND_MESSAGE:
      const userID = action.userID
      messages[userID].messages.push({
        contents: action.message,
        timestamp: action.timestamp,
        from: UserStore.user.id,
      })
      messages[userID].lastAccess.currentUser = +new Date()
      MessagesStore.emitChange()
      break

    case ActionTypes.GET_MESSAGES:
      // openMessages = messages[openChatID]
      // MessagesStore.setMessages(openMessages)
      console.log()
      MessagesStore.emitChange()
      break
  }

  return true
})

export default MessagesStore
