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
        make_order_sequence
      end

      def reorder
        tasks = current_user.created_task_categories.find(params[:task_category_id]).tasks.order(:order)
        from = params[:from]
        to = params[:to]

        if from < to
          tasks.each do |task|
            if task.order == from
              task.order = to
              task.save
            elsif from < task.order && task.order <= to
              task.order -= 1
              task.save
            end
          end
        elsif to < from
          tasks.each do |task|
            if task.order == from
              task.order = to
              task.save
            elsif to < task.order && task.order <= from
              task.order += 1
              task.save
            end
          end
        end

        make_order_sequence

        @tasks = current_user.created_task_categories.find(params[:task_category_id]).tasks.order(:order)
        render '/api/v1/tasks/index'
      end

      private

        def task_params
          params.permit(:id, :text, :completed, :order, :task_category_id)
        end

        def make_order_sequence
          task_categories = current_user.created_task_categories.order(:order)
          task_categories.each do |task_category|
            task_category.tasks.order(:order).each_with_index do |task, index|
              task.order = index
              task.save
            end
          end
        end
    end
  end
end
