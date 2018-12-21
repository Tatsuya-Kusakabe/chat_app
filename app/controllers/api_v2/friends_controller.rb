
# Responsible for getting a list of friends (index)
class ApiV2::FriendsController < ApplicationController

  def index

    friends = @current_user.friends

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'friends'
    render(json: friends)
    
  end

end
