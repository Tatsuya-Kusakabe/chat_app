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
  validate  :applicant_recipient_different
  # validate  :application_one_way
  #
  #
  #
  private
    #
    # An applicant and a recipient should be different
    # ** https://api.rubyonrails.org/classes/ActiveModel/Errors.html#method-i-add
    #
    def applicant_recipient_different
      valid = (applied_by_id != received_by_id)
      errors.add(:base, "An applicant and a recipient should be different") unless valid
    end
    #
end
