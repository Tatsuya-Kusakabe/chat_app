
class ApiV2::RelationshipsController < ApplicationController

  # Extracted from 'api/users#update'

  def create

    # ** 'timestamp_recipient' should be earlier than 'timestamp_applicant'
    #    to make sure the welcome message is unread

    new_relationship = Relationship.new(
      applicant_id: @current_user.id,
      recipient_id: params[:user_id],
      timestamp_applicant: params[:timestamp],
      timestamp_recipient: params[:timestamp] - 100,
    )

    new_relationship.update_attributes(create_params)

    # ** If skipping 'render', rails will automatically
    #    look for '.../update.html.haml'

    render(json: "")

  end

  # Extracted from 'api/users#update'

  def destroy

    brk_relationship = Relationship.find_by(
      "(applicant_id = ? and recipient_id = ?) or (applicant_id = ? and recipient_id = ?)",
      @current_user.id, params[:id].to_i, params[:id].to_i, @current_user.id
    )

    brk_relationship.destroy

    # Destroying messages sent within this 'relationship'
    # ** Too complicated to validate within 'model'

    brk_messages = Message.where(
      "(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)",
      params[:id].to_i, @current_user.id, @current_user.id, params[:id].to_i
    )

    brk_messages.destroy_all
    render(json: "")

  end

  private

    def create_params
      params.permit(
        :applicant_id, :recipient_id,
        :timestamp_applicant, :timestamp_recipient
      )
    end

end
