
class ApiV2::FriendsController < ApplicationController

  # Newly created
  # ** Syntax ... https://teratail.com/questions/97764

  def index
    friends = User.where("id IN (?)", friends_id)
    render(json: friends)
  end

end
