# 1. 'config/routes.rb'
#    Defining routings for api/messages#(index, show, etc...)

# 2. 'app/controllers/api/message_controller.rb'
#    Defining actions for index, show, etc...
#    Rendering in 'json' format

Rails.application.routes.draw do
  namespace :api, { format: 'json' } do
    resources :messages
  end

  root 'messages#index'
end
