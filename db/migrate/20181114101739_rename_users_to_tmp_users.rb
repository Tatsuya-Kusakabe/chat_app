class RenameUsersToTmpUsers < ActiveRecord::Migration
  def change
    rename_table :users, :tmp_users
  end
end
