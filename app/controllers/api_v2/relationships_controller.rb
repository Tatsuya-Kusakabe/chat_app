
# Responsible for getting a list of relationships             (index),
#                 creating a new relationship                 (create),
#                 updating timestamps                         (update), and
#                 destroying a relationship                   (destroy)
class ApiV2::RelationshipsController < ApplicationController

  protect_from_forgery except: :update

  # Newly created
  def index

    # params[:self_id], params[:partner_ids]
    # being passed as query parameters
    user = User.find(params[:self_id])

    # Setting 'id_params' defalut as 'user.friend_ids'
    id_params = params[:partner_ids].blank? \
      ? user.friend_ids : params[:partner_ids].map(&:to_i)

    # Returning 'relationships'
    relationships = user.relationships_mapped(with_ids: id_params)
    render(json: relationships)

  end

  # Extracted from 'api/users#update'
  def create

    timestamp = Time.zone.now.strftime('%s%3N')

    new_relationship = Relationship.new(
      applicant_id: params[:self_id],
      recipient_id: params[:partner_id],
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

    timestamp = Time.zone.now.strftime('%s%3N')

    # Finding 'user' on scope
    user = User.find(params[:self_id])

    # Finding relationships concerning 'user'
    user_active = user.active_relationship.find_by(recipient_id: params[:partner_id])
    user_passive = user.passive_relationship.find_by(applicant_id: params[:partner_id])

    # Updating 'timestamp'
    if user_active
      user_active.update!(timestamp_applicant: timestamp)
    elsif user_passive
      user_passive.update!(timestamp_recipient: timestamp)
    end

    render(json: '')

  end

  # Extracted from 'api/users#update'
  def destroy

    user = User.find(params[:self_id])

    # Destroying 'relationships' on scope
    relationships_to_destroy = user.relationships(with_ids: [params[:partner_id]])
    relationships_to_destroy.destroy_all

    # Destroying messages sent within this 'relationship'
    # ** Too complicated to validate within 'model'
    messages_to_destroy = user.messages(with_ids: [params[:partner_id]])
    messages_to_destroy.destroy_all

    render(json: '')

  end

end
