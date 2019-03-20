
class Api::SuggestionsController < ApplicationController

  def index

    non_relationships = Relationship.where(
      "(applicant_id = ? and recipient_id != ?) or
       (applicant_id = ? and recipient_id != ?)",
      @current_user, 
    )
  end
  #
  def show(friend_bln = false)
    #
    # Inheriting 'show(friends_bln = false)' from 'Api::MessagesController'
    #
    super
    #
  end
  #
end
