
# Responsible for getting a list of suggestions (index)
class ApiV2::SuggestionsController < ApplicationController

  # Newly created
  def index

    suggestions = User.find(params[:self_id]).suggestions

    # Narrowing suggestions with 'params[:search_text]' if existing
    suggestions_narrowed = (params[:search_text] != 'undefined') \
      ? suggestions.where('NAME LIKE ?', "%#{params[:search_text]}%") \
      : suggestions

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'suggestions_narrowed'
    render(json: suggestions_narrowed)

  end

end
