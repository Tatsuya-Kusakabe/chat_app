class CreateAccessLogs < ActiveRecord::Migration
  def change
    create_table :access_logs do |t|
      t.integer :recipient
      t.integer :currentUser

      t.timestamps null: false
    end
  end
end
