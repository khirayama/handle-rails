class Task < ApplicationRecord
  belongs_to :user, class_name: 'User'
  belongs_to :task_category, class_name: 'TaskCategory'
end
