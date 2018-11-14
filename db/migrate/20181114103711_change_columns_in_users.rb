class ChangeColumnsInUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :varchar
    add_column :users, :profile_picture, :text
    add_column :users, :status, :varchar
    add_column :users, :read, :boolean
    add_column :users, :timestamp_recipient, :integer, limit: 8
    add_column :users, :timestamp_user, :integer, limit: 8
  end
end
