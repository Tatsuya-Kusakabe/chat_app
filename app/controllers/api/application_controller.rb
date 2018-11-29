#
# 1. 'config/routes.rb'
#    Creating routings for 'api/messages' (index, create)
#
# 2. 'app/controllers/api/application_controller.rb'
#    Creating actions for index, create, and rendering in 'json' format
#
class Api::ApplicationController < ApplicationController
  #
  def index(friends_bln)
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
      # Defining 'partner', which describes if 'partner' has any relationship with '@current_user'
      #
      partner_active  = partner.active_relationship.find_by(recipient_id:  @current_user)
      partner_passive = partner.passive_relationship.find_by(applicant_id: @current_user)
      partner_bln     = (!!partner_active) || (!!partner_passive)
      #
      # If 'partner' has any relationship in 'SuggestionsController', skipping the iteration
      #
      if (!!partner_bln) && (!friends_bln)
        num_id += 1
        next
      end
      #
      # If 'partner' has no relationship in 'FriendsController', skipping the iteration
      #
      if (!partner_bln) && (!!friends_bln)
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
      @messages[num]["user"]["status"]            = partner.status
      @messages[num]["user"]["read"]              = partner.read
      #
      # If calling 'SuggestionsController', finishing the iteration
      #
      if (!friends_bln)
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
        num_id, @current_user, @current_user, num_id
      )
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
end
