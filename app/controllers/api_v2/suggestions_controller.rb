
class ApiV2::SuggestionsController < ApplicationController

  # Newly created
  # ** Syntax ... https://teratail.com/questions/97764

  def index
    suggestions = User.where("id NOT IN (?)", friends_id)
    render(json: suggestions)
  end

end
