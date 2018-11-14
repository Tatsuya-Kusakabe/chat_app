# 1. 'config/routes.rb'
#    Defining routings for api/messages#(index, show, etc...)

# 2. 'app/controllers/api/message_controller.rb'
#    Defining actions for index, show, etc...
#    Rendering in 'json' format

class Api::MessagesController < ApplicationController
  def index
    #
    # Defining a blank hash '@messages', with a default value 'hash[key] = {}'
    # https://qiita.com/shibukk/items/35c4859e7ca84a427e25
    #
    @messages = Hash.new { |h,k| h[k] = Hash.new( &h.default_proc ) }
    #
    # Building '@messages' by accessing databases
    # ** The user, who is excluded from databases, has the user_id '1'
    #
    itr = User.count
    for num in 2..(itr + 1) do
      #
      @messages[num]["user"]["id"]                = User.find_by(id: num).id
      @messages[num]["user"]["name"]              = User.find_by(id: num).name
      @messages[num]["user"]["profilePicture"]    = User.find_by(id: num).profile_picture
      @messages[num]["user"]["status"]            = User.find_by(id: num).status
      @messages[num]["user"]["read"]              = User.find_by(id: num).read
      #
      @messages[num]["lastAccess"]["recipient"]   = User.find_by(id: num).timestamp_recipient
      @messages[num]["lastAccess"]["currentUser"] = User.find_by(id: num).timestamp_user
      #
      @messages[num]["messages"] = Message.where(user_id: num)
      #
    end
    #
    # Rendering a result
    #
    render json: @messages
  end

  def create
    #
    # If 'ActionTypes.SEND_MESSAGE' (judged by 'params[:contents] == true'),
    # building '@messages' by extracting data from 'actions/messages.js'
    # '.save!' returns error messages if failing to save
    #
    if params[:contents]
      @messages = Message.new(
        user_id:   params[:user_id],
        from:      params[:from],
        contents:  params[:contents],
        timestamp: params[:timestamp]
      )
      @messages.save!
    end
    #
    # Updating the recipient's timestamp
    # ** The column 'ID' should be a primary key, otherwise
    #    it won't be able to find the record for update
    #    https://github.com/rails/rails/issues/20755
    #
    @user = User.find_by(id: params[:user_id])
    @user.timestamp_user = params[:timestamp]
    logger.debug("debug: ")
    logger.debug(@user.timestamp_user)
    @user.save!
    #
    # Rendering a result
    #
    render json: @messages
  end
end
