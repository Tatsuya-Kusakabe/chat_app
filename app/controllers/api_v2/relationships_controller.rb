
# Responsible for getting a list of relationships             (index),
#                 creating a new relationship                 (create),
#                 updating timestamps                         (update), and
#                 destroying a relationship                   (destroy)
class ApiV2::RelationshipsController < ApplicationController

  # Newly created
  def index

    # params[:self_id], params[:partner_ids]
    # being passed as query parameters
    user = User.find(params[:self_id])

    # Setting 'id_params' defalut as 'user.friend_ids'
    id_params = params[:partner_ids].blank? \
      ? user.friend_ids : params[:partner_ids].map(&:to_i)

    # Returning 'relationships'
    relationships = user.relationships(with_ids: id_params)
    render(json: relationships)

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

    if new_relationship.save
      render(json: '')
    else
      raise 'Failed to save a relationship'
    end

  end

  # Extracted from 'api/messages#create'
  def update

    # Finding 'user' on scope
    user = User.find(params[:partner_id])

    # Finding relationships concerning 'user'
    user_active = user.active_relationship.find_by(recipient_id: params[:self_id])
    user_passive = user.passive_relationship.find_by(applicant_id: params[:self_id])

    # Updating 'timestamp'
    user_active.update!(timestamp_recipient: params[:timestamp])
    user_passive.update!(timestamp_applicant: params[:timestamp])

    render(json: '')

  end

  # Extracted from 'api/users#update'
  def destroy

    user = User.find(params[:self_id])

    # Destroying 'relationship' on scope
    relationship_to_destroy = user.relationships(with_ids: params[:partner_ids])
    relationship_to_destroy.destroy

    # Destroying messages sent within this 'relationship'
    # ** Too complicated to validate within 'model'
    messages_to_destroy = user.messages(with_ids: params[:partner_ids])
    messages_to_destroy.destroy_all

    render(json: '')

  end

end
