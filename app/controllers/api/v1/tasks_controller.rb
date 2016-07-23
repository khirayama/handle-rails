module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate

      def index
        tasks = current_user.created_tasks
        # render partial: '/api/v1/tasks/index', collection: tasks, as: :tasks
        render '/api/v1/tasks/index', locals: { tasks: tasks }
      end

      def show
        task = current_user.created_tasks.find(params[:id])
        render '/api/v1/tasks/show', locals: { task: task }
      end

      def create
        task = current_user.created_tasks.build(task_params)
        task.order = current_user.created_task_categories.find(params[:task_category_id]).tasks.size
        if task.save
          render '/api/v1/tasks/show', locals: { task: task }
        end
      end

      def update
        task = current_user.created_tasks.find(params[:id])
        if task.update(task_params)
          render '/api/v1/tasks/show', locals: { task: task }
        end
      end

      def destroy
        task = current_user.created_tasks.find(params[:id])
        task.destroy!
        make_order_sequence
      end

      def reorder
        task = current_user.created_tasks.find(params[:id])
        from = task.order
        to = params[:order]

        if from < to
          tasks = current_user.created_task_categories.find(task.task_category_id).tasks.where(order: (from + 1)..to).order(:order)
          tasks.each do |task_|
            task_.order -= 1
            task_.save
          end
        elsif to < from
          tasks = current_user.created_task_categories.find(task.task_category_id).tasks.where(order: to..(from - 1)).order(:order)
          tasks.each do |task_|
            task_.order += 1
            task_.save
          end
        end
        task.order = to
        task.save

        tasks = current_user.created_tasks.order(:order)
        render '/api/v1/tasks/index', locals: { tasks: tasks }
      end

      def move
        # TODO: Change params to id, order, task_category_id and integrate reorder action
        currentTasks = current_user.created_task_categories.find(params[:current_task_category_id]).tasks
        targetTasks = current_user.created_task_categories.find(params[:target_task_category_id]).tasks

        targetTask = currentTasks.where(order: params[:from]).first
        targetTask.order = params[:to]
        targetTask.task_category_id = params[:target_task_category_id]
        targetTask.save

        decrementOrderTasks = currentTasks.where(order: (params[:from] + 1)..Float::INFINITY)
        decrementOrderTasks.each do |task|
          task.order -= 1
          task.save
        end

        incrementOrderTasks = targetTasks.where(order: (params[:to])..Float::INFINITY)
        incrementOrderTasks.each do |task|
          task.order += 1
          task.save
        end

        make_order_sequence

        tasks = current_user.created_tasks
        render '/api/v1/tasks/index', locals: { tasks: tasks }
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
