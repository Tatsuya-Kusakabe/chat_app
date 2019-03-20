
# Responsible for getting a list of friends (index)
class ApiV2::FriendsController < ApplicationController

  # Newly created
  def index

    # Without 'params[:user_id]', searching '@current_user's friends
    friends = params[:user_id].present? \
      ? User.find(params[:user_id]).friends \
      : @current_user.friends

      # With 'params[:search_text]', narrowing friends
    friends_narrowed = params[:search_text].present? \
      ? friends.where('NAME LIKE ?', "%#{params[:search_text]}%") \
      : friends

    # Limiting columns for quicker data loading (should have been avoided)
    # .select( 'id, name, profile_picture, profile_comment, status, read, email' )

    # Returning 'friends_narrowed'
    render(json: friends_narrowed)

  end

end
