module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate

      def index
        @tasks = current_user.created_tasks
        render '/api/v1/tasks/index'
      end

      def show
        @task = current_user.created_tasks.find(params[:id])
        render '/api/v1/tasks/show'
      end

      def create
        @task = current_user.created_tasks.build(task_params)
        @task.order = current_user.created_task_categories.find(params[:task_category_id]).tasks.size
        if @task.save
          render '/api/v1/tasks/show'
        end
      end

      def update
        @task = current_user.created_tasks.find(params[:id])
        if @task.update(task_params)
          render '/api/v1/tasks/show'
        end
      end

      def destroy
        @task = current_user.created_tasks.find(params[:id])
        @task.destroy!
      end

      private

        def task_params
          params.permit(:id, :text, :completed, :order, :task_category_id)
        end
    end
  end
end
