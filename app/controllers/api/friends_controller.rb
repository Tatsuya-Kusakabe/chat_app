#
class Api::FriendsController < Api::ApplicationController
  #
  def index(friends_bln = true)
    #
    # Inheriting 'index(friends_bln = true)' from 'Api::ApplicationController'
    #
    super
    #
  end
  #
  def create
    #
    # If 'ActionTypes.SEND_MESSAGE' (judged by 'params[:contents] != nil')
    #
    if params[:contents]
      #
      # Building '@messages' by extracting data from 'actions/messages.js'
      #
      @messages = Message.new(
        sent_from: @current_user.id,
        sent_to:   params[:sent_to],
        contents:  params[:contents],
        timestamp: params[:timestamp]
      )
      #
      # ** '.save!' returns error messages if failing to save
      #
      @messages.save!
      #
      # Extracting '@user' the message is 'sent_to'
      # ** The column 'ID' should be a primary key, otherwise
      #    it won't be able to find the record for update
      #    https://github.com/rails/rails/issues/20755
      #
      @user = User.find_by(id: params[:sent_to])
    #
    # If 'ActionTypes.UPDATE_OPEN_CHAT_ID'
    #
    else
      #
      # Extracting '@user' the account is 'clicked_on'
      #
      @user = User.find_by(id: params[:clicked_on])
    #
    end
    #
    # Extracting the relationship as in 'api/messages#index'
    #
    user_active  = @user.active_relationship.find_by(recipient_id:  @current_user)
    user_passive = @user.passive_relationship.find_by(applicant_id: @current_user)
    #
    # Updating the timestamp
    #
    if !!user_active
      user_active.timestamp_recipient  = params[:timestamp]
      user_active.save!
    elsif !!user_passive
      user_passive.timestamp_applicant = params[:timestamp]
      user_passive.save!
    end
    #
    # Rendering a result
    #
    render json: @messages
    #
  end
  #
end
