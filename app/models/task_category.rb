class TaskCategory < ApplicationRecord
  belongs_to :user, class_name: 'User'
  has_many :tasks, class_name: 'Task', foreign_key: :task_category_id
end
