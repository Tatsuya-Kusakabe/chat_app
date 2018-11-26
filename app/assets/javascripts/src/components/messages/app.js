import React from 'react'
import UsersList from './usersList'
import MessagesBox from './messagesBox'

class App extends React.Component {
  render() {
    return (
        <div className='app'>
          <UsersList />
          <MessagesBox />
        </div>
      )
  }
}

export default App
