class TaskCategoriesController < ApplicationController
  before_action :authenticate

  def index
    @task_categories = current_user.created_task_categories
  end

  def new
    @task_category = current_user.created_task_categories.build
  end

  def create
    @task_category = current_user.created_task_categories.build(task_category_params)
    @task_category.order = current_user.created_task_categories.length
    if @task_category.save
      redirect_to task_categories_path
    else
      render :new
    end
  end

  def edit
    @task_category = current_user.created_task_categories.find(params[:id])
  end

  def update
    @task_category = current_user.created_task_categories.find(params[:id])
    if @task_category.update(task_category_params)
      redirect_to task_categories_path
    else
      render :edit
    end
  end

  def destroy
    @task_category = current_user.created_task_categories.find(params[:id])
    @task_category.destroy!
    redirect_to task_categories_path
  end

  private

    def task_category_params
      params.require(:task_category).permit(:name, :order)
    end
end
