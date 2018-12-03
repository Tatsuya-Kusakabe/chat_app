#
# 1. 'config/routes.rb'
#    Creating routings for 'api/messages' (index, create)
#
# 2. 'app/controllers/api/messages_controller.rb'
#    Creating actions for index, create, and rendering in 'json' format
#
class Api::MessagesController < ApplicationController
  #
  def index(friend_bln)
    #
    # Defining '@messages'
    #
    @messages = []
    #
    # Building '@messages' by accessing databases
    #
    num     = 0
    num_id  = 0
    itr_fin = User.last.id
    #
    # 'for num_id in 1..(itr_fin + 1) do' malfunctions when some id is skipped
    #
    while num_id < (itr_fin + 1) do
      #
      # Defining 'partner' who has 'id: num',
      #
      partner = User.find_by(id: num_id)
      #
      # If 'partner' does not exist, skipping the iteration
      #
      if partner.nil?
        num_id += 1
        next
      end
      #
      # If 'partner' is '@current_user', skipping the iteration
      #
      if partner == @current_user
        num_id += 1
        next
      end
      #
      # Defining 'partner_active',  in which 'partner' has 'active_relationship'  to '@current_user'
      # Defining 'partner_passive', in which 'partner' has 'passive_relationship' to '@current_user'
      # Defining 'partner_bln', which describes if 'partner' has any relationship with '@current_user'
      #
      partner_active  = partner.active_relationship.find_by(recipient_id:  @current_user)
      partner_passive = partner.passive_relationship.find_by(applicant_id: @current_user)
      partner_bln     = (!!partner_active) || (!!partner_passive)
      #
      # If 'partner' has any relationship in 'GET_SUGGESTIONS', skipping the iteration
      #
      if (!!partner_bln) && (!friend_bln)
        num_id += 1
        next
      end
      #
      # If 'partner' has no relationship in 'GET_FRIENDS', skipping the iteration
      #
      if (!partner_bln) && (!!friend_bln)
        num_id += 1
        next
      end
      #
      # ** Below, the information exists
      #
      # Adding a blank hash '@messages', with a default value 'hash[key] = {}'
      # https://qiita.com/shibukk/items/35c4859e7ca84a427e25
      #
      @messages.push(Hash.new { |h,k| h[k] = Hash.new( &h.default_proc ) })
      #
      # Getting user attributes of 'partner'
      #
      @messages[num]["user"]["id"]                = partner.id
      @messages[num]["user"]["name"]              = partner.name
      @messages[num]["user"]["profile_picture"]   = partner.profile_picture
      @messages[num]["user"]["profile_comment"]   = partner.profile_comment
      @messages[num]["user"]["status"]            = partner.status
      @messages[num]["user"]["read"]              = partner.read
      #
      # If calling 'SuggestionsController', finishing the iteration
      #
      if (!friend_bln)
        num    += 1
        num_id += 1
        next
      end
      #
      # If 'partner' has 'active_relationship' in 'FriendsController'
      #
      if (!!partner_active)
        #
        # 'partner' has 'timestamp_applicant', and '@current_user' has 'timestamp_recipient'
        #
        @messages[num]["lastAccess"]["partner"]      = partner_active.timestamp_applicant
        @messages[num]["lastAccess"]["current_user"] = partner_active.timestamp_recipient
      #
      # If 'partner' has 'passive_relationship' in 'FriendsController'
      #
      elsif (!!partner_passive)
        #
        # '@current_user' has 'timestamp_applicant', and 'partner' has 'timestamp_recipient',
        #
        @messages[num]["lastAccess"]["current_user"] = partner_passive.timestamp_applicant
        @messages[num]["lastAccess"]["partner"]      = partner_passive.timestamp_recipient
      #
      end
      #
      # Getting messages which are 'partner' -> '@current_user' or vice versa
      #
      @messages[num]["messages"] = Message.where(
        "(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)",
        num_id, @current_user.id, @current_user.id, num_id
      )
      logger.debug(@messages[num]["messages"])
      #
      # Adding the last message's timestamp on 'lastAccess'
      #
      num_lst_msg = @messages[num]["messages"].length - 1
      tst_lst_msg = @messages[num]["messages"][num_lst_msg]["timestamp"]
      @messages[num]["lastAccess"]["post"] = tst_lst_msg
      #
      # Finishing iteration
      #
      num    += 1
      num_id += 1
      #
    end
    #
    # Adding information on 'current_user'
    #
    @messages.push({ user: {id: @current_user.id, current_user: true} })
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
      @messages.update_attributes(msg_params)
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
  private
    #
    def msg_params
      params.permit(
        :applicant_id, :recipient_id,
        :timestamp_applicant, :timestamp_recipient
      )
    end
    #
end
