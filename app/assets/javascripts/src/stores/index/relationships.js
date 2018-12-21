
// stores/index/relationships.js

import Dispatcher from '../dispatcher'
import BaseStore from '../base/store'
import { ActionTypes } from '../utils'
import _ from 'lodash'

class RelationshipBaseStore extends BaseStore {

  getRelationships() {

    const initRelationships = [{ "0": {
      id: null, applicant_id: null, recipient_id: null,
      timestamp_applicant: null, timestamp_recipient: null
    } }]

    // If 'key' is not associated yet, associating 'key' with 'init_obj'
    // ** Without 'If', calling 'this.set(hoge, fuga)' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    if (!this.get('relationships')) this.setRelationships(initRelationships)

    // Returning an object associated with 'key'
    return this.get('relationships')

  }

  setRelationships(relationships) {
    this.set('relationships', relationships)
  }

  getOpenRelationship() {

    const initOpenRelationship = {
      id: null, applicant_id: null, recipient_id: null,
      timestamp_applicant: null, timestamp_recipient: null
    }

    if (!this.get('open_relationship')) this.setOpenRelationship(initOpenRelationship)
    return this.get('open_relationship')

  }

  setOpenRelationship(openRelationship) {
    this.set('open_relationship', openRelationship)
  }

  addChangeListener(callback) {
    this.on('change', callback)
  }

  removeChangeListener(callback) {
    this.off('change', callback)
  }

}

// Creating a new instance 'RelationshipStore' from 'RelationshipBaseStore'
const RelationshipStore = new RelationshipBaseStore()
