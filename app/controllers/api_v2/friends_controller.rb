
# Responsible for getting a list of friends (index)
class ApiV2::FriendsController < ApplicationController

  # Newly created
  def index

    # Extracting users using 'friends_id'
    # ** https://teratail.com/questions/97764
    friends = User.where(
      'id IN (?)', friends_id

    # Limiting columns for quicker data loading
    ).select(
      'id, name, profile_picture, profile_comment, status, read, email'
    )

    # Returning 'friends'
    render(json: friends)

  end

end
