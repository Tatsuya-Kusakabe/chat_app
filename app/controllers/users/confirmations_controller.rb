# frozen_string_literal: true

class Users::ConfirmationsController < Devise::ConfirmationsController
  #
  # GET /users/confirmation/new
  #
  def new
    super
  end
  #
  # POST /users/confirmation
  #
  def create
    #
    # Displaying a flash message and redirecting
    #
    super
    flash[:notice] = "You will receive the instruction to activate your account!"
  end
  #
  # GET /users/confirmation?confirmation_token=...
  #
  def show
    #
    # Finding '@user' from a database
    #
    @user  = User.find_by(email: params[:email])
    #
    # If a user has a valid token and has been successfully saved
    # ** '@token' is not encrypted!!
    #
    if (@user.confirmation_token == params[:confirmation_token]) \
     && @user.update_attributes(create_params)
      #
      flash[:notice] = "Welcome to this tutorial!"
      #
      log_in(@user)
      redirect_to("/")
      #
    else
      #
      @user.errors.add(:base, "You have an invalid email link.")
      #
      render("users/registrations/new")
      #
    end
    #
  end
  #
  private
    #
    # Defining 'create_params', for which 'user' key is must-have, and
    # 'email', ..., 'confirmed_at' are modifiable
    # ** https://stackoverflow.com/questions/1531047/update-attributes-unless-blank
    # ** https://ruby-doc.org/core-2.1.5/Hash.html#method-i-reject
    #
    def create_params
      params.permit(
        :email, :password, :password_confirmation,
        :confirmation_token, :confirmed_at
      )
    end

  # protected

  # The path used after resending confirmation instructions.
  # def after_resending_confirmation_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  # The path used after confirmation.
  # def after_confirmation_path_for(resource_name, resource)
  #   super(resource_name, resource)
  # end
end
