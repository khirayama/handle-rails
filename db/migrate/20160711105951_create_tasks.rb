class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.integer :user_id, null: false
      t.integer :task_category_id, null: false
      t.text :text, null: false
      t.boolean :completed, null: false
      t.integer :order, null: false

      t.timestamps
    end
  end
end
