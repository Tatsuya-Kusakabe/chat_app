
# Responsible for getting a list of suggestions (index)
class ApiV2::SuggestionsController < ApplicationController

  # Newly created
  def index

    suggestions = @current_user.suggestions

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'suggestions'
    render(json: suggestions)

  end

end
