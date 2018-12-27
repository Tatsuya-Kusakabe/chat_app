
# Responsible for getting a list of friends (index)
class ApiV2::FriendsController < ApplicationController

  # Newly created
  def index

    friends = User.find(params[:self_id]).friends

    # Narrowing friends with 'params[:search_text]' if existing
    friends_narrowed = (params[:search_text] != 'undefined') \
      ? friends.where('NAME LIKE ?', "%#{params[:search_text]}%") \
      : friends

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'friends_narrowed'
    render(json: friends_narrowed)

  end

end
