module Api
  module V1
    class TaskCategoriesController < ApplicationController
      before_action :authenticate

      def index
        task_categories = current_user.created_task_categories.order(:order)
        render json: task_categories.map do |task_category|
          omit_task_category(task_category)
        end
      end

      def show
        task_category = current_user.created_task_categories.find(params[:id])
        render json: omit_task_category(task_category)
      end

      def create
        task_category = current_user.created_task_categories.build(task_category_params)
        task_category.order = current_user.created_task_categories.length - 1
        if task_category.save
          render json: omit_task_category(task_category)
        end
      end

      def update
        task_category = current_user.created_task_categories.find(params[:id])
        if task_category.update(task_category_params)
          render json: omit_task_category(task_category)
        end
      end

      def destroy
        task_category = current_user.created_task_categories.find(params[:id])
        task_category.destroy!

        TaskCategory.transaction do
          task_categories = current_user.created_task_categories.where(order: task_category.order..Float::INFINITY).order(:order)
          task_categories.each_with_index do |task_category_, index|
            if task_category_.order != task_category.order + index
              task_category_.order = task_category.order + index
              task_category_.save!
            end
          end
        end
      end

      def reorder
        task_category = current_user.created_task_categories.find(params[:id])
        from = task_category.order
        to = params[:order]

        TaskCategory.transaction do
          if from < to
            task_categories = current_user.created_task_categories.where(order: (from + 1)..to).order(:order)
            task_categories.each do |task_category_|
              task_category_.order -= 1
              task_category_.save!
            end
          elsif to < from
            task_categories = current_user.created_task_categories.where(order: to..(from - 1)).order(:order)
            task_categories.each do |task_category_|
              task_category_.order += 1
              task_category_.save!
            end
          end
          task_category.order = to
          task_category.save!
        end

        task_categories = current_user.created_task_categories.order(:order)
        render json: task_categories.map do |task_category|
          omit_task_category(task_category)
        end
      end

      private

        def task_category_params
          params.permit(:id, :name, :order)
        end

        def omit_task_category(task_category)
          {
            id: task_category.id,
            name: task_category.name,
            order: task_category.order
          }
        end
    end
  end
end
