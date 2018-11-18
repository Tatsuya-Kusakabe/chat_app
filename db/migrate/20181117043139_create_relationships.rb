class CreateRelationships < ActiveRecord::Migration
  def change
    create_table :relationships do |t|
      t.integer :applied_from_id
      t.integer :applied_to_id

      t.timestamps null: false
    end
  add_index :relationships, :applied_from_id
  add_index :relationships, :applied_to_id
  add_index :relationships, [:applied_from_id, :applied_to_id], unique: true
  end
end
