
# Responsible for getting a list of messages with a certain user (index), and
#                 posting a new message to a certain user        (create)
class ApiV2::MessagesController < ApplicationController

  # Totally renewed from 'api/messages#index'
  def index

    # Without 'params[:user_id]', searching '@current_user's suggestions
    user = params[:user_id].present? \
      ? User.find(params[:user_id])
      : @current_user

    # Setting 'id_params' defalut as 'user.friend_ids'
    id_params = params[:partner_ids].present? \
      ? params[:partner_ids].map(&:to_i)
      : user.friend_ids

    # Setting 'count_params' defalut as '50'
    count_params = params[:limit].present? \
      ? params[:limit].to_i : 50

    # Returning 'messages'
    messages = user.messages(
      partner_ids: id_params, top_newest_counts: count_params
    )

    render(json: messages)

  end

  # Extracted from 'api/messages#create'
  def create

    # Without 'params[:user_id]', setting '@current_user.id' as 'user_id'
    user_id = params[:user_id].present? ? (params[:user_id]) : @current_user.id

    # Creating 'timestamp' (https://stackoverflow.com/questions/13148888)
    timestamp = Time.zone.now.strftime('%s%3N')

    # Creating 'messages'
    new_message = Message.new(
      pic_path: nil,
      timestamp: timestamp,
      sent_from: user_id,
      sent_to:  params[:partner_id],
      contents: params[:contents]
    )

    # If a picture was sent
    if params[:picture]

      # Defining 'picture_path' and saving it to the database
      # ** https://qiita.com/k6i/items/d2c72394a490293277cc
      picture_path = "#{picture_root_path}/#{user_id}" \
                  << "_#{timestamp}_#{params[:picture].original_filename}"
      new_message.pic_path = picture_path

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
