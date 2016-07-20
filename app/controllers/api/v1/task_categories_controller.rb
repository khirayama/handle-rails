module Api
  module V1
    class TaskCategoriesController < ApplicationController
      before_action :authenticate

      def index
        task_categories = current_user.created_task_categories.order(:order)
        # render partial: '/api/v1/task_categories/show', collection: task_categories, as: :task_category
        render '/api/v1/task_categories/index', locals: { task_categories: task_categories }
      end

      def show
        task_category = current_user.created_task_categories.find(params[:id])
        render '/api/v1/task_categories/show', locals: { task_category: task_category }
      end

      def create
        task_category = current_user.created_task_categories.build(task_category_params)
        task_category.order = current_user.created_task_categories.length - 1
        if task_category.save
          render '/api/v1/task_categories/show', locals: { task_category: task_category }
        end
      end

      def update
        task_category = current_user.created_task_categories.find(params[:id])
        if task_category.update(task_category_params)
          render '/api/v1/task_categories/show', locals: { task_category: task_category }
        end
      end

      def destroy
        task_category = current_user.created_task_categories.find(params[:id])
        task_category.destroy!
        make_order_sequence
      end

      def reorder
        # TODO: Change params to id, order
        task_categories = current_user.created_task_categories.order(:order)
        from = params[:from]
        to = params[:to]

        if from < to
          task_categories.each do |task_category|
            if task_category.order == from
              task_category.order = to
              task_category.save
            elsif from < task_category.order && task_category.order <= to
              task_category.order -= 1
              task_category.save
            end
          end
        elsif to < from
          task_categories.each do |task_category|
            if task_category.order == from
              task_category.order = to
              task_category.save
            elsif to <= task_category.order && task_category.order < from
              task_category.order += 1
              task_category.save
            end
          end
        end

        task_categories = current_user.created_task_categories.order(:order)
        render '/api/v1/task_categories/index', locals: { task_categories: task_categories }
      end

      private

        def task_category_params
          params.permit(:id, :name, :order)
        end

        def make_order_sequence
          task_categories = current_user.created_task_categories.order(:order)
          task_categories.each_with_index do |task_category, index|
            task_category.order = index
            task_category.save
          end
        end
    end
  end
end
