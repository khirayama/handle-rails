class TaskCategory < ApplicationRecord
  belongs_to :user, class_name: 'User'
  has_many :tasks, dependent: :destroy
end
