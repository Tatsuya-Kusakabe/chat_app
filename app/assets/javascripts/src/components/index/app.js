
// https://www.to-r.net/media/react-tutorial10/
import React from 'react'
import UserAction from '../../actions/index/users'
import MessageAction from '../../actions/index/messages'
import RelationshipAction from '../../actions/index/relationships'
import UserStore from '../../stores/index/users'
import MessageStore from '../../stores/index/messages'
import RelationshipStore from '../../stores/index/relationships'
import UsersTab from './usersTab'
import FriendsList from './friendsList'
import SuggestionsList from './suggestionsList'
import SearchBox from './searchBox'
import UserShortProf from './userShortProf'
import UserProf from './userProf'
import MessagesList from './messagesList'
import ReplyBox from './replyBox'

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
    await UserAction.fetchCurrentUserID()
    // Running after 'currentUserID' is set
    UserAction.fetchFriends()
    UserAction.fetchSuggestions()
    MessageAction.fetchLastMessages()
    RelationshipAction.fetchRelationships()
  }

  getStateFromStore() {
    return {
      openUserTab: UserStore.getOpenUserTab(),
      openContent: UserStore.getOpenContent(),
      currentUserID: UserStore.getCurrentUserID(),
      openUserID: UserStore.getOpenUserID(),
      friends: UserStore.getFriends(),
      suggestions: UserStore.getSuggestions(),
      searchText: UserStore.getSearchText(),
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

  onChangeBind() {
    return this.onStoreChange.bind(this)
  }

  // ??
  componentWillMount() {
    UserStore.onChange(this.onChangeBind())
    MessageStore.onChange(this.onChangeBind())
    RelationshipStore.onChange(this.onChangeBind())
  }
  componentWillUnmount() {
    UserStore.offChange(this.onChangeBind())
    MessageStore.offChange(this.onChangeBind())
    RelationshipStore.offChange(this.onChangeBind())
  }

  // Passing the parent class' 'state' to the child class 'props'
  // ** https://qiita.com/KeitaMoromizato/items/0da6c8e4264b1f206451
  render() {
    // Defining an object for facilitation
    // ** https://qiita.com/uto-usui/items/a9d17447fe81c17c41fa
    const {
      openUserTab, openContent, currentUserID, openUserID,
      friends, suggestions, openMessages, lastMessages, relationships,
    } = this.state

    // If 'Suggestions' tab is open, rendering 'SuggestionsList' and 'UserProf'
    if (openUserTab === 'Suggestions') {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab = { openUserTab }/>
              <SearchBox openUserTab = { openUserTab }/>
              <SuggestionsList
                currentUserID = { currentUserID }
                openUserID = { openUserID }
                suggestions = { suggestions }
              />
            </div>
            <div className='messages-box'>
              <UserShortProf
                openUserID = { openUserID }
                openUserTab = { openUserTab }
                openContent = { openContent }
                friends = { friends }
                suggestions = { suggestions }
              />
              <UserProf
                openUserID = { openUserID }
                openUserTab = { openUserTab }
                friends = { friends }
                suggestions = { suggestions }
              />
            </div>
          </div>
      )

    // Else if 'Profile' content is open, rendering 'FriendsList' and 'UserProf'
    } else if (openContent === 'Profile') {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab = { openUserTab }/>
              <SearchBox openUserTab = { openUserTab }/>
              <FriendsList
                currentUserID = { currentUserID }
                openUserID = { openUserID }
                friends = { friends }
                lastMessages = { lastMessages }
                relationships = { relationships }
              />
            </div>
            <div className='messages-box'>
              <UserShortProf
                openUserID = { openUserID }
                openUserTab = { openUserTab }
                openContent = { openContent }
                friends = { friends }
                suggestions = { suggestions }
              />
              <UserProf
                openUserID = { openUserID }
                openUserTab = { openUserTab }
                friends = { friends }
                suggestions = { suggestions }
              />
            </div>
          </div>
      )

    // Else if 'openUserID' is defined as 'none', rendering 'FriendsList' and 'MessagesList'
    } else if (!openUserID) {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab = { openUserTab }/>
              <SearchBox openUserTab = { openUserTab }/>
              <FriendsList
                currentUserID = { currentUserID }
                openUserID = { openUserID }
                friends = { friends }
                lastMessages = { lastMessages }
                relationships = { relationships }
              />
            </div>
            <div className='messages-box'>
              <UserShortProf
                openUserID = { openUserID }
                openUserTab = { openUserTab }
                openContent = { openContent }
                friends = { friends }
                suggestions = { suggestions }
              />
              <MessagesList
                currentUserID = { currentUserID }
                openUserID = { openUserID }
                openMessages = { openMessages }
                relationships = { relationships }
              />
            </div>
          </div>
      )

    // Else, rendering 'FriendsList', 'MessagesList' and 'ReplyBox'
    } else {
      return (
          <div className='app'>
            <div className='users-box'>
              <UsersTab openUserTab = { openUserTab }/>
              <SearchBox openUserTab = { openUserTab }/>
              <FriendsList
                currentUserID = { currentUserID }
                openUserID = { openUserID }
                friends = { friends }
                lastMessages = { lastMessages }
                relationships = { relationships }
              />
            </div>
            <div className='messages-box'>
              <UserShortProf
                openUserID = { openUserID }
                openUserTab = { openUserTab }
                openContent = { openContent }
                friends = { friends }
                suggestions = { suggestions }
              />
              <MessagesList
                currentUserID = { currentUserID }
                openUserID = { openUserID }
                openMessages = { openMessages }
                relationships = { relationships }
              />
              <ReplyBox openUserID = { openUserID }/>
            </div>
          </div>
      )
    }
  }
}

export default App
