
# Responsible for 'root path' and commonly-used methods
class ApplicationController < ActionController::Base

  # Including 'SignInOut' module to override 'sign_in' and 'sign_out'
  # ** https://github.com/plataformatec/devise/blob/715192a7709a4c02127afb067e66230061b82cf2
  #    /lib/devise/controllers/sign_in_out.rb
  include Devise::Controllers::SignInOut

  # Defining '@current_user' whenever calling all actions
  before_action :current_user

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Rendering a root page by 'react-main'
  before_action :block_unauthenticated_user, only: :index

  # Designating 'root_path'
  def index; end

  # Remembering a 'sign in' state
  def sign_in(user)

    # Overriding from 'SignInOut'
    super

    # Updating 'session'
    session[:user_id] = user.id

  end

  # Abondoning a 'log in' state
  def sign_out

    # Overriding from 'SignInOut'
    super

    # Updating 'session' and '@current_user'
    session[:user_id] = nil
    @current_user     = nil

  end

  # Defining '@current_user'
  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  # Protecting access from unauthenticated users
  # ** 'authenticate_user!' is already defined in 'DeviseController', but can't be used
  # ** https://blog.willnet.in/entry/2013/08/06/152034
  def block_unauthenticated_user
    if current_user.nil?
      flash[:notice] = 'You need to sign in or sign up.'
      redirect_to('/users/sign_in')
    end
  end

  # Protecting access from authenticated users
  def block_authenticated_user
    if current_user
      flash[:notice] = 'You already signed in.'
      redirect_to('/')
    end
  end

  # Defining a path to save 'profile_picture'
  def profile_picture_path
    return 'assets/images'
  end

  # Extracting a list of 'friends_id'
  def friends_id

    # Extracting 'relationship' related to '@current_user'
    active_relationships  = Relationship.where(applicant_id: @current_user.id)
    passive_relationships = Relationship.where(recipient_id: @current_user.id)

    # Making a list of 'friends_id' immutably
    # https://stackoverflow.com/questions/9072689
    active_friends_id = active_relationships.map(&:recipient_id)
    passive_friends_id = passive_relationships.map(&:applicant_id)

    # Returning 'friends_id'
    return active_friends_id + passive_friends_id

  end

end
