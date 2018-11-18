# 1. 'config/routes.rb'
#    Creating routings for 'api/messages' (index, create, etc...)

# 2. 'app/controllers/api/message_controller.rb'
#    Creating actions for index, create, etc...
#    Rendering in 'json' format

Rails.application.routes.draw do
  devise_for :users, module: :users
  #
  # Creating routes for '/api/messages'     (index, create, etc...)
  #
  namespace :api, { format: 'json' } do
    resources :messages
  end
  #
  root 'messages#index'
end
