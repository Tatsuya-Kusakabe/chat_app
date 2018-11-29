# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  #
  # Blocking authenticated users from '/users/sign_up'
  #
  before_action :block_authenticated_user, { only: [:new, :create] }
  #
  # Blocking unauthenticated users from '/users/edit'
  # ** 'authenticate_scope!' should be killed
  # ** https://github.com/plataformatec/devise/blob/master/app/controllers
  #
  before_action      :block_unauthenticated_user, { only: [:edit, :update, :cancel, :destroy] }
  skip_before_action :authenticate_scope!,        { only: [:edit, :update, :cancel, :destroy] }
  #
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]
  #
  # GET /users/sign_up
  #
  def new
    #
    # Defining '@user' as a new instance, and passing to 'app/views/.../new.html.haml'
    # ** 'super' removed from all actions (seemingly doing harm)
    #
    @user = User.new
    #
  end
  #
  # POST /users
  #
  def create
    #
    # Creating '@user' from parameters it's got
    #
    @user = User.new(create_params)
    #
    # Uploading 'profile_picture' if existing
    #
    profile_picture_upload("create")
    #
    # If a user has been successfully saved
    #
    if @user.update_attributes(create_params)
      #
      # ** '@token' is not encrypted!!
      #     Creating and encrypted '@token' is not needed unlike 'passwords_controller'
      #
      # ** Sending 'confirmation_instructions' and saving data
      #    are automatically done (why?)
      #
      # Displaying a flash message and redirecting
      #
      flash[:notice] = "You will receive the instruction to activate your account!"
      #
      render("users/registrations/new")
      #
    else
      #
      # Redirecting
      # ** Error messages are automatically generated
      #
      render("users/registrations/new")
      #
    end
    #
  end
  #
  # GET /users/edit
  #
  def edit
    #
    # Definding '@user' as '@current_user', and passing to 'app/views/.../edit.html.haml'
    #
    @user = @current_user
    #
  end
  #
  # PUT /users
  #
  def update
    #
    # Finding a user from a database
    # ** If defining '@user = User.find_by(params[:user][:current_email])',
    #    disabling us to find a user if filling in a wrong password
    #
    @user = @current_user
    #
    # Uploading 'profile_picture' if existing
    #
    profile_picture_upload("update")
    #
    # If a user has a valid password and has been successfully saved
    #
    if @user.valid_password?(params[:user][:current_password]) \
     && @user.update_attributes(update_params)
      #
      flash[:notice] = "You successfully updated your profile!"
      #
      redirect_to("/")
      #
    else
      #
      unless @user.valid_password?(params[:user][:current_password])
        @user.errors.add(:base, "You have a wrong password.")
      end
      #
      render("users/registrations/edit")
      #
    end
    #
  end
  #
  # DELETE /users
  #
  def destroy
    #
    # Deleting '@current_user' from a database
    #
    @current_user.destroy
    #
    flash[:notice] = "See you someday!"
    redirect_to("/users/sign_in")
    #
  end
  #
  private
    #
    # Defining 'create_params', for which 'user' key is must-have, and
    # 'name', ..., 'password_confirmation' are modifiable
    # ** https://stackoverflow.com/questions/1531047/update-attributes-unless-blank
    # ** https://ruby-doc.org/core-2.1.5/Hash.html#method-i-reject
    #
    def create_params
      params.require(:user).permit(
        :name, :email, :profile_picture,
        :password, :password_confirmation
      )
    end
    #
    # Defining 'update_params', for which
    # keys in 'create_params' are not modified, if having blank values
    #
    def update_params
      create_params.reject{ |k, v| v.blank? }
    end
    #
    # Uploading 'profile_picture'
    #
    def profile_picture_upload(state)
      #
      # If 'profile_picture' is uploaded
      #
      if params[:user][:profile_picture]
        #
        # Copying 'profile_picture'
        #
        pic = params[:user][:profile_picture]
        #
        # Renaming 'profile_picture', and saving its ""name"" to the database
        # ** 'img src' should start with '/assets/...'
        # ** (Attributes of 'ActionDispatch::Http::UploadedFile')
        # ** https://qiita.com/selmertsx/items/2beb0d7ec0774cbbf050
        # ** https://qiita.com/k6i/items/d2c72394a490293277cc
        # ** (extname) https://www.xmisao.com/2013/11/29/ruby-file-basename-extname.html
        #
        ext_name = File.extname(pic.original_filename)
        params[:user][:profile_picture] = "/#{profile_picture_path}/#{@user.id}#{ext_name}"
        #
        # Saving its ""data"" to the designated directory
        # ** A saving directory should start with 'public/assets/...'
        #
        File.binwrite("public/#{params[:user][:profile_picture]}", pic.read)
      #
      # If not, defining 'profile_picture' as 'default.png'
      #
      elsif state == "create"
        #
        params[:user][:profile_picture] = "/#{profile_picture_path}/default.png"
        #
      end
      #
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
