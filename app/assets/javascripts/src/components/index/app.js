//
// https://www.to-r.net/media/react-tutorial10/
//
import React from 'react'
import MessagesStore from '../../stores/messages'
import UsersStore from '../../stores/users'
// import _ from 'lodash'
import UsersTab from './1_usersTab'
import FriendsList from './2_friendsList'
import SuggestionsList from './3_suggestionsList'
import UsersName from './4_usersName'
import UsersInfo from './5_usersInfo'
import MessagesList from './6_messagesList'
import ReplyBox from './7_replyBox'
//
// Creating a new class 'App'
//
class App extends React.Component {
  //
  constructor(props) {
    //
    // Inheriting props (unmodifiable attributes) from 'React.component'
    //
    super(props)
    this.state = this.initialState
    //
  }
  //
  // Equalizing 'this.initialState' and 'this.getStateFromStore(initial_bln)'
  // ** If you write "get hoge() {return fuga}", 'this.hoge' does 'fuga'
  //
  get initialState() {
    return this.getStateFromStore()
  }
  //
  getStateFromStore() {
    //
    let openUserTab = MessagesStore.getOpenUserTab()
    //
    return {
      //
      // Defining 'messages', 'suggestions', 'currentUserID', 'openUserID' and 'openUserTab'
      //
      openUserTab: openUserTab,
      openContent: UsersStore.getOpenContent(),
      messages: MessagesStore.getMessages(openUserTab),
      currentUserID: UsersStore.getCurrentUserID(),
      openUserID: UsersStore.getOpenUserID(),
      //
    }
    //
  }
  //
  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  // ** 'this.state' won't be changed until 'render'
  // ** https://likealunatic.jp/2015/07/reactjs-setstate
  //
  onStoreChange() {
    console.log("state updated!")
    this.setState(this.getStateFromStore())
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
  // Passing the parent class' 'state' to the child class 'props'
  // ** https://qiita.com/KeitaMoromizato/items/0da6c8e4264b1f206451
  //
  render() {
    console.log(this.state)
    //
    // Defining an object for facilitation
    // ** https://qiita.com/uto-usui/items/a9d17447fe81c17c41fa
    //
    const {openUserTab} = this.state
    //
    // If 'Suggestions' tab is open
    //
    if (this.state.openUserTab === 'Suggestions') {
      //
      // Rendering 'SuggestionsList' and 'UsersInfo'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <SuggestionsList {...this.state} />
            </div>
            <div className='message-box'>
              <UsersName {...this.state} />
              <UsersInfo {...this.state} />
            </div>
          </div>
      )
    //
    // If 'Profile' content is open
    //
    } else if (this.state.openContent === 'Profile') {
      //
      // Rendering 'FriendsList' and 'UsersInfo'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <FriendsList {...this.state} />
            </div>
            <div className='message-box'>
              <UsersName {...this.state} />
              <UsersInfo {...this.state} />
            </div>
          </div>
      )
    //
    // If 'Messages' content is open
    //
    } else {
      //
      // Rendering 'FriendsList', 'MessagesList' and 'ReplyBox'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <FriendsList {...this.state} />
            </div>
            <div className='message-box'>
              <UsersName {...this.state} />
              <MessagesList {...this.state} />
              <ReplyBox />
            </div>
          </div>
      )
      //
    }
    //
  }
  //
}
//
export default App
