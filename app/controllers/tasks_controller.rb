class TasksController < ApplicationController
  before_action :authenticate

  def new
    @task = current_user.created_task_categories.find(params[:task_category_id]).tasks.build
  end

  def create
    @task = current_user.created_tasks.build(task_params)
    @task.task_category_id = params[:task_category_id]
    @task.order = current_user.created_task_categories.find(params[:task_category_id]).tasks.size
    if @task.save
      redirect_to task_categories_path
    else
      render :new
    end
  end

  def edit
    @task = current_user.created_tasks.find(params[:id])
  end

  def update
    @task = current_user.created_tasks.find(params[:id])
    if @task.update(task_params)
      redirect_to task_categories_path
    else
      render :edit
    end
  end

  def destroy
    @task = current_user.created_tasks.find(params[:id])
    @task.destroy!
    redirect_to task_categories_path
  end

  private

    def task_params
      params.require(:task).permit(:text, :completed, :order)
    end
end
