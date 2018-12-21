
# Responsible for 'message' model
class Message < ActiveRecord::Base

  # Columns 'sent_from' and 'sent_to' in 'Message' model
  # are connected with 'id' in 'User' model
  # ** Defining like 'belongs_to :sent_from' seemingly does harm
  # ** https://stackoverflow.com/questions/43146055/rails-activerecordassociationtypemismatch-error
  belongs_to :sender, inverse_of: :sent_messages,
                      class_name: 'User',
                      foreign_key: 'sent_from'

  belongs_to :receiver, inverse_of: :received_messages,
                        class_name: 'User',
                        foreign_key: 'sent_to'

  # Adding validations
  validate :sent_from_to_different

  private

    # 'sent_from' and 'sent_to' should be different
    # ** https://api.rubyonrails.org/classes/ActiveModel/Errors.html#method-i-add
    def sent_from_to_different
      valid = (sent_from != sent_to)
      errors.add(:base, 'You cannot send your message to yourself.') unless valid
    end

end
