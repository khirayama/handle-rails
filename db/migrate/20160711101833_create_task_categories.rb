class CreateTaskCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :task_categories do |t|
      t.integer :user_id, null: false
      t.string :name, null: false
      t.integer :order, null: false

      t.timestamps
    end
  end
end
