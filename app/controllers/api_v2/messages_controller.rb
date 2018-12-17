
# Responsible for getting a list of messages             (index),
#                 getting a list of messages with a user (show), and
#                 posting a new message                  (create)
class ApiV2::MessagesController < ApplicationController

  # Totally renewed from 'api/messages#index'
  def index

    # Mapping each 'friend' into a list of messages related to 'friend'
    messages = friends_id.map do |friend|

      # Selecting 'messages' sent between 'friend' and '@current_user'
      messages_with_friend = Message.where(
        '(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)',
        @current_user.id, friend, friend, @current_user.id
      )

      # Sorting 'messages' according to 'timestamp'
      # ** https://stackoverflow.com/questions/882070/
      messages_sorted = messages_with_friend.sort_by(&:timestamp)

      # Returning 'messages_sorted' with the key 'friend'
      { friend => messages_sorted }

    end

    # Returning 'messages'
    render(json: messages)

  end

  # Totally renewed from 'api/messages#show'
  def show

    # Selecting 'messages' sent between 'friend' and '@current_user'
    messages_with_friend = Message.where(
      '(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)',
      @current_user.id, params[:id], params[:id], @current_user.id
    )

    # Sorting 'messages' according to 'timestamp'
    # ** https://stackoverflow.com/questions/882070/
    messages_sorted = messages_with_friend.sort_by(&:timestamp)

    # Returning 'messages_with_friend'
    render(json: messages_sorted)

  end

  # Extracted from 'api/messages#create'
  def create

    # Creating 'messages'
    messages = Message.new(
      sent_from: @current_user.id,
      sent_to: params[:sent_to],
      contents: params[:contents],
      pic_path: params[:pic_path],
      timestamp: params[:timestamp]
    )

    # Saving 'picture' if sent
    if params[:picture]
      File.binwrite("public#{params[:pic_path]}", params[:picture].read)
    end

    # Saving 'messages'
    messages.update(create_params)
    render(json: '')

  end

  private

    def create_params
      params.permit(:sent_from, :sent_to, :contents, :pic_path, :timestamp)
    end

end
