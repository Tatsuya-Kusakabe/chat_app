# 1. 'config/routes.rb'
#    Creating routings for 'api/messages' (index, create, etc...)

# 2. 'app/controllers/api/message_controller.rb'
#    Creating actions for index, create, etc...
#    Rendering in 'json' format

Rails.application.routes.draw do
  #
  root 'messages#index'
  #
  # Creating routes for '/api/messages' (index, create, etc...)
  #
  namespace :api, { format: 'json' } do
    resources :messages
  end
  #
  # Creating routes for '/users' with 'devise'
  # ** https://www.task-notes.com/entry/ruby/20170620/1497927600
  #
  devise_for :users, module: :users
  #
end
