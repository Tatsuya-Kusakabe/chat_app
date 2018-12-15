
class ApiV2::MessagesController < ApplicationController

  def index

    # Mapping each 'friend' into a list of messages related to 'friend'

    messages = friends_id.map { |friend|

      # Selecting 'messages' sent from 'friend' to '@current_user'

      messages_sent_from_friend = Message.where(
        "(sent_from == ? and sent_to == ?)",
        friend, @current_user.id
      )

      # Selecting 'messages' sent from '@current_user' to 'friend'

      messages_sent_to_friend = Message.where(
        "(sent_from == ? and sent_to == ?)",
        @current_user.id, friend
      )

      # Binding above two and sorting them according to 'timestamp'
      # ** https://stackoverflow.com/questions/882070/

      messages_with_friend \
        = (messages_sent_from_friend + messages_sent_to_friend) \
        .sort_by { |obj| obj.timestamp }

      # Returning 'messages_with_friend' with the key 'friend'

      { friend => messages_with_friend }

    }

    # Returning 'messages'

    render(json: messages)

  end

end
