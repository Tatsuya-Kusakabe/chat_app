class User < ActiveRecord::Base
  #
  # Defining 'active_relationship' using 'Relationship' model,
  # in which 'applied_by_id' is a user in scope
  # ** When a user is deleted, this relationship is also deleted
  # ** http://www.coma-tech.com/archives/258/
  #
  has_many :active_relationship, class_name:  "Relationship",
                                 foreign_key: "applied_by_id",
                                 dependent:   :destroy
  #
  # Defining 'active_friends' through 'active_relationship,
  # in which 'received_by_id's are 'active_friends'
  #
  has_many :active_friends, through: :active_relationship,
                            source:  "received_by"
  #
  # Defining 'passive_relationship' using 'Relationship' model,
  # in which 'received_by_id' is a user in scope
  # ** When a user is deleted, this relationship is also deleted
  # ** http://www.coma-tech.com/archives/258/
  #
  has_many :passive_relationship, class_name:  "Relationship",
                                  foreign_key: "received_by_id",
                                  dependent:   :destroy
  #
  # Defining 'passive_friends' through 'passive_relationship,
  # in which 'applied_by_id's are 'passive_friends'
  #
  has_many :passive_friends, through: :passive_relationship,
                             source:  "applied_by"
  #
  # Including default devise modules. Others available are: { :omniauthable }
  #
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable
  #
  # Adding validations
  # ** For example, if getting rid of 'allow_blank: true',
  #    the validations are activated both for 'presence: true' and 'valid.password?',
  #    which produces duplicate error messages
  # ** https://qiita.com/lasershow/items/0229855720aaf2be5fc8
  #
  validates :name,               { presence: true }
  validates :email,              { presence: true, allow_blank: true }
  validates :encrypted_password, { presence: true, allow_blank: true }
end
