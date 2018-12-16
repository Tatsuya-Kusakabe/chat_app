
// stores/index/messages.js

import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import { ActionTypes } from '../utils'
import _ from 'lodash'

class MessageBaseStore extends BaseStore {

  getMessages() {

    const initMessages = [{ "2": [{
      id: 1, sent_from: 2, sent_to: 1, contents: 'Hey!', timestamp: null
    }] }]

    // If 'key' is not associated yet, associating 'key' with 'init_obj'
    // ** Without 'If', calling 'this.set(hoge, fuga)' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    if (!this.get('messages')) this.setMessages(initMessages)

    // Returning an object associated with 'key'
    return this.get('messages')

  }

  setMessages(messages) {
    this.set('messages', messages)
  }

  getOpenMessages() {

    const initOpenMessages = [{
      id: 1, sent_from: 2, sent_to: 1, contents: 'Hey!', timestamp: null
    }]

    if (!this.get('open_messages')) this.setOpenMessages(initOpenMessages)
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
