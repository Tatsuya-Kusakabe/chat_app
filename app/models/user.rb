
require 'active_support'
require 'active_support/core_ext'

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

  # Extracting an array of 'suggestion' objects (excluding 'self' also)
  # ** ~~~ Pagination should be availavle ~~~
  def suggestions
    return User.where.not(id: [*self.friend_ids, self.id])
  end

  # Extracting an array of 'messages'
  def messages(partner_ids:, top_newest_counts:)

    # Custom error messages (just in case handling too much data)
    max_ids = 50;
    max_ids_counts = 50 * 50;

    case
    when !top_newest_counts && partner_ids.length > max_ids;
      raise "Limit the number of friends below #{max_ids}"
    when top_newest_counts  && top_newest_counts * partner_ids.length > max_ids_counts;
      raise "Limit the number of messages or friends"
    end

    # Each function defined in 'private'
    _messages_raw = messages_raw(partner_ids: partner_ids)
    _messages_with_id = messages_with_id(messages: _messages_raw)
    _messages_latest = messages_latest(
      messages: _messages_with_id,
      partner_ids: partner_ids,
      top_newest_counts: top_newest_counts
    )

    return _messages_latest

  end

  # Extracting an array of 'relatioship' objects
  def relationships(partner_ids:)

    # Custom error messages (just in case handling too much data)
    max_ids = 100;

    case
    when partner_ids.length > max_ids;
      raise "Limit the number of friends below #{max_ids}"
    end

    # Each function defined in 'private'
    _relationships_raw = relationships_raw(partner_ids: partner_ids)
    _relationships_with_id = relationships_with_id(relationships: _relationships_raw)

    return _relationships_with_id

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

  private

    def messages_raw(partner_ids: partner_ids)

      # Extracting 'messages' (while avoiding 'N + 1 problem')
      # ** This should be avoided -> hoge = fuga.map { |foo| (Queries) }
      return messages = Message.where(
        '(sent_from = ? and sent_to IN (?)) or
         (sent_to = ? and sent_from IN (?))',
        self.id, partner_ids, self.id, partner_ids

      # ** Sorting with SQL (.order) is quicker than Rails (.sort_by)
      ).order(:timestamp)

    end

    def relationships_raw(partner_ids: partner_ids)

      # Extracting relationships (while avoiding 'N + 1 problem')
      return relationships = Relationship.where(
        '(applicant_id = ? and recipient_id IN (?)) or
         (recipient_id = ? and applicant_id IN (?))',
        self.id, partner_ids, self.id, partner_ids
      )

    end

    def messages_with_id(messages: messages)

      return messages_with_id = messages.map do |message|
        # Defining 'partner_id' to add
        partner_id = (message.sent_from != self.id) \
          ? message.sent_from : message.sent_to

        # '{ **hoge }' in Ruby works like '{ ...hoge }' in JavaScript
        # ** # http://yrfreelance.com/2018/05/18/
        # 'Object' should be converted into 'Hash' using '.attributes'
        # ** https://qiita.com/ashi_psn/items/4880d73b362e64d29740
        # 'Only Symbol Keys Are Supported' for '**' (string keys not)
        # ** http://wizardofogz.com/ruby/2015/10/02/ruby-double-splat.html
        # '.symbolize_keys' changes keys from 'string' to 'symbol'
        # ** https://apidock.com/rails/Hash/symbolize_keys
        hash = message.attributes.symbolize_keys

        # Adding 'partner_id' for each 'message'
        # ** 'partner_id' could be equal to 'sent_from' or 'sent_to'
        { partner_id: partner_id, **hash }
      end

    end

    def relationships_with_id(relationships: relationships)

      return relationships_with_id = relationships.map do |relationship|
        partner_id = (relationship.applicant_id != self.id) \
          ? relationship.applicant_id
          : relationship.recipient_id
        hash = relationship.attributes.symbolize_keys
        { partner_id: partner_id, **hash }
      end

    end

    def messages_latest(
      messages: messages,
      partner_ids: partner_ids,
      top_newest_counts: top_newest_counts
    )

      # For each 'partner_id'
      latest_messages = partner_ids.map do |partner_id|
        # Extracting 'messages' matching with 'partner_id'
        _messages_before_pickup = messages.select do |message|
          message[:partner_id] == partner_id
        end

        # Picking up latest messages according to 'top_newest_counts'
        _messages_after_pickup = top_newest_counts \
          ? _messages_before_pickup.last(top_newest_counts) \
          : _messages_before_pickup
      end

      # Converting '[[{..}, {..}], [{..}, {..}]]' to '[{..}, {..}, {..}, {..}]'
      # ** https://ref.xaio.jp/ruby/classes/array/flatten
      return latest_messages.flatten

    end

end
