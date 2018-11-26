# 1. 'config/routes.rb'
#    Creating routings for 'api/messages' (index, create, etc...)

# 2. 'app/controllers/api/message_controller.rb'
#    Creating actions for index, create, etc...
#    Rendering in 'json' format

class Api::MessagesController < ApplicationController
  #
  def index
    #
    # Creating a blank hash '@messages', with a default value 'hash[key] = {}'
    # https://qiita.com/shibukk/items/35c4859e7ca84a427e25
    #
    @messages = Hash.new { |h,k| h[k] = Hash.new( &h.default_proc ) }
    #
    # Building '@messages' by accessing databases
    #
    num = 0
    itr = User.count
    #
    # 'for num in 1..itr do' malfunctions when some id is got rid of
    #
    while num < itr do
      #
      # Defining 'partner' who has 'id: num',
      #
      partner = User.find_by(id: num)
      #
      # If 'partner' does not exist, skipping the iteration
      #
      if partner.nil?
        num += 1
        next
      end
      #
      # If 'partner' has '@current_user.id', skipping the iteration
      #
      if num == @current_user.id
        num += 1
        next
      end
      #
      # 'partner_active',  in which the 'partner' has 'active_relationship'  to '@current_user', and
      # 'partner_passive', in which the 'partner' has 'passive_relationship' to '@current_user'
      #
      partner_active  = partner.active_relationship.find_by(recipient_id:  @current_user)
      partner_passive = partner.passive_relationship.find_by(applicant_id: @current_user)
      #
      # If the 'partner' has 'active_relationship' to '@current_user'
      # the 'partner' has 'timestamp_applicant' and '@current_user' has 'timestamp_recipient'
      #
      if partner_active
        @messages[num]["lastAccess"]["partner"]      = partner_active.timestamp_applicant
        @messages[num]["lastAccess"]["current_user"] = partner_active.timestamp_recipient
      #
      # If the 'partner' has 'passive_relationship' to '@current_user'
      # the 'partner' has 'timestamp_applicant' and '@current_user' has 'timestamp_recipient'
      #
      elsif partner_passive
        @messages[num]["lastAccess"]["current_user"] = partner_passive.timestamp_applicant
        @messages[num]["lastAccess"]["partner"]      = partner_passive.timestamp_recipient
      #
      # If the 'partner' has no relationships with '@current_user', skipping the iteration
      #
      else
        num += 1
        next
      end
      #
      # Getting user attributes of 'partner'
      #
      @messages[num]["user"]["id"]                = partner.id
      @messages[num]["user"]["name"]              = partner.name
      @messages[num]["user"]["profile_picture"]   = partner.profile_picture
      @messages[num]["user"]["status"]            = partner.status
      @messages[num]["user"]["read"]              = partner.read
      #
      # Getting messages which are 'partner' -> '@current_user' or vice versa
      #
      @messages[num]["messages"] = Message.where(
        "(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)",
        num, @current_user, @current_user, num
      )
      #
      num += 1
      #
    end
    #
    # Adding information on '@current_user'
    #
    @messages[@current_user.id] = {current_user_id: true}
    #
    # Rendering a result
    #
    render json: @messages
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
