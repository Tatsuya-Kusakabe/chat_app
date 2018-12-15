
# 1. 'config/routes.rb'
#    Creating routings for 'api/messages' (index, create)

# 2. 'app/controllers/api/message_controller.rb'
#    Creating actions for index, create, and rendering in 'json' format

Rails.application.routes.draw do

  root 'application#index'

  # Creating routes for '/api/messages' and '/api/suggestions' (index, create)

  namespace :api, { format: 'json' } do
    resources :friends,     { only: [:index, :show] }
    resources :suggestions, { only: [:index, :show] }
    resources :messages,    { only: [:create] }
    resources :users,       { only: [:index, :update] }
  end

  # Creating routes for '/api_v2/friends' and so on...

  namespace :api_v2, { format: 'json' } do
    resources :friends,     { only: [:index] }
    resources :suggestions, { only: [:index] }
    resources :messages,    { only: [:index, :create, :show] }
  end

  # Creating routes for '/users' with 'devise'
  # ** https://www.task-notes.com/entry/ruby/20170620/1497927600

  devise_for :users, module: :users

end
