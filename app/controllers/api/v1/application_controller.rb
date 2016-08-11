module Api
  module V1
    class ApplicationController < ActionController::API

      def current_user_information
        authenticate
      end

      rescue_from StandardError do |e|
        error_log(e)
        render json: errors_json('500', 'Internal Server Error'),  status: :internal_server_error
      end

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
          render json: errors_json('401', 'Unauthorized'),  status: :unauthorized
        end

        def errors_json(code, message)
          {
            code: code,
            errors: [
              message: message
            ]
          }.to_json
        end
    end
  end
end
