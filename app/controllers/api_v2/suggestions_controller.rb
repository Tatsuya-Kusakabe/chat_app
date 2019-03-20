
# Responsible for getting a list of suggestions (index)
class ApiV2::SuggestionsController < ApplicationController

  # Newly created
  def index

    # Without 'params[:user_id]', searching '@current_user's suggestions
    suggestions = params[:user_id].present? \
      ? User.find(params[:user_id]).suggestions \
      : @current_user.suggestions

    # With 'params[:search_text]', narrowing suggestions
    suggestions_narrowed = params[:search_text].present? \
      ? suggestions.where('NAME LIKE ?', "%#{params[:search_text]}%") \
      : suggestions

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'suggestions_narrowed'
    render(json: suggestions_narrowed)

  end

end
