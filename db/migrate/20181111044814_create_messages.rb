class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :user_id
      t.integer :sent_from
      t.timestamp :timestamp
      t.text :contents

      t.timestamps null: false
    end
  end
end
