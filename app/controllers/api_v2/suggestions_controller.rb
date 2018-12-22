
# Responsible for getting a list of suggestions (index)
class ApiV2::SuggestionsController < ApplicationController

  # Newly created
  def index

    suggestions = User.find(params[:self_id]).suggestions

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'suggestions'
    render(json: suggestions)

  end

end
