#
# 1. 'config/routes.rb'
#    Creating routings for 'api/users' (index, create)
#
# 2. 'app/controllers/api/users_controller.rb'
#    Creating actions for index, create, and rendering in 'json' format
#
class Api::UsersController < ApplicationController
  #
  def update
    #
    # If 'partner' is on 'suggestions' list, creating a new 'relationship' and saving it
    # 'contents' should be enclosed by "...#{}", not by '...#{}' or `...#{}`
    #
    if (params[:frs_state] == 'Suggestions')
      #
      new_relationship = Relationship.new(
        applicant_id: @current_user.id,
        recipient_id: params[:id],
        timestamp_applicant: params[:timestamp],
        timestamp_recipient: params[:timestamp],
      )
      #
      new_relationship.update_attributes(rls_params)
    #
    # If 'partner' is on 'friends' list, finding an existing 'relationship' and destroy it
    #
    else
      #
      brk_relationship = Relationship.find_by(
        "(applicant_id = ? and recipient_id = ?) or (applicant_id = ? and recipient_id = ?)",
        @current_user.id, params[:id], params[:id], @current_user.id
      )
      #
      brk_relationship.destroy
      #
      # Destroying messages sent within this 'relationship'
      # ** Too complicated to validate within 'model'
      #
      brk_messages = Message.where(
        "(sent_from = ? and sent_to = ?) or (sent_to = ? and sent_from = ?)",
        @current_user.id, params[:id], params[:id], @current_user.id
      )
      #
      brk_messages.destroy
      #
    end
    #
    # If skipping 'render', rails will automatically look for '.../update.html.haml'
    #
    render(json: "")
    #
  end
  #
  private
    #
    def rls_params
      params.permit(
        :applicant_id, :recipient_id,
        :timestamp_applicant, :timestamp_recipient
      )
    end
    #
    def msg_params
      params.permit( :sent_from, :sent_to, :contents, :timestamp )
    end
    #
end
