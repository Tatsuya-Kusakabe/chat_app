
# Responsible for getting a list of relationships             (index),
#                 getting a list of relationships with a user (show),
#                 creating a new relationship                 (create),
#                 updating timestamps                         (update), and
#                 destroying a relationship                   (destroy)
class ApiV2::RelationshipsController < ApplicationController

  # Newly created
  def index

    # Mapping each 'friend' into a list of relationships related to 'friend'
    relationships = friends_id.map do |friend|

      # Extracting 'relationship' between 'friend' and '@current_user'
      relationships_with_friend = Relationship.where(
        '(applicant_id = ? and recipient_id = ?) or
         (recipient_id = ? and applicant_id = ?)',
        @current_user.id, friend, @current_user.id, friend

      # Limiting columns for quicker data loading
      ).select(
        'id, applicant_id, recipient_id,
         timestamp_applicant, timestamp_recipient'
      )

      # Returning 'relationships_with_friend' with the key 'friend'
      { friend => relationships_with_friend[0] }

    end

    # Returning 'relationships'
    render(json: relationships)

  end

  # Newly created
  def show

    # Extracting 'relationship' between 'friend' and '@current_user'
    relationship_with_friend = Relationship.where(
      '(applicant_id = ? and recipient_id = ?) or
       (recipient_id = ? and applicant_id = ?)',
      @current_user.id, params[:id], @current_user.id, params[:id]

    # Limiting columns for quicker data loading
    ).select(
      'id, applicant_id, recipient_id,
       timestamp_applicant, timestamp_recipient'
    )

    # Returning 'relationship_with_friend'
    render(json: relationship_with_friend[0])

  end

  # Extracted from 'api/users#update'
  def create

    # ** 'timestamp_recipient' should be earlier than 'timestamp_applicant'
    #    to make sure the welcome message is unread
    new_relationship = Relationship.new(
      applicant_id: @current_user.id,
      recipient_id: params[:user_id],
      timestamp_applicant: params[:timestamp],
      timestamp_recipient: params[:timestamp] - 100
    )
    new_relationship.update(create_params)

    # ** If skipping 'render', rails will automatically
    #    look for '.../create.html.haml'
    render(json: '')

  end

  # Extracted from 'api/messages#create'
  def update

    # Finding 'user' on scope
    user = User.find_by(id: params[:id])

    # Finding relationships concerning 'user'
    user_active = user.active_relationship.find_by(recipient_id: @current_user)
    user_passive = user.passive_relationship.find_by(applicant_id: @current_user)

    # Updating 'timestamp'
    if user_active
      user_active.timestamp_recipient = params[:timestamp]
      user_active.save!
    elsif user_passive
      user_passive.timestamp_applicant = params[:timestamp]
      user_passive.save!
    end

    render(json: '')

  end

  # Extracted from 'api/users#update'
  def destroy

    partner_id = params[:id].to_i

    # Destroying relationships on scope
    brk_relationship = Relationship.find_by(
      '(applicant_id = ? and recipient_id = ?) or
       (recipient_id = ? and applicant_id = ?)',
      @current_user.id, partner_id, @current_user.id, partner_id
    )
    brk_relationship.destroy

    # Destroying messages sent within this 'relationship'
    # ** Too complicated to validate within 'model'
    brk_messages = Message.where(
      '(sent_from = ? and sent_to = ?) or (sent_to = ? and sent_from = ?)',
      @current_user.id, partner_id, @current_user.id, partner_id
    )
    brk_messages.destroy_all

    render(json: '')

  end

  private

    def create_params
      params.permit(
        :applicant_id, :recipient_id,
        :timestamp_applicant, :timestamp_recipient
      )
    end

end
