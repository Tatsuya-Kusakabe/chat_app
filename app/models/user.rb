
# Responsible for 'user' model
class User < ActiveRecord::Base

  # Defining 'active_relationship' using 'Relationship' model,
  # in which 'applicant_id' is a user in scope
  # ** When a user is deleted, this relationship is also deleted
  # ** http://www.coma-tech.com/archives/258/
  has_many :active_relationship, inverse_of: :applicant,
                                 class_name: 'Relationship',
                                 foreign_key: 'applicant_id',
                                 dependent: :destroy

  # Defining 'active_friends' through 'active_relationship,
  # in which 'recipient_id's are 'active_friends'
  has_many :active_friends, through: :active_relationship,
                            source: 'recipient'

  # Defining 'passive_relationship' using 'Relationship' model,
  # in which 'recipient_id' is a user in scope
  # ** When a user is deleted, this relationship is also deleted
  # ** http://www.coma-tech.com/archives/258/
  has_many :passive_relationship, inverse_of: :recipient,
                                  class_name: 'Relationship',
                                  foreign_key: 'recipient_id',
                                  dependent: :destroy

  # Defining 'passive_friends' through 'passive_relationship,
  # in which 'applicant_id's are 'passive_friends'
  has_many :passive_friends, through: :passive_relationship,
                             source: 'applicant'

  # Defining 'sent_messages' using 'Message' model,
  # in which a message is 'sent_from' a user in scope
  # ** When a user is deleted, these messages are also deleted
  has_many :sent_messages, inverse_of: :sender,
                           class_name: 'Message',
                           foreign_key: 'sent_from',
                           dependent: :destroy

  # Defining 'received_messages' using 'Message' model,
  # in which a message is 'sent_to' a user in scope
  # ** When a user is deleted, these messages are also deleted
  has_many :received_messages, inverse_of: :receiver,
                               class_name: 'Message',
                               foreign_key: 'sent_to',
                               dependent: :destroy

  # Including default devise modules. Others available are: { :omniauthable }
  # ** https://qiita.com/Salinger/items/873e3c667462746ae707
  devise :database_authenticatable,   :rememberable, :recoverable,
         :registerable, :confirmable, :lockable,
         :validatable,  :timeoutable, :trackable

  # Adding validations
  validates :name, presence: true

  # Extracting an array of 'friend_ids' (moved from 'application_controller.rb')
  def friend_ids

    # Extracting 'relationship' related to '@current_user'
    active_relationships = Relationship.where(applicant_id: self.id)
    passive_relationships = Relationship.where(recipient_id: self.id)

    # Making a list of 'friends_id' immutably
    # https://stackoverflow.com/questions/9072689
    active_friend_ids = active_relationships.map(&:recipient_id)
    passive_friend_ids = passive_relationships.map(&:applicant_id)

    # Returning 'friends_id'
    return active_friend_ids + passive_friend_ids

  end

  # Extracting an array of 'friend' objects
  # ** https://teratail.com/questions/97764
  # ** ~~~ Pagination should be availavle ~~~
  def friends
    return User.where(id: self.friend_ids)
  end

  # Extracting an array of 'suggestion' objects
  # ** ~~~ Pagination should be availavle ~~~
  def suggestions
    return User.where.not(id: self.friend_ids)
  end

  # Extracting an array of 'messages' with 'friend'
  def messages_with(friend_id)

    # Extracting
    messages = Message.where(
      '(sent_from = ? and sent_to = ?) or (sent_from = ? and sent_to = ?)',
      self.id, friend_id, friend_id, self.id
    )

    # Sorting according to 'timestamp'
    # ** https://stackoverflow.com/questions/882070/
    messages_sorted = messages.sort_by(&:timestamp)

    # Returning 'messages_sorted' with the key 'friend'
    return messages_sorted

  end

  # ** 'devise :validatable' automatically performs confirmation
  # ** http://yoshitsugufujii.github.io/blog/2015/06/08/devise-skip-password-check/
  # validates :email,              { presence: true, allow_blank: true, uniqueness: true }
  # validates :encrypted_password, { presence: true, allow_blank: true }

  # Overriding 'Devise::Encryptor'
  # ** Since referred such as '@user.valid_token?', it should be defined in 'models/user.rb'
  # ** https://github.com/plataformatec/devise/blob/master/lib/devise/models/database_authenticatable.rb
  # ** https://github.com/plataformatec/devise/blob/715192a7709a4c02127afb067e66230061b82cf2/lib/devise/encryptor.rb
  def encryption(token)
    Devise::Encryptor.digest(self.class, token)
  end

  def valid_token?(encrypted_token, token)
    Devise::Encryptor.compare(self.class, encrypted_token, token)
  end

end
