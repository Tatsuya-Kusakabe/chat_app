# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  #
  # Stopping authenticated users from an access to '/users/sign_in'
  #
  before_action :block_authenticated_user, { only: [:new, :create] }
  #
  # ** 'prepend_before_action' in 'Devise::SessionsController' should be killed
  # ** https://github.com/plataformatec/devise/blob/master/app/controllers
  #
  skip_before_action :require_no_authentication, { only: [:new, :create] }
  skip_before_action :verify_signed_out_user,    { only: :destroy }
  #
  # before_action :configure_sign_in_params, only: [:create]
  #
  # GET /users/sign_in
  #
  def new
    super
  end
  #
  # POST /users/sign_in
  #
  def create
    #
    # ** 'super' removed from 'POST' and 'DELETE' action (seemingly doing harm)
    #
    # Finding a user from a database
    #
    @user = User.find_by(email: params[:user][:email])
    #
    # If a user does exist and has the correct password
    # ** Using '.valid_password?()' instead of '.authenticate()'
    #    https://qiita.com/kuranari/items/a2d7e76c13f1025e2200
    #
    if @user && @user.valid_password?(params[:user][:password])
      #
      # Displaying a flash message
      #
      flash[:notice] = "You successfully signed in!"
      #
      # Signing in
      #
      sign_in(@user)
      #
      # Updating 'status'
      # ** Limiting updatable parameters
      #
      @user.status = "online"
      @user.update_attribute(:status, @user.status)
      #
      # Enabling 'remember_me'
      # ** https://issus.me/projects/34/issues/12
      # ** http://www.mashpy.me/2017/06/remember-me-is-not-working-on-rails.html
      #
      @user.remember_me!
      #
      # Redirecting
      #
      redirect_to("/")
      #
    else
      #
      # Defining an error message and redirecting
      #
      @user = User.new
      @user.errors.add(:base, "Your email or password is invalid.")
      #
      render("users/sessions/new")
      #
    end
  end
  #
  # DELETE /users/sign_out
  #
  def destroy
    #
    # Displaying a flash message
    #
    flash[:notice] = "You successfully signed out!"
    #
    # Signing out, updating 'status' and rendering a 'sign_in' page
    #
    @current_user.status = "offline"
    @current_user.update_attribute(:status, @current_user.status)
    #
    sign_out
    #
    redirect_to("/users/sign_in")
    #
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

end
