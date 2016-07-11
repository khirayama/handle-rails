class User < ApplicationRecord
  has_many :created_task_categories, class_name: 'TaskCategory', foreign_key: :user_id
  has_many :created_tasks, class_name: 'Task', foreign_key: :user_id

  def self.find_or_create_from_auth_hash(auth_hash)
    provider = auth_hash[:provider]
    uid = auth_hash[:uid]
    nickname = auth_hash[:info][:nickname]
    image_url = auth_hash[:info][:image]

    User.find_or_create_by(provider: provider, uid: uid) do |user|
      user.nickname = nickname
      user.image_url = image_url
    end
  end
end
