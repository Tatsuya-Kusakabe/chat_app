class Relationship < ActiveRecord::Base
  #
  # Columns 'applied_by_id' and 'received_by_id' in 'Relationship' model
  # are connected with 'id' in 'User' model
  #
  belongs_to :applied_by,  class_name: "User"
  belongs_to :received_by, class_name: "User"
  #
  # Adding validations
  #
  validates :applied_by_id,  { presence: true }
  validates :received_by_id, { presence: true }
end
