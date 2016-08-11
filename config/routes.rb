Rails.application.routes.draw do
  # app
  get '/' => 'application#index'
  get '/settings' => 'application#index'
  get '/help' => 'application#index'

  namespace :api, { format: 'json' } do
    namespace :v1 do
      get '/current_user_information' => 'application#current_user_information'

      resources :task_categories
      put '/task_categories' => 'task_categories#reorder'

      resources :tasks
      put '/tasks' => 'tasks#reorder'

      get '/auth/:provider/callback' => 'sessions#create'
      get '/logout' => 'sessions#destroy'
    end
  end
end
