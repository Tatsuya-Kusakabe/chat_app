
// Importing components
import Dispatcher from '../../dispatcher'
import BaseStore from '../../base/store'
import { ActionTypes } from '../../utils'
// import _ from 'lodash'

// Defining getters and setters
class RelationshipBaseStore extends BaseStore {

  getRelationships() {
    // If 'key' is not associated yet, associating 'key' with 'init_obj'
    // ** Without 'If', calling 'this.set(hoge, fuga)' endlessly
    // ** http://www.sumimasen.com/tech/47146106.html
    if (!this.get('relationships')) this.setRelationships([])

    // Returning an object associated with 'key'
    return this.get('relationships')
  }

  setRelationships(relationships) {
    this.set('relationships', relationships)
  }

  getOpenRelationship() {
    if (!this.get('open_relationship')) this.setOpenRelationship([])
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

// Defining a new 'dispatchToken' associated with 'RelationshipStore'
RelationshipStore.dispatchToken = Dispatcher.register(payload => {
  const action = payload.action

  switch (action.type) {
    case ActionTypes.GET_RELATIONSHIPS:
      RelationshipStore.setRelationships(action.json)
      RelationshipStore.emitChange()
      break
  }

  return true
})

export default RelationshipStore
