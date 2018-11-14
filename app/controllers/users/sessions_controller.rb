# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  # GET /user/sign_in
  def new
    #
    # Inheriting properties and methods from a parent class
    #
    super
    #
    # Finding a user from a database
    #
    @user = User.find_by(email: params[:email])
    #
    # If a user does exist and has the correct password
    #
    # if @user && @user.authenticate(params[:password])
  end

  # POST /user/sign_in
  # def create
  #   super
  # end

  # DELETE /user/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
