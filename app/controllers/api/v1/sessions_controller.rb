module Api
  module V1
    class SessionsController < Api::V1::ApplicationController
      def create
        user = User.find_or_create_from_auth_hash(request.env['omniauth.auth'])
        session[:user_id] = user.id
        redirect_to '/'
      end

      def destroy
        reset_session
        redirect_to '/'
      end
    end
  end
end
