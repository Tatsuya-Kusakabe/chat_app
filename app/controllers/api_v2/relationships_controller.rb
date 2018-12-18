
# Responsible for getting a list of relationships             (index),
#                 creating a new relationship                 (create),
#                 updating timestamps                         (update), and
#                 destroying a relationship                   (destroy)
class ApiV2::RelationshipsController < ApplicationController

  # Newly created
  def index

    relationships = @current_user.relationships

    # Mapping 'relationship' with the key 'partner'
    relationships_mapped = relationships.map do |obj|

      obj.applicant_id != @current_user.id \
        ? key = obj.applicant_id \
        : key = obj.recipient_id

      { key => obj }

    end

    # Returning 'relationships_mapped'
    render(json: relationships_mapped)

  end

  # Newly created
  # ** params[:id] used wrong
  # def show

    # Extracting 'relationship' between 'friend' and '@current_user'
    # relationship_with_friend = Relationship.where(
    #   '(applicant_id = ? and recipient_id = ?) or
    #    (recipient_id = ? and applicant_id = ?)',
    #   @current_user.id, params[:id], @current_user.id, params[:id]

    # Limiting columns for quicker data loading
    # ).select(
    #   'id, applicant_id, recipient_id,
    #    timestamp_applicant, timestamp_recipient'
    # )

    # Returning 'relationship_with_friend'
    # render(json: relationship_with_friend[0])

  # end

  # Extracted from 'api/users#update'
  def create

    timestamp = Time.zone.now.strftime('%s%3N')

    new_relationship = Relationship.new(
      applicant_id: @current_user.id,
      recipient_id: params[:user_id],
      timestamp_applicant: timestamp,
      timestamp_recipient: nil
    )

    new_relationship.save
    render(json: '')

  end

  # Extracted from 'api/messages#create'
  def update

    # Finding 'user' on scope
    user = User.find(params[:id])

    # Finding relationships concerning 'user'
    user_active = user.active_relationship.find_by(recipient_id: @current_user)
    user_passive = user.passive_relationship.find_by(applicant_id: @current_user)

    # Updating 'timestamp'
    user_active.update!I(timestamp_recipient: params[:timestamp])
    user_passive.update!I(timestamp_applicant: params[:timestamp])
    # if user_active
    #   user_active.timestamp_recipient = params[:timestamp]
    #   user_active.save!
    # elsif user_passive
    #   user_passive.timestamp_applicant = params[:timestamp]
    #   user_passive.save!
    # end

    render(json: '')

  end

  # Extracted from 'api/users#update'
  def destroy

    friend_id = params[:id].to_i

    # Destroying 'relationship' on scope
    relationship_to_destroy = @current_user.relationship_with(friend_id)
    relationship_to_destroy.destroy

    # Destroying messages sent within this 'relationship'
    # ** Too complicated to validate within 'model'
    messages_to_destroy = @current_user.messages_with(friend_id)
    messages_to_destroy.destroy_all

    render(json: '')

  end

end
