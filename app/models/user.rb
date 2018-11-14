class User < ActiveRecord::Base
  has_many :messages
  #
  # Activates 'has_seruce_password' to encrypt passwords
  #
  # has_secure_password
  #
  # Include default devise modules. Others available are: { :omniauthable }
  #
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable
  #
  # Add validations
  #
  validates :encrypted_password, { presence: true }
end
