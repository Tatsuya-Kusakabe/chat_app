
class ApiV2::FriendsController < ApplicationController

  def index
    friends = User.where(id: friends_id)
    render(json: friends)
  end

end
