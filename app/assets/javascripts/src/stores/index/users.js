
// stores/index/users.js

import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import { ActionTypes } from '../utils'
import _ from 'lodash'

class UserBaseStore extends BaseStore {

  getFriends() {

    const initFriends = [{
      id: null, name: '', profile_picture: '', profile_comment: '',
      status: null, read: null, email: ''
    }]

    // If 'key' is not associated yet, associating 'key' with 'init_obj'
    // ** Without 'If', calling 'this.set(hoge, fuga)' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    if (!this.get('friends')) this.setFriends(initFriends)

    // Returning an object associated with 'key'
    return this.get('friends')

  }

  setFriends(friends) {
    this.set('friends', friends)
  }

  getSuggestions() {

    const initSuggestions = [{
      id: null, name: '', profile_picture: '', profile_comment: '',
      status: null, read: null, email: ''
    }]

    if (!this.get('suggestions')) this.setSuggestions(initSuggestions)
    return this.get('suggestions')

  }

  setSuggestions(suggestions) {
    this.set('suggestions', suggestions)
  }

  getOpenUserTab() {
    if (!this.get('open_user_tab')) this.setOpenUserTab("Friends")
    return this.get('open_user_tab')
  }

  setOpenUserTab(openUserTab) {
    this.set('open_user_tab', openUserTab)
  }

  getOpenContent() {
    if (!this.get('open_content')) this.setOpenContent("Messages")
    return this.get('open_content')
  }

  setOpenContent(openContent) {
    this.set('open_content', openContent)
  }

  getOpenUserID() {
    if (!this.get('open_user_id')) this.setOpenUserID(null)
    return this.get('open_user_id')
  }

  setOpenUserID(openUserID) {
    this.set('open_user_id', openUserID)
  }

  getCurrentUserID() {
    if (!this.get('current_user_id')) this.setCurrentUserID(null)
    return this.get('current_user_id')
  }

  setCurrentUserID(currentUserID) {
    this.set('current_user_id', currentUserID)
  }

  addChangeListener(callback) {
    this.on('change', callback)
  }

  removeChangeListener(callback) {
    this.off('change', callback)
  }

}

// Creating a new instance 'UserStore' from 'UserBaseStore'
const UserStore = new UserBaseStore()
