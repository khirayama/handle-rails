module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate

      def index
        tasks = current_user.created_tasks
        render json: tasks.map do |task|
          omit_task(task)
        end
      end

      def show
        task = current_user.created_tasks.find(params[:id])
        render json: omit_task(task)
      end

      def create
        task = current_user.created_tasks.build(task_params)
        task.order = current_user.created_task_categories.find(params[:task_category_id]).tasks.size
        if task.save
          render json: omit_task(task)
        end
      end

      def update
        task = current_user.created_tasks.find(params[:id])
        if task.update(task_params)
          render json: omit_task(task)
        end
      end

      def destroy
        task = current_user.created_tasks.find(params[:id])
        Task.transaction do
          task.destroy!
          task_categories = current_user.created_task_categories.order(:order)
          task_categories.each do |task_category|
            task_category.tasks.order(:order).each_with_index do |task_, index|
              task_.order = index
              task_.save!
            end
          end
        end
      end

      def reorder
        task = current_user.created_tasks.find(params[:id])
        from = task.order
        to = params[:order]

        Task.transaction do
          if task.task_category_id == params[:task_category_id]
            if from < to
                tasks = current_user.created_task_categories.find(task.task_category_id).tasks.where(order: (from + 1)..to).order(:order)
                tasks.each do |task_|
                  task_.order -= 1
                  task_.save!
                end
            elsif to < from
              tasks = current_user.created_task_categories.find(task.task_category_id).tasks.where(order: to..(from - 1)).order(:order)
              tasks.each do |task_|
                task_.order += 1
                task_.save!
              end
            end
            task.order = to
            task.save!
          elsif task.task_category_id != params[:task_category_id]
            currentTasks = current_user
                      .created_task_categories.find(task.task_category_id)
                      .tasks
                      .where(order: (from + 1)..Float::INFINITY)
            currentTasks.each do |task_|
              task_.order -= 1
              task_.save!
            end

            targetTasks = current_user
                      .created_task_categories.find(params[:task_category_id])
                      .tasks
                      .where(order: to..Float::INFINITY)
            targetTasks.each do |task_|
              task_.order += 1
              task_.save!
            end

            task.task_category_id = params[:task_category_id]
            task.order = to
            task.save!
          end
        end

        tasks = current_user.created_tasks
        render json: tasks.map do |task|
          omit_task(task)
        end
      end

      private

        def task_params
          params.permit(:id, :text, :completed, :order, :task_category_id)
        end

        def omit_task(task)
          {
            id: task.id,
            text: task.text,
            completed: task.completed,
            order: task.order,
            task_category_id: task.task_category_id
          }
        end
    end
  end
end
