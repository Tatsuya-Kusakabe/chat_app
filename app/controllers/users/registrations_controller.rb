# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  #
  # Skipping 'authenticate_scope!' in 'Devise::SessionsController'
  # ** https://github.com/plataformatec/devise/blob/master/app/controllers/devise/...
  #
  skip_before_action :authenticate_scope!, { only: :edit }
  #
  # Stopping authenticated users from an access to '/users/sign_up'
  #
  before_action :block_authenticated_user, { only: :new }
  #
  # Stopping unauthenticated users from an access to '/users/edit'
  #
  before_action :block_unauthenticated_user, { only: :edit }
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /users/sign_up
  def new
    #
    # Defining '@user' as a new instance, and passing to 'app/views/.../new.html.haml'
    # ** 'super' removed from all actions (seemingly doing harm)
    #
    @user = User.new
    #
  end

  # POST /users
  def create
    #
    # Creating '@user' from parameters it's got
    #
    @user = User.new(registration_params)
    #
    # If a user has been successfully saved
    #
    if @user.save
      #
      # Displaying a flash message
      #
      flash[:notice] = "Welcome to this tutorial!"
      #
      # Logging in and rendering a 'root' page
      #
      log_in(@user)
      redirect_to("/")
      #
    else
      #
      # Rendering a 'log_in' page
      # ** Error messages are automatically generated
      #
      render("users/registrations/new")
      #
    end
  end

  # GET /users/edit
  def edit
    #
    # Definding '@user' as '@current_user', and passing to 'app/views/.../edit.html.haml'
    #
    @user = @current_user
    #
  end

  # PUT /users
  def update
    #
    # Finding a user from a database
    #
    @user = User.find_by(email: params[:user][:current_email])
    #
    # If a user has a valid password
    #
    if @user.valid_password?(params[:user][:current_password])
    end
  end

  private

    def registration_params
      params.require(:user).permit(
        :name, :email, :profile_picture,
        :password, :password_confirmation
      )
    end

  # DELETE /users
  def destroy
  end

  # GET /users/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
