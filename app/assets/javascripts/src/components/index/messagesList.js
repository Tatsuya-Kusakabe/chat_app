
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classNames'
import Utils from '../../utils'

class MessagesList extends React.Component {

  render() {
    const { currentUserID, openUserID, openMessages, relationships } = this.props

    // When having no 'openMessages' or 'relationships' with 'openUserID',
    // displaying 'No messages'
    const skipRender = !openUserID ||
      !(_.find(openMessages, openUserID)) ||
      !(_.find(relationships, openUserID))

    if (skipRender) {
      return (
          <div className='messages-list'>
            <div className='messages-list__list messages-list__list__empty'>
              No messages
            </div>
          </div>
      )
    }

    const openMessagesWoHash = _.find(openMessages, openUserID)[openUserID]
    const lastMessage = openMessages[openMessages.length - 1]
    const openRelationship = _.find(relationships, openUserID)[openUserID]
    const timestamp_partner = (openRelationship.applicantId === openUserID)
      ? openRelationship.timestampApplicant
      : openRelationship.timestampRecipient

    // Rendering 'openMessages'
    const messagesList = openMessagesWoHash.map((message, index) => {
      // Defining 'item_classes' for each message icon
      const itemClasses = classNames({
        'messages-list__item': true,
        'clear': true,
      })

      // Defining 'content_classes' for each message string
      const contentClasses = classNames({
        'messages-list__content': true,
        'messages-list__picture': message.picPath !== null,
        'messages-list__content__from-current': message.sentFrom === currentUserID,
        'messages-list__content__from-partner': message.sentFrom !== currentUserID,
      })

      // Returing each 'message.contents'
      if (message.picPath !== null) {
        return (
            <li key={ message.timestamp + '-' + message.sentFrom } className={ itemClasses }>
              <div className={ contentClasses }>
                <img src={ message.picPath }/>
              </div>
            </li>
        )
      } else {
        return (
            <li key={ message.timestamp + '-' + message.sentFrom } className={ itemClasses }>
              <div className={ contentClasses }>
                { message.contents }
              </div>
            </li>
        )
      }
    })

    // If 'last_message' was sent from 'current_user' and already accessed
    // by 'partner', Displaying 'date' when 'last_message' was read
    if ((lastMessage.sentFrom === currentUserID) &&
    (lastMessage.timestamp <= timestamp_partner)) {
      messagesList.push(
          <li key='read' className='messages-list__item'>
            <div className='messages-list__read'>
              Read { Utils.getNiceDate(timestamp_partner) }
            </div>
          </li>
      )
    }

    // Returning 'messagesList'
    return <ul className='messages-list__list'>{ messagesList }</ul>
  }
}

// Defining 'propTypes'
// ** https://morizyun.github.io/javascript/react-js-proptypes-validator.html
MessagesList.propTypes = {
  currentUserID: PropTypes.number,
  openUserID: PropTypes.number,
  openMessages: PropTypes.array,
  relationships: PropTypes.array,
}
//
export default MessagesList
