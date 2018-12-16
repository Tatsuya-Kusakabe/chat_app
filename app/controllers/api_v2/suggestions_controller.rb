
class ApiV2::SuggestionsController < ApplicationController

  # Newly created
  def index

    # Extracting suggestions using 'friends_id'
    # ** https://teratail.com/questions/97764
    suggestions = User.where(
      "id NOT IN (?)", friends_id

    # Limiting columns for quicker data loading
    ).select(
      'id, name, profile_picture, profile_comment, status, read, email'
    )

    # Returning 'suggestions'
    render(json: suggestions)
    
  end

end
