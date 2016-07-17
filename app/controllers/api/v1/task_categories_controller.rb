module Api
  module V1
    class TaskCategoriesController < ApplicationController
      before_action :authenticate

      def index
        @task_categories = current_user.created_task_categories
        render '/api/v1/task_categories/index'
      end

      def show
        @task_category = current_user.created_task_categories.find(params[:id])
        render '/api/v1/task_categories/show'
      end

      def create
        @task_category = current_user.created_task_categories.build(task_category_params)
        @task_category.order = current_user.created_task_categories.length
        if @task_category.save
          render '/api/v1/task_categories/show'
        end
      end

      def update
        @task_category = current_user.created_task_categories.find(params[:id])
        if @task_category.update(task_category_params)
          render '/api/v1/task_categories/show'
        end
      end

      def destroy
        @task_category = current_user.created_task_categories.find(params[:id])
        @task_category.destroy!
      end

      private

        def task_category_params
          params.permit(:id, :name, :order)
        end
    end
  end
end
