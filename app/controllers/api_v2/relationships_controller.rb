
# Responsible for getting a list of relationships             (index),
#                 creating a new relationship                 (create),
#                 updating timestamps                         (update), and
#                 destroying a relationship                   (destroy)
class ApiV2::RelationshipsController < ApplicationController

  # Newly created
  def index

    # Without 'params[:user_id]', searching '@current_user's suggestions
    user = params[:user_id].present? \
      ? User.find(params[:user_id])
      : @current_user

    # Setting 'id_params' defalut as 'user.friend_ids'
    id_params = params[:partner_ids].present? \
      ? params[:partner_ids].map(&:to_i)
      : user.friend_ids

    # Returning 'relationships'
    relationships = user.relationships_mapped(with_ids: id_params)
    render(json: relationships)

  end

  # Extracted from 'api/users#update'
  def create

    timestamp = Time.zone.now.strftime('%s%3N')

    user_id = params[:user_id].present? ? (params[:user_id]) : @current_user.id

    new_relationship = Relationship.new(
      applicant_id: user_id,
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

    # Without 'params[:user_id]', searching '@current_user's suggestions
    user = params[:user_id].present? \
      ? User.find(params[:user_id])
      : @current_user

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

    # Without 'params[:user_id]', searching '@current_user's suggestions
    user = params[:user_id].present? \
      ? User.find(params[:user_id])
      : @current_user

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
