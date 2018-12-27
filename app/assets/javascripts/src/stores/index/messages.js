
// Importing components
import Dispatcher from '../../dispatcher'
import BaseStore from '../../base/store'
import { ActionTypes } from '../../utils'
// import _ from 'lodash'

// Defining getters and setters
class MessageBaseStore extends BaseStore {

  getLastMessages() {
    // If 'key' is not associated yet, associating 'key' with 'init_obj'
    // ** Without 'If', calling 'this.set(hoge, fuga)' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    if (!this.get('last_messages')) this.setLastMessages([])

    // Returning an object associated with 'key'
    return this.get('last_messages')
  }

  setLastMessages(lastMessages) {
    this.set('last_messages', lastMessages)
  }

  getOpenMessages() {
    if (!this.get('open_messages')) this.setOpenMessages([])
    return this.get('open_messages')
  }

  setOpenMessages(openMessages) {
    this.set('open_messages', openMessages)
  }

  addChangeListener(callback) {
    this.on('change', callback)
  }

  removeChangeListener(callback) {
    this.off('change', callback)
  }

}

// Creating a new instance 'MessageStore' from 'MessageBaseStore'
const MessageStore = new MessageBaseStore()

// Defining a new 'dispatchToken' associated with 'MessageStore'
MessageStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action

  switch (action.type) {
    case ActionTypes.GET_LAST_MESSAGES:
      MessageStore.setLastMessages(action.json)
      MessageStore.emitChange()
      break

    case ActionTypes.GET_OPEN_MESSAGES:
      MessageStore.setOpenMessages(action.json)
      MessageStore.emitChange()
      break
  }

  return true
})

export default MessageStore
