class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.text :profilePicture
      t.string :status
      t.boolean :read

      t.timestamps null: false
    end
  end
end
