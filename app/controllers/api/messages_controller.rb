# 1. 'config/routes.rb' 
#    Defining routings for api/messages#(index, show, etc...)

# 2. 'app/controllers/api/message_controller.rb'
#    Defining actions for index, show, etc...
#    Rendering in 'json' format

class Api::MessagesController < ApplicationController
  def index
    @messages = Message.all
    render json: @messages
  end
end
