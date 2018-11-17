class MessagesController < ApplicationController
  before_action :block_unauthenticated_user, { only: :index }

  def index
  end
end
