
# frozen_string_literal: true

# Responsible for 'forgot password'
class Users::PasswordsController < Devise::PasswordsController

  # GET /users/password/new
  def new
    super
  end

  # POST /users/password

  # ** default 'devise_controller' and 'passwords_controller' described below
  # ** https://github.com/plataformatec/devise/tree/master/app/controllers

  # ** 'yield resource if block_given?' in default 'passwords_controller' described below
  # **  https://qiita.com/k-shogo/items/5bbc23e1d0dd0ad3a8a2

  def create

    # Finding '@user' from a database
    @user = User.find_by(email: params[:user][:email])

    # If the user does exist
    if @user

      # Creating '@token' from 'Devise.token_generator'
      # ** https://stackoverflow.com/questions/22604261/how-to-generate-reset-password-token
      @token = Devise.token_generator.generate(User, :reset_password_token)

      # Sending 'reset_password_instructions'
      # ** Difference between 'deliver_now' and 'deliver_later' described below
      # ** https://stackoverflow.com/questions/32619366
      #    /difference-between-action-job-mailers-deliver-now-and-deliver-later
      Users::Mailer.reset_password_instructions(@user, @token).deliver_now

      # Encrypting '@token' and saving
      @user.reset_password_sent_at = Time.zone.now
      @user.reset_password_token = @user.encryption(@token)
      @user.update(pwd_params)

      # Displaying a flash message
      flash[:notice] = 'You will receive your instructions!'

    else

      # Defining an error message and redirecting
      # ** 'devise_error_messages!' enabled by handing an empty instance
      @user = User.new
      @user.errors.add(:base, 'Your email does not match any users.')

    end

    # Redirecting
    render('users/passwords/new')

  end

  # GET /users/password/edit?reset_password_token=abcdef
  def edit
    super
  end

  # PUT /users/password
  def update

    # Finding '@user' from a database
    @user = User.find_by(email: params[:user][:email])

    # If a user has a valid token and has been successfully saved
    # ** '@token' encapsulates in '["salt", "pepper"]' format, whereas
    #    'params[:user][:reset_password_token]' in 'salt pepper' format
    if @user.valid_token?(
      @user.reset_password_token,
      params[:user][:reset_password_token].split(' ')
    ) && @user.update(pwd_params)

      # Sending 'reset_password_instructions'
      Users::Mailer.reset_password_completions(@user).deliver_now

      flash[:notice] = 'You successfully updated your password!'
      redirect_to('/users/sign_in')

    else

      @user.errors.add(:base, 'You have an invalid email link.')
      render('users/passwords/new')

    end

  end

  private

    # Defining 'params', for which 'user' key is must-have, and
    # 'email', ..., 'reset_password_sent_at' are modifiable
    # ** https://stackoverflow.com/questions/1531047/update-attributes-unless-blank
    # ** https://ruby-doc.org/core-2.1.5/Hash.html#method-i-reject
    def pwd_params
      params.require(:user).permit(
        :email, :password, :password_confirmation,
        :reset_password_token, :reset_password_sent_at
      )
    end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

end
