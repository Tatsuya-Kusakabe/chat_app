
# Responsible for getting a list of messages with a certain user (index), and
#                 posting a new message to a certain user        (create)
class ApiV2::MessagesController < ApplicationController

  # Totally renewed from 'api/messages#index'
  def index

    # params[:self_id], params[:partner_ids] and params[:limit]
    # being passed as query parameters
    user = User.find(params[:self_id])

    # Setting 'id_params' defalut as 'user.friend_ids'
    id_params = params[:partner_ids].blank? \
      ? user.friend_ids : params[:partner_ids].map(&:to_i)

    # Setting 'count_params' defalut as '50'
    count_params = params[:limit].blank? \
      ? 50 : params[:limit].to_i

    # Returning 'messages'
    messages = user.messages(with_ids: id_params, top_newest_counts: count_params)
    render(json: messages)

  end

  # Totally renewed from 'api/messages#show'
  # ** Should have been defined in 'index'
  # def show

    # Selecting 'messages' sent between 'friend' and '@current_user'
    # messages_with_friend = Message.where(
    #   '(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)',
    #   @current_user.id, params[:id], params[:id], @current_user.id
    # )

    # Sorting 'messages' according to 'timestamp'
    # ** https://stackoverflow.com/questions/882070/
    # messages_sorted = messages_with_friend.sort_by(&:timestamp)

    # Returning 'messages_with_friend'
    # render(json: messages_sorted)

  # end

  # Extracted from 'api/messages#create'
  def create

    # Creating 'timestamp' (https://stackoverflow.com/questions/13148888)
    timestamp = Time.zone.now.strftime('%s%3N')

    # Creating 'messages'
    new_message = Message.new(
      sent_from: @current_user.id,
      sent_to: params[:sent_to],
      contents: params[:contents],
      pic_path: nil,
      timestamp: timestamp
    )

    # If a picture was sent
    if params[:picture]

      # Defining 'picture_path' and saving it to the database
      picture_path = "#{picture_root_path}/#{@current_user.id}" \
                  << "_#{timestamp}_#{params[:picture][:name]}"
      messages.pic_path = picture_path

      # Saving a picture to 'public/assets/images'
      File.binwrite("public#{picture_path}", params[:picture].read)

    end

    # ** 'save!' or update(strong_parameters) unnecessary
    # ** http://d.hatena.ne.jp/masterpiyo/20111212/1323677704
    if new_message.save

      # ** If skipping 'render', rails will automatically
      #    look for '.../create.html.haml'
      render(json: '')

    else
      raise 'Failed to save a message'
    end

  end

end
