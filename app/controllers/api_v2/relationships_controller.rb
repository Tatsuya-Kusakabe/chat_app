
class ApiV2::RelationshipsController < ApplicationController

  # Newly created

  def index

    relationships = Relationship.where(
      "(applicant_id = ? and recipient_id IN (?)) or
       (recipient_id = ? and applicant_id IN (?))",
      @current_user, friends_id, @current_user, friends_id
    )

    render(json: relationships)

  end

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
    #    look for '.../create.html.haml'

    render(json: "")

  end

  # Extracted from 'api/messages#create'

  def update

    # Finding 'user' on scope

    user = User.find_by(id: params[:id])

    # Finding relationships concerning 'user'

    user_active  = user.active_relationship.find_by(recipient_id:  @current_user)
    user_passive = user.passive_relationship.find_by(applicant_id: @current_user)

    # Updating 'timestamp'

    if !!user_active
      user_active.timestamp_recipient  = params[:timestamp]
      user_active.save!
    elsif !!user_passive
      user_passive.timestamp_applicant = params[:timestamp]
      user_passive.save!
    end

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
