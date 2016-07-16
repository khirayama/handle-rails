class CreateTaskCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :task_categories do |t|
      t.integer :user_id, null: false
      t.string :name, null: false
      t.column :order, 'int unsigned', null: false

      t.timestamps
    end

    add_index :task_categories, [:user_id]
  end
end
