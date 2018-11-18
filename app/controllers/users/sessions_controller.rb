# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  #
  # Skipping 'verify_signed_out_user' in 'Devise::SessionsController' when logging out
  # ** https://github.com/plataformatec/devise/blob/master/app/controllers/devise/...
  #
  skip_before_action :verify_signed_out_user, { only: :destroy }
  #
  # Stopping authenticated users from an access to '/users/sign_in'
  #
  before_action :block_authenticated_user, { only: :new }
  # before_action :configure_sign_in_params, only: [:create]

  # GET /users/sign_in
  def new
    #
    # ** 'super' removed from all actions (seemingly doing harm)
    #
  end

  # POST /users/sign_in
  def create
    #
    # Finding a user from a database
    #
    @user = User.find_by(email: params[:session][:email])
    #
    # If a user does exist and has the correct password
    # ** Using '.valid_password?()' instead of '.authenticate()'
    #    https://qiita.com/kuranari/items/a2d7e76c13f1025e2200
    #
    if @user && @user.valid_password?(params[:session][:password])
      #
      # Displaying a flash message
      #
      flash[:notice] = "You successfully logged in!"
      #
      # Logging in and rendering a 'root' page
      #
      log_in(@user)
      redirect_to("/")
      #
    else
      #
      # Defining '@error_message'
      #
      @error_message = "Wrong email address or password"
      #
      # Rendering a 'log_in' page
      #
      render("users/sessions/new")
      #
    end
  end

  # DELETE /users/sign_out
  def destroy
    #
    # Displaying a flash message
    #
    flash[:notice] = "You successfully logged out!"
    #
    # Logging out and rendering a 'log_in' page
    #
    log_out
    redirect_to("/users/sign_in")
    #
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
