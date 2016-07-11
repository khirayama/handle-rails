class TaskCategoriesController < ApplicationController
  def index
    @task_categories = current_user.created_task_categories
  end

  def create
  end
end
