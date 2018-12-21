
# Responsible for 'relationship' model
class Relationship < ActiveRecord::Base

  # Columns 'applicant_id' and 'recipient_id' in 'Relationship' model
  # are connected with 'id' in 'User' model
  belongs_to :applicant, class_name: 'User'
  belongs_to :recipient, class_name: 'User'

  # Adding validations
  validates :applicant_id,                  presence: true
  validates :recipient_id,                  presence: true
  validate  :applicant_recipient_different, on: :create
  validate  :relationship_unique,           on: :create

  private

    # An applicant and a recipient should be different when 'create'
    # ** https://api.rubyonrails.org/classes/ActiveModel/Errors.html#method-i-add
    def applicant_recipient_different
      valid = (applicant_id != recipient_id)
      errors.add(:base, 'An applicant and a recipient should be different.') unless valid
    end

    # A relationship should be unique when 'create'
    def relationship_unique
      pair1 = Relationship.find_by(applicant_id: applicant_id, recipient_id: recipient_id)
      pair2 = Relationship.find_by(applicant_id: recipient_id, recipient_id: applicant_id)
      valid = (pair1.nil? && pair2.nil?)
      errors.add(:base, 'You are already friends.') unless valid
    end

end
