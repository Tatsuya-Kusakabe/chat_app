
class ApiV2::MessagesController < ApplicationController

  # Totally renewed from 'api/messages#index'

  def index

    # Mapping each 'friend' into a list of messages related to 'friend'

    messages = friends_id.map { |friend|

      # Selecting 'messages' sent between 'friend' and '@current_user'

      messages_with_friend = Message.where(
        "(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)",
        @current_user.id, friend, friend, @current_user.id
      )

      # Sorting 'messages' according to 'timestamp'
      # ** https://stackoverflow.com/questions/882070/

      messages_sorted = messages_with_friend.sort_by { |obj| obj.timestamp }

      # Returning 'messages_sorted' with the key 'friend'

      { friend => messages_sorted }

    }

    # Returning 'messages'

    render(json: messages)

  end

  # Extracted from 'api/messages#create'

  def create

    # Creating 'messages'

    messages = Message.new(
      sent_from: @current_user.id,
      sent_to:   params[:sent_to],
      contents:  params[:contents],
      pic_path:  params[:pic_path],
      timestamp: params[:timestamp]
    )

    # Saving 'picture' if sent

    if params[:picture]
      File.binwrite("public#{params[:pic_path]}", params[:picture].read)
    end

    # Saving 'messages'

    messages.update_attributes(create_params)

  end

  # Totally renewed from 'api/messages#show'

  def show

    # Selecting 'messages' sent from 'friend' to '@current_user'

    messages_sent_from_friend = Message.where(
      "(sent_from == ? and sent_to == ?)",
      params[:id], @current_user.id
    )

    # Selecting 'messages' sent from '@current_user' to 'friend'

    messages_sent_to_friend = Message.where(
      "(sent_from == ? and sent_to == ?)",
      @current_user.id, params[:id]
    )

    # Binding above two and sorting them according to 'timestamp'
    # ** https://stackoverflow.com/questions/882070/

    messages_with_friend \
      = (messages_sent_from_friend + messages_sent_to_friend) \
      .sort_by { |obj| obj.timestamp }

    # Returning 'messages_with_friend'

    render(json: messages_with_friend)

  end

  private

    def create_params
      params.permit(:sent_from, :sent_to, :contents, :pic_path, :timestamp)
    end

end
