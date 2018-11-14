class ChangeIntLimitInMessages < ActiveRecord::Migration
  def change
    change_column :messages, :timestamp, :integer, limit: 8
  end
end
