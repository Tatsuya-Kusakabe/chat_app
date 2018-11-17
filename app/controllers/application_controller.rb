class ApplicationController < ActionController::Base
  #
  # Defining '@current_user' whenever you all actions
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
  # Defining a 'current user'
  #
  def current_user
    if session[:user_id]
      @current_user ||= User.find_by(id: session[:user_id])
    end
  end
  #
  # Protecting access from unauthenticated users
  #
  def block_unauthenticated_user
    if @current_user == nil
      flash[:notice] = "Please log in."
      redirect_to("/users/sign_in")
    end
  end
  #
  # Protecting access from authenticated users
  #
  def block_authenticated_user
    if @current_user
      flash[:notice] = "You already logged in."
      redirect_to("/")
    end
  end
  #
end
