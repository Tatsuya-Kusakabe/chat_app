//
// https://www.to-r.net/media/react-tutorial10/
//
import React from 'react'
import MessagesStore from '../../stores/messages'
import _ from 'lodash'
import UsersTab from './1_usersTab'
import FriendsList from './2_friendsList'
import SuggestionsList from './3_suggestionsList'
import UsersInfo from './usersInfo'
import MessagesList from './messagesList'
import ReplyBox from './replyBox'
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
    return {
      //
      // Defining 'messages', 'suggestions', 'currentUserID', 'openUserID' and 'openUserTab'
      //
      openUserTab: MessagesStore.getOpenUserTab(),
      messages: MessagesStore.getMessages(),
      suggestions: MessagesStore.getSuggestions(),
      currentUserID: MessagesStore.getCurrentUserID(),
      openUserID: MessagesStore.getOpenUserID(),
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
    console.log('state changed')
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
    //
    // Defining an object for facilitation
    // ** https://qiita.com/uto-usui/items/a9d17447fe81c17c41fa
    //
    const {openUserTab} = this.state
    //
    // If 'Suggestions' tab is open and 'current_user' has any friends
    //
    if (openUserTab === 'Suggestions') {
      //
      // Rendering 'MessagesList' and 'ReplyBox'
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <SuggestionsList {...this.state} />
            </div>
            <div className='message-box'>
              <UsersInfo {...this.state} />
            </div>
          </div>
      )
      //
    // (_.isNumber(this.state.openUserID)
    } else {
      //
      // Else, ...
      //
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab={openUserTab} />
              <FriendsList {...this.state} />
            </div>
            <div className='message-box'>
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
