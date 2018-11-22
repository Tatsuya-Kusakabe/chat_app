class User < ActiveRecord::Base
  #
  # Defining 'active_relationship' using 'Relationship' model,
  # in which 'applicant_id' is a user in scope
  # ** When a user is deleted, this relationship is also deleted
  # ** http://www.coma-tech.com/archives/258/
  #
  has_many :active_relationship, class_name:  "Relationship",
                                 foreign_key: "applicant_id",
                                 dependent:   :destroy
  #
  # Defining 'active_friends' through 'active_relationship,
  # in which 'recipient_id's are 'active_friends'
  #
  has_many :active_friends, through: :active_relationship,
                            source:  "recipient"
  #
  # Defining 'passive_relationship' using 'Relationship' model,
  # in which 'recipient_id' is a user in scope
  # ** When a user is deleted, this relationship is also deleted
  # ** http://www.coma-tech.com/archives/258/
  #
  has_many :passive_relationship, class_name:  "Relationship",
                                  foreign_key: "recipient_id",
                                  dependent:   :destroy
  #
  # Defining 'passive_friends' through 'passive_relationship,
  # in which 'applicant_id's are 'passive_friends'
  #
  has_many :passive_friends, through: :passive_relationship,
                             source:  "applicant"
  #
  # Defining 'sent_messages' using 'Message' model,
  # in which a message is 'sent_from' a user in scope
  # ** When a user is deleted, these messages are also deleted
  #
  has_many :sent_messages, class_name:  "Message",
                           foreign_key: "sent_from",
                           dependent:   :destroy
  #
  # Defining 'received_messages' using 'Message' model,
  # in which a message is 'sent_to' a user in scope
  # ** When a user is deleted, these messages are also deleted
  #
  has_many :received_messages, class_name:  "Message",
                               foreign_key: "sent_to",
                               dependent:   :destroy
  #
  # Including default devise modules. Others available are: { :omniauthable }
  # ** https://qiita.com/Salinger/items/873e3c667462746ae707
  #
  devise :database_authenticatable,   :rememberable, :recoverable,
         :registerable, :confirmable, :lockable,
         :validatable,  :timeoutable, :trackable
  #
  # Adding validations
  #
  validates :name, { presence: true }
  #
  # ** 'devise :validatable' automatically performs confirmation
  # ** http://yoshitsugufujii.github.io/blog/2015/06/08/devise-skip-password-check/
  #
  # validates :email,              { presence: true, allow_blank: true, uniqueness: true }
  # validates :encrypted_password, { presence: true, allow_blank: true }
  #
  # Overriding 'Devise::Encryptor'
  # ** Since referred such as '@user.valid_token?', it should be defined in 'models/user.rb'
  # ** https://github.com/plataformatec/devise/blob/master/lib/devise/models/database_authenticatable.rb
  # ** https://github.com/plataformatec/devise/blob/715192a7709a4c02127afb067e66230061b82cf2/lib/devise/encryptor.rb
  #
  def encryption(token)
    Devise::Encryptor.digest(self.class, token)
  end
  #
  def valid_token?(encrypted_token, token)
    Devise::Encryptor.compare(self.class, encrypted_token, token)
  end
  #
end
