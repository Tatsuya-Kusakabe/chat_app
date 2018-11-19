class ApplicationController < ActionController::Base
  #
  # Defining '@current_user' whenever calling all actions
  #
  before_action :current_user
  #
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #
  protect_from_forgery with: :exception
  #
  # Remembering a 'log in' state
  #
  def log_in(user)
    session[:user_id] = user.id
  end
  #
  # Abondoning a 'log in' state
  #
  def log_out
    session[:user_id] = nil
    @current_user     = nil
  end
  #
  # Defining '@current_user'
  #
  def current_user
    @current_user = @current_user || User.find_by(id: session[:user_id])
  end
  #
  # Protecting access from unauthenticated users
  # ** 'authenticate_user!' is already defined in 'DeviseController', but can't be used
  # ** https://blog.willnet.in/entry/2013/08/06/152034
  #
  def block_unauthenticated_user
    if current_user.nil?
      flash[:notice] = "You need to sign in or sign up."
      redirect_to("/users/sign_in")
    end
  end
  #
  # Protecting access from authenticated users
  #
  def block_authenticated_user
    if current_user
      flash[:notice] = "You already signed in."
      redirect_to("/")
    end
  end
  #
end
