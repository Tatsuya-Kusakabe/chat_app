
class Api::FriendsController < ApplicationController

  def index

    # Extracting 'relationship' on scope

    active_relationships  = Relationship.where(applicant_id: @current_user.id)
    passive_relationships = Relationship.where(recipient_id: @current_user.id)

    # Making a list of 'friends' immutably
    # https://stackoverflow.com/questions/9072689

    active_friends_id  = active_relationships.map{  |value| value.recipient_id }
    passive_friends_id = passive_relationships.map{ |value| value.applicant_id }
    friends_id         = active_friends_id + passive_friends_id

    # Extracting details on 'friends' and returning it

    friends = User.where(id: friends_id)
    render(json: friends)

  end

  #
  def show(friend_bln = true)
    #
    # Inheriting 'show(friends_bln = true)' from 'Api::MessagesController'
    #
    super
    #
  end
  #
end
