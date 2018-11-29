//
// components/suggestionsList.js
//
// ** The class extention from 'usersList.js' to 'suggestionsList' and 'suggestionsList'
//    are avoided, because most of the similarities are deep inside the loop
//
// Importing components
//
import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import Utils from '../../utils'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
//
let initial_bln
//
// Creating a new class 'SuggestionsList'
//
class SuggestionsList extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    this.state = this.initialState
    //
    // Calling getSuggestions() from 'actions/messages'
    // While calling, proceeding next
    // ** Do not prepend "return" to objects (in this case, promise objects).
    // ** If so, the constructor will return promise objects, not 'this'...
    //
    MessagesAction.getSuggestions()
    //
  }
  //
  // Equalizing 'this.initialState' and 'this.getStateFromStore(initial)'
  // ** If you write "get hoge() {return fuga}", this.hoge does fuga
  //
  get initialState() {
    return this.getStateFromStore(initial_bln = true)
  }
  //
  getStateFromStore(initial_bln) {
    //
    // Defining 'currentUserID', 'openUserID' and 'messages'
    // ** If calling 'this.getStateFromStore(initial)', defining 'get...(initial)'
    // ** If calling 'this.getStateFromStore()',        defining 'get...()'
    //
    let currentUserID = MessagesStore.getCurrentUserID(initial_bln)
    let openUserID = MessagesStore.getOpenUserID(initial_bln)
    let suggestions = MessagesStore.getSuggestions(initial_bln)
    //
    // If 'suggestions' has no information, returning 'currentUserID' only
    //
    if (!Object.keys(suggestions).length) {
      return {　currentUserID: currentUserID, openUserID: null, usersList: null }
    }
    //
    // If not, getting details on the users as 'usersList'
    //
    const usersList = []
    _.each(suggestions, (suggestion) => {
      usersList.push({ user: suggestion.user })
    })
    //
    // Returning 'currentUserID', 'openUserID' and 'usersList'
    //
    return { currentUserID: currentUserID, openUserID: openUserID, usersList: usersList }
  //
  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  //
  onStoreChange() {
    console.log("set state suggestions")
    this.setState(this.getStateFromStore())
  }
  //
  // When an account is clicked, changing chats displayed
  //
  changeOpenUserID(id) {
    MessagesAction.changeOpenUserID(id)
  }
  //
  // ??
  //
  componentWillMount() {
    MessagesStore.onChange(this.onStoreChange.bind(this))
  }
  componentWillUnmount() {
    MessagesStore.offChange(this.onStoreChange.bind(this))
  }
  //
  // Rendering results
  //
  render() {
    console.log("render suggestions")
    //
    switch (true) {
      //
      // When 'current_user' has no suggestions, displaying 'No messages'
      // ** 'return' ends 'switch (true)', so 'break' is not necessary
      //
      case (!this.state.openUserID):
        //
        return (
            <div className='suggestions-list'>
              <div className='suggestions-list__list suggestions-list__list__empty'>
                No suggestions
              </div>
            </div>
        )
      //
      // When 'current_user' has any messages
      //
      default:
        //
        // Creating each 'suggestions-list' item from 'this.state.usersList'
        //
        const messages = this.state.usersList.map((message, index) => {
          //
          // Defining 'item_classes' for each message icon
          //
          const itemClasses = classNames({
            'clear': true,
            'suggestions-list__item': true,
            'suggestions-list__item--active': this.state.openUserID === message.user.id,
          })
          //
          // Returning each 'suggestions-list' item
          //
          return (
            //
            // When an account is clicked, returning 'changeOpenUserID(message.user.id)'
            //
            <li
              onClick={ this.changeOpenUserID.bind(this, message.user.id) }
              className={ itemClasses }
              key={ message.user.id }
            >
              <div className='suggestions-list__item__picture'>
                <img src={ message.user.profile_picture } />
              </div>
              <div className='suggestions-list__item__details'>
                <h4 className='suggestions-list__item__name'>
                  { message.user.name }
                </h4>
                {/*
                <span className='suggestions-list__item__message'>
                  { statusIcon } { message.lastMessage.contents }
                </span>
                */}
              </div>
            </li>
          )
        }, this)
        //
        // Returning 'messages'
        //
        return (
          <ul className='suggestions-list__list'>
            { messages }
          </ul>
        )
      //
    }
  }
}

export default SuggestionsList
