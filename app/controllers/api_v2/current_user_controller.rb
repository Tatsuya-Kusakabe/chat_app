
# Responsible for getting a list of friends (index)
class ApiV2::CurrentUserController < ApplicationController

  # Newly created
  def index

    # Returning 'current_user'
    render(json: @current_user)

  end

end
