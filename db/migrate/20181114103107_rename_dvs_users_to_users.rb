class RenameDvsUsersToUsers < ActiveRecord::Migration
  def change
    rename_table :dvs_users, :users
  end
end
