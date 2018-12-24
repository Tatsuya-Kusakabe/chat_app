
// https://www.to-r.net/media/react-tutorial10/
import React from 'react'
import _ from 'lodash'
import UserAction from '../../actions/index/users'
import MessageAction from '../../actions/index/messages'
import RelationshipAction from '../../actions/index/relationships'
import UserStore from '../../stores/index/users'
import MessageStore from '../../stores/index/messages'
import RelationshipStore from '../../stores/index/relationships'
import UsersTab from './usersTab'
import FriendsList from './friendsList'
import SuggestionsList from './suggestionsList'
// import SearchBox from './4_searchBox'
// import UserShortProf from './5_userShortProf'
// import UserProf from './6_userProf'
// import MessagesList from './7_messagesList'
// import ReplyBox from './8_replyBox'

// Creating a new class 'App'
class App extends React.Component {

  constructor(props) {
    super(props)
    // ** Do not prepend "return" to objects (in this case, promise objects).
    // ** If so, the constructor will return promise objects, not 'this'...
    this.state = { }
  }

  // Getting data from a database (updating 'state' with event handlers later)
  // ** https://www.valentinog.com/blog/how-async-await-in-react/
  async componentDidMount() {
    // 'currentUserID' is necessary for 'Action' below
    await UserAction.getCurrentUserID()
    const currentUserID = UserStore.getCurrentUserID()
    // Running after 'currentUserID' is set
    UserAction.getFriends(currentUserID)
    UserAction.getSuggestions(currentUserID)
    MessageAction.getLastMessages(currentUserID)
    RelationshipAction.getRelationships(currentUserID)
  }

  getStateFromStore() {
    return {
      openUserTab: UserStore.getOpenUserTab(),
      openContent: UserStore.getOpenContent(),
      currentUserID: UserStore.getCurrentUserID(),
      openUserID: UserStore.getOpenUserID(),
      friends: UserStore.getFriends(),
      suggestions: UserStore.getSuggestions(),
      openMessages: MessageStore.getOpenMessages(),
      lastMessages: MessageStore.getLastMessages(),
      relationships: RelationshipStore.getRelationships(),
    }
  }

  // Updating a state from 'this.getStateFromStore()' to 'this.getStateFromStore()'
  // ** 'this.state' won't be changed until 'render'
  // ** https://likealunatic.jp/2015/07/reactjs-setstate
  onStoreChange() {
    this.setState(this.getStateFromStore())
  }

  // ??
  componentWillMount() {
    UserStore.onChange(this.onStoreChange.bind(this))
    MessageStore.onChange(this.onStoreChange.bind(this))
    RelationshipStore.onChange(this.onStoreChange.bind(this))
  }
  componentWillUnmount() {
    UserStore.offChange(this.onStoreChange.bind(this))
    MessageStore.offChange(this.onStoreChange.bind(this))
    RelationshipStore.offChange(this.onStoreChange.bind(this))
  }

  // Passing the parent class' 'state' to the child class 'props'
  // ** https://qiita.com/KeitaMoromizato/items/0da6c8e4264b1f206451
  render() {
    console.log(this.state)

    // Defining an object for facilitation
    // ** https://qiita.com/uto-usui/items/a9d17447fe81c17c41fa
    const { openUserTab, openContent, currentUserID, openUserID } = this.state

    // If 'Suggestions' tab is open, rendering 'SuggestionsList' and 'UserProf'
    if (openUserTab === 'Suggestions') {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab { ...this.state }/>
              {/*<SearchBox openUserTab={openUserTab} />*/}
              <SuggestionsList { ...this.state }/>
            </div>
            {/*<div className='messages-box'>
              <UserShortProf { ...this.state }/>
              <UserProf { ...this.state }/>
            </div>*/}
          </div>
      )

    // Else if 'Profile' content is open, rendering 'FriendsList' and 'UserProf'
    } else if (openContent === 'Profile') {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab { ...this.state }/>
              {/*<SearchBox openUserTab={openUserTab} />*/}
              <FriendsList { ...this.state }/>
            </div>
            {/*<div className='messages-box'>
              <UserShortProf { ...this.state }/>
              <UserProf { ...this.state }/>
            </div>*/}
          </div>
      )

    // Else if 'openUserID' is defined as 'none', rendering 'FriendsList' and 'MessagesList'
    } else if (_.isString(openUserID)) {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab { ...this.state }/>
              {/*<SearchBox openUserTab={openUserTab} />*/}
              <FriendsList { ...this.state }/>
            </div>
            {/*<div className='messages-box'>
              <UserShortProf { ...this.state }/>
              <MessagesList { ...this.state }/>
            </div>*/}
          </div>
      )

    // Else, rendering 'FriendsList', 'MessagesList' and 'ReplyBox'
    } else {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab { ...this.state }/>
              {/*<SearchBox openUserTab={openUserTab}/>*/}
              <FriendsList { ...this.state }/>
            </div>
            {/*<div className='messages-box'>
              <UserShortProf { ...this.state }/>
              <MessagesList { ...this.state }/>
              <ReplyBox { ...this.state }/>
            </div>*/}
          </div>
      )

    }
  }

}

export default App
