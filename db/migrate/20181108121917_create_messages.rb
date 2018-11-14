class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :user_id
      t.integer :from
      t.text :contents
      t.integer :from
      t.integer :timestamp
    end
  end
end
