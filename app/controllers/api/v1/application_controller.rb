module Api
  module V1
    class ApplicationController < ActionController::Base
      protect_from_forgery with: :exception

      private
        def current_user
          return unless session[:user_id]
          @current_user ||= User.find(session[:user_id])
        end

        def logged_in?
          !!session[:user_id]
        end

        def authenticate
          binding.pry
          return if logged_in?
          redirect_to root_path, alert: 'Please log in'
        end
    end
  end
end
