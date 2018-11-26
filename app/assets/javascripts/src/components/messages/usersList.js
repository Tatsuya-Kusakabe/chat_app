//
// components/usersList.js
//
// Importing components
//
import React from 'react'
import classNames from 'classnames'
// import Utils from '../../utils'
import MessagesAction from '../../actions/messages'
import MessagesStore from '../../stores/messages'
import FriendsList from '../../components/messages/friendsList'
//
// Creating a new class 'usersList'
//
class UsersList extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props  (modifiable   values) from 'React.component'
    // Inheriting states (unmodifiable values) as   'this.getStateFromStore()'
    //
    super(props)
    this.state = this.initialState
    //
  }
  //
  // Equalizing 'this.initialState' and 'this.getStateFromStore(init)'
  // ** If you write "get hoge() {return fuga}", this.hoge does fuga
  //
  get initialState() {
    const initial = true
    return this.getStateFromStore(initial)
  }
  //
  getStateFromStore(initial) {
    //
    // Defining 'OpenTabName'
    //
    let openTabName = MessagesStore.getOpenTabName(initial)
    //
    // Returning 'OpenTabName' and 'tabName'
    //
    return { openTabName: openTabName, tabName: ['Friends', 'Suggestions'] }
    //
  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  //
  onStoreChange() {
    this.setState(this.getStateFromStore())
  }
  //
  // When a tab (friends or suggestions) is clicked, changing a tab displayed
  //
  changeOpenTabName(name) {
    MessagesAction.changeOpenTabName(name)
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
    //
    // Creating each 'users-tab' item from 'this.state.tabName'
    //
    const messages = this.state.tabName.map((message, index) => {
      //
      // Defining 'item_classes' for each message icon
      //
      const itemClasses = classNames({
        'clear': true,
        'users-tab__item': true,
        'users-tab__item--active': this.state.openTabName === message,
      })
      //
      // Returning each 'users-tab' item
      //
      return (
        //
        // When a tab is clicked, returning 'changeOpenTabName(message)'
        //
        <li
          onClick={ this.changeOpenTabName.bind(this, message) }
          className={ itemClasses }
          key={ message }
        >
          { message }
        </li>
      )
    })
    //
    switch(this.state.openTabName) {
      //
      // If 'Friends' tab is open
      //
      case 'Friends':
        //
        // Returning 'FriendsList'
        //
        return (
          <div className='users-list'>
            <ul className='users-tab__list'>
              { messages }
            </ul>
            <FriendsList />
          </div>
        )
        //
        break
      //
      // If 'Suggestions' tab is open
      //
      case 'Suggestions':
        //
        // Returning 'SuggestionsList'
        //
        return (
          <div className='users-list'>
            <ul className='users-tab__list'>
              { messages }
            </ul>
            <SuggestionsList />
          </div>
        )
        //
        break
    }
    //
  }
  //
}

export default UsersList
