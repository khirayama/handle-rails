module Api
  module V1
    # can't use ActionController::API because use session and cookie
    class ApplicationController < ActionController::Base

      private
        def current_user
          return unless session[:user_id]
          @current_user ||= User.find(session[:user_id])
        end

        def logged_in?
          !!session[:user_id]
        end

        def authenticate
          return if logged_in?
        end
    end
  end
end
